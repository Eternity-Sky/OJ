const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: '用户名或邮箱已存在' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();
    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.redirect('/');
  });
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: '未登录' });
    }
    const user = await User.findById(req.session.userId)
      .select('-password')
      .populate('solvedProblems');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
