const express = require('express');
const fileRoutes = require('./routes');
const authRoutes = require('./authRoutes');
const app = express();
const port = 3000;
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));

app.use(cors());
app.use(express.json());
app.use('/files', fileRoutes);
app.use(authRoutes);
app.use(express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});