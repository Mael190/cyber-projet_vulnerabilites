const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const saltRounds = 10;
const jwtSecret = 'dhuiHZZDèdzfh6"!rhFEHuifhiofejoief';

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

function generateToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
}

// Vérifie le jeton JWT
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    console.log('err :>> ', error);
    return null;
  }
}

module.exports = { hashPassword, comparePassword, generateToken, verifyToken };