const User = require('../models/User');

exports.isAuthenticated = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: '请先登录' });
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.isAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: '请先登录' });
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: '需要管理员权限' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
