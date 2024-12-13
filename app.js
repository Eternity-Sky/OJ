require('dotenv').config(); // 加载环境变量

const express = require('express');
const session = require('express-session');
const { addUser, validateUser } = require('./models/User'); // 保持用户模型
const { addContest, getContests } = require('./models/Contest'); // 保持比赛模型
const FileStorage = require('./models/FileStorage'); // 引入文件存储模块
const axios = require('axios');

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
    try {
        await addUser(username, password, email); // 确保 addUser 是异步的
        res.send('用户注册成功');
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).send('注册失败');
    }
});

// 用户登录页面
app.get('/login', (req, res) => {
    res.render('login'); // 确保有对应的视图文件
});

// 用户登录处理
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const isValid = await validateUser(username, password); // 确保 validateUser 是异步的
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
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).send('登录失败');
    }
});

// 获取题目列表
app.get('/problems', async (req, res) => {
    try {
        const problems = await getProblems(); // 确保 getProblems 是异步的并返回问题
        res.render('problems', { problems });
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).send('无法获取题目列表');
    }
});

// 获取比赛列表的 API 路由
app.get('/api/contests', (req, res) => {
    const contests = getContests(); // 从文件存储获取比赛
    res.json(contests);
});

// 获取题目列表的 API 路由
app.get('/api/problems', async (req, res) => {
    try {
        const response = await axios.get('https://leetcode.com/api/problems/all/');
        const problems = response.data.stat_status_pairs.map(problem => ({
            id: problem.stat.question_id,
            title: problem.stat.question__title,
            difficulty: problem.difficulty.level,
            link: `https://leetcode.com/problems/${problem.stat.question__title_slug}/`
        }));
        res.json(problems);
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).send('无法获取题目列表');
    }
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