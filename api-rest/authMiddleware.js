const jwt = require('jsonwebtoken');
const { verifyToken } = require('./authServices');
const { getFileById } = require('./filesServices');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid access token' });
  }

  req.user = decoded;
  next();
}

async function isOwner(req, res, next) {
  const fileId = req.params.id;
  const { userId } = req.user;

  try {
    const file = await getFileById(fileId);

    if (!file || file.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  } catch (err) {
    console.log('err :>> ', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { authenticateToken, isOwner };