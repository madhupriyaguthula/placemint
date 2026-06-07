require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors({ 
  origin: ['http://localhost:5173', 'https://placemint-eight.vercel.app'],
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/leetcode', require('./routes/leetcode'));
app.use('/api/github',   require('./routes/github'));
app.use('/api/codechef', require('./routes/codechef'));
app.use('/api/analyze',  require('./routes/analyze'));
app.use('/api/company-detail', require('./routes/company-detail'));
app.get('/', (req, res) => res.send('PlaceMint API running!'));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`));