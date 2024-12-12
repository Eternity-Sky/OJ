const bcrypt = require('bcrypt'); // 添加 bcrypt 依赖
let users = [];

async function addUser(username, password, email) {
    const hashedPassword = await bcrypt.hash(password, 10); // 哈希密码
    const user = { username, password: hashedPassword, email };
    users.push(user);
}

async function validateUser(username, password) {
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        return true; // 验证成功
    }
    return false; // 验证失败
}

function getUsers() {
    return users;
}

module.exports = { addUser, validateUser, getUsers }; 