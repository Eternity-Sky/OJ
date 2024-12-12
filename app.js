const express = require('express');
const { addUser, validateUser } = require('./models/User');
const { addProblem, getProblems } = require('./models/Problem');
const { addSubmission } = require('./models/Submission');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置静态文件目录
app.use(express.static('public')); // 这行代码确保可以访问 public 目录下的文件

// 设置视图引擎为 EJS
app.set('view engine', 'ejs');
app.set('views', './views'); // 设置视图文件夹

// 路由
app.get('/', (req, res) => {
    res.render('index'); // 渲染首页
});

// 其他路由...