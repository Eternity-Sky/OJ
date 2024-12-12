const crypto = require('crypto'); // 使用内置的 crypto 模块
let users = [];

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex'); // 使用 SHA-256 哈希
}

async function addUser(username, password, email) {
    const hashedPassword = hashPassword(password); // 哈希密码
    const user = { username, password: hashedPassword, email };
    users.push(user);
}

async function validateUser(username, password) {
    const user = users.find(u => u.username === username);
    if (user && user.password === hashPassword(password)) { // 比较哈希后的密码
        return true; // 验证成功
    }
    return false; // 验证失败
}

function getUsers() {
    return users;
}

module.exports = { addUser, validateUser, getUsers }; 