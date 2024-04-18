const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/');
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    const name = `${uuidv4()}.${extension}`;
    req.fileName = name;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;