require('dotenv').config(); // 加载环境变量

const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise'); // 使用 mysql2 驱动

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

// 创建 MySQL 连接
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

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
    const [rows] = await db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]);
    res.send('用户注册成功');
});

// 用户登录页面
app.get('/login', (req, res) => {
    res.render('login'); // 确保有对应的视图文件
});

// 用户登录处理
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});