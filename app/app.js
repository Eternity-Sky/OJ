const http = require('http');

// 创建一个简单的 HTTP 服务器
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('欢迎来到 OJ 动态网站！\n');
});

// 服务器监听端口 8080
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`服务器正在端口 ${PORT} 上运行`);
}); 