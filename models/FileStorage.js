const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data.json');

// 读取数据
function readData() {
    if (!fs.existsSync(dataFilePath)) {
        return { users: [], contests: [] }; // 如果文件不存在，返回空数据
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

// 写入数据
function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData }; 