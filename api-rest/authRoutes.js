const express = require('express');
const router = express.Router();
const { addUser, getUserByEmail } = require('./filesServices');
const { comparePassword, generateToken } = require('./authServices');

router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    const user = await addUser(email, password, firstname, lastname);
    const token = generateToken({ userId: user.id });

    res.status(201).json({ token });
  } catch (err) {
    console.log('err :>> ', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (user && (await comparePassword(password, user.password))) {
      const token = generateToken({ userId: user.id });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.log('err :>> ', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;