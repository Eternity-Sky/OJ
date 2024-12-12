let submissions = [];

function addSubmission(userId, problemId, code) {
    let result;
    try {
        // 这里可以添加题目评测逻辑
        result = eval(code); // 注意：eval 在生产环境中不安全
    } catch (error) {
        result = '运行错误: ' + error.message;
    }
    const submission = { userId, problemId, code, result };
    submissions.push(submission);
}

function getSubmissions() {
    return submissions;
}

module.exports = { addSubmission, getSubmissions }; 