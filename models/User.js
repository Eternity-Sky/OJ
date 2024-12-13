const { readData, writeData } = require('./FileStorage');

function addUser(username, password, email) {
    const data = readData();
    const user = { username, password, email };
    data.users.push(user);
    writeData(data);
}

function validateUser(username, password) {
    const data = readData();
    const user = data.users.find(u => u.username === username && u.password === password);
    return user !== undefined;
}

module.exports = { addUser, validateUser };