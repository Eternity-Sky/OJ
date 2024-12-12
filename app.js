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

// 用户注册
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    await addUser(username, password, email);
    res.send('用户注册成功');
});

// 用户登录
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const isValid = await validateUser(username, password);
    if (isValid) {
        res.send('登录成功');
    } else {
        res.send('用户名或密码错误');
    }
});

// 获取题目列表
app.get('/problems', (req, res) => {
    res.render('problems'); // 确保有对应的视图文件
});

// 获取比赛列表
app.get('/contests', (req, res) => {
    res.render('contests'); // 确保有对应的视图文件
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('服务器内部错误');
});