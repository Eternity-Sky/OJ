const { readData, writeData } = require('./FileStorage');

function addContest(title, description) {
    const data = readData();
    const contest = { title, description };
    data.contests.push(contest);
    writeData(data);
}

function getContests() {
    const data = readData();
    return data.contests;
}

module.exports = { addContest, getContests }; 