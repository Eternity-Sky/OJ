let contests = []; // 存储比赛的数组

function addContest(title, description) {
    const contest = { title, description };
    contests.push(contest);
}

function getContests() {
    return contests; // 返回所有比赛
}

module.exports = { addContest, getContests }; 