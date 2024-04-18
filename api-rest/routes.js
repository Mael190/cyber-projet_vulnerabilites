const express = require('express');
const router = express.Router();
const fileService = require('./filesServices');
const upload = require('./multerServices');
const path = require('path');
const { authenticateToken, isOwner } = require('./authMiddleware');

router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  const validExtensions = ['png', 'jpeg', 'pdf', 'docx'];

  try {
    const { userId } = req.user;
    const extension = req.file.originalname.split('.').pop();
    
    if(!validExtensions.includes(extension)) return res.status(400).send();

    const file = await fileService.addFile(req.file, `/files/download/${req.fileName}`, userId);
    res.status(201).json(file);
  } catch (err) {
    console.log('err :>> ', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const files = await fileService.getAllFiles(userId);
    res.status(200).json(files);
  } catch (err) {
    console.log('err :>> ', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticateToken, isOwner, async (req, res) => {
  try {
    const file = await fileService.getFileById(req.params.id);
    if (file) {
      res.status(200).json(file);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    console.log('err :>> ', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/download/:id', (req, res) => {
  const id = req.params.id;
  const absolutePath = path.join(__dirname, './files', id);

  res.sendFile(absolutePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while trying to download the file.' });
    }
  });
});

module.exports = router;