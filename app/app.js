const express = require('express');
const path = require('path');
const app = express();

// 设置 EJS 作为视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静态文件托管
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.get('/', (req, res) => {
    res.render('index'); // 渲染 index.ejs
});

// 其他路由和中间件
// ...

// 服务器监听端口
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`服务器正在端口 ${PORT} 上运行`);
}); 