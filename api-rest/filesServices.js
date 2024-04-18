
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword } = require('./authServices');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, user_id TEXT, name TEXT, publicFilePath TEXT, size INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, password TEXT, firstname TEXT, lastname TEXT)');
});

const addFile = (file, publicFilePath, userId) => {
  return new Promise((resolve, reject) => {
    const { originalname: name, path: filepath, size } = file;
    const id = uuidv4();

    db.run('INSERT INTO files (id, user_id, name, publicFilePath, size) VALUES (?, ?, ?, ?, ?)', [id, userId, name, publicFilePath, size], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, name, publicFilePath });
      }
    });
  });
};

const getAllFiles = (userId) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM files WHERE user_id = ?', [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getFileById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM files WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

async function addUser(email, password, firstname, lastname) {
  const id = uuidv4();
  const hashedPassword = await hashPassword(password);

  return new Promise((resolve, reject) => {
    db.run('INSERT INTO users (id, email, password, firstname, lastname) VALUES (?, ?, ?, ?, ?)', [id, email, hashedPassword, firstname, lastname], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, email, firstname, lastname });
      }
    });
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

module.exports = { addFile, getAllFiles, getFileById, addUser, getUserByEmail };