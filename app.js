require('dotenv').config(); // 加载环境变量

const express = require('express');
const session = require('express-session');
const { addUser, validateUser } = require('./models/User'); // 保持用户模型
const { addContest, getContests } = require('./models/Contest'); // 保持比赛模型
const FileStorage = require('./models/FileStorage'); // 引入文件存储模块

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置静态文件目录
app.use(express.static('public'));

// 设置视图引擎为 EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// 设置会话中间件
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// 路由
app.get('/', (req, res) => {
    const username = req.session.user;
    res.render('index', { username });
});

// 用户注册页面
app.get('/register', (req, res) => {
    res.render('register'); // 确保有对应的视图文件
});

// 用户注册处理
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    addUser(username, password, email); // 使用文件存储
    res.send('用户注册成功');
});

// 用户登录页面
app.get('/login', (req, res) => {
    res.render('login'); // 确保有对应的视图文件
});

// 用户登录处理
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const isValid = validateUser(username, password); // 使用文件存储
    if (isValid) {
        req.session.user = username;
        res.send(`
            <script>
                alert('登录成功');
                window.location.href = '/';
            </script>
        `);
    } else {
        res.send('用户名或密码错误');
    }
});

// 获取题目列表
app.get('/problems', (req, res) => {
    const problems = getProblems(); // 从内存中获取问题
    res.render('problems', { problems }); // 将问题传递给视图
});

// 获取比赛列表的 API 路由
app.get('/api/contests', (req, res) => {
    const contests = getContests(); // 从文件存储获取比赛
    res.json(contests);
});

// 颁发徽章
app.post('/admin/give-badge', (req, res) => {
    const { userId, badgeName } = req.body;
    addBadge(userId, badgeName);
    res.send('徽章已颁发');
});

// 获取用户徽章
app.get('/user/:id/badges', (req, res) => {
    const userId = req.params.id;
    const userBadges = getUserBadges(userId);
    res.json(userBadges);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('服务器内部错误');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});