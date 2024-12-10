const express = require('express');
const router = express.Router();
const axios = require('axios');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const { isAuthenticated } = require('../middleware/auth');

// Submit solution
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: '题目不存在' });
    }

    const submission = new Submission({
      user: req.session.userId,
      problem: problemId,
      language,
      code
    });

    await submission.save();

    // Send to Judge0 API for evaluation
    const judge0Response = await axios.post(process.env.JUDGE0_API_URL + '/submissions', {
      source_code: code,
      language_id: language,
      stdin: problem.testCases[0].input,
      expected_output: problem.testCases[0].output,
      cpu_time_limit: problem.timeLimit / 1000,
      memory_limit: problem.memoryLimit * 1024
    }, {
      headers: {
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY
      }
    });

    // Update submission with token
    submission.judgeToken = judge0Response.data.token;
    await submission.save();

    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get submission result
router.get('/:id', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('user', 'username')
      .populate('problem', 'title');
    
    if (!submission) {
      return res.status(404).json({ message: '提交记录不存在' });
    }

    if (submission.status === 'Pending' && submission.judgeToken) {
      // Check Judge0 API for result
      const judge0Response = await axios.get(
        `${process.env.JUDGE0_API_URL}/submissions/${submission.judgeToken}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY
          }
        }
      );

      // Update submission status based on Judge0 response
      const result = judge0Response.data;
      submission.status = mapJudge0Status(result.status.id);
      submission.executionTime = result.time;
      submission.memoryUsed = result.memory;
      submission.errorMessage = result.stderr || result.compile_output;
      
      await submission.save();

      // Update problem statistics if needed
      if (submission.status === 'Accepted') {
        await Problem.findByIdAndUpdate(submission.problem, {
          $inc: { acceptedCount: 1, totalSubmissions: 1 }
        });
      } else {
        await Problem.findByIdAndUpdate(submission.problem, {
          $inc: { totalSubmissions: 1 }
        });
      }
    }

    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper function to map Judge0 status to our status
function mapJudge0Status(statusId) {
  const statusMap = {
    1: 'Pending',
    2: 'Running',
    3: 'Accepted',
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Memory Limit Exceeded',
    7: 'Runtime Error',
    8: 'Compilation Error'
  };
  return statusMap[statusId] || 'Runtime Error';
}

module.exports = router;
