const express = require('express');
const { addUser, validateUser } = require('./models/User');
const { addProblem } = require('./models/Problem');
const { addSubmission } = require('./models/Submission');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// 添加题目
app.post('/problems', (req, res) => {
    const { title, description, input, output } = req.body;
    addProblem(title, description, input, output);
    res.send('题目添加成功');
});

// 提交代码
app.post('/submit', (req, res) => {
    const { userId, problemId, code } = req.body;
    addSubmission(userId, problemId, code);
    res.send('提交成功');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 