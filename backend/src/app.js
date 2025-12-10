const dotenv = require('dotenv');
dotenv.config();  // Load .env now

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const voterRoutes = require('./routes/voterRoutes');
const ecRoutes = require('./routes/ecRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/voter', voterRoutes);
app.use('/ec', ecRoutes);
app.use('/mslr', apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});