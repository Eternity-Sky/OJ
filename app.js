require('dotenv').config(); // 加载环境变量

const express = require('express');
const { addUser, validateUser } = require('./models/User');
const { addProblem, getProblems } = require('./models/Problem');
const { addSubmission } = require('./models/Submission');
const { addBadge, getUserBadges } = require('./models/Badge');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

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
    secret: 'your_secret_key', // 替换为你的密钥
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }), // 使用 MongoDB 存储会话
    cookie: { secure: false } // 在开发环境中设置为 false
}));

// 路由
app.get('/', (req, res) => {
    const username = req.session.user; // 获取会话中的用户名
    res.render('index', { username }); // 将用户名传递给视图
});

// 用户注册页面
app.get('/register', (req, res) => {
    res.render('register'); // 确保有对应的视图文件
});

// 用户注册处理
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    await addUser(username, password, email);
    res.send('用户注册成功');
});

// 用户登录页面
app.get('/login', (req, res) => {
    res.render('login'); // 确保有对应的视图文件
});

// 用户登录处理
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const isValid = await validateUser(username, password);
    if (isValid) {
        req.session.user = username; // 保存用户信息到会话
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
    res.render('problems'); // 确保有对应的视图文件
});

// 获取比赛列表
app.get('/contests', (req, res) => {
    res.render('contests'); // 确保有对应的视图文件
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

const PORT = process.env.PORT || 3000; // 使用环境变量中的端口
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));