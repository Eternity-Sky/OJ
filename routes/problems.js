const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Get all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find()
      .select('title difficulty acceptedCount totalSubmissions tags')
      .populate('author', 'username');
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single problem
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('author', 'username');
    if (!problem) {
      return res.status(404).json({ message: '题目不存在' });
    }
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new problem (admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const problem = new Problem({
      ...req.body,
      author: req.session.userId
    });
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update problem (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(problem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete problem (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    await Submission.deleteMany({ problem: req.params.id });
    res.json({ message: '题目已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
