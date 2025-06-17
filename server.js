import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import configRoutes from './routes/configRoutes.js';
import householdRoutes from './routes/householdRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/households', householdRoutes);

app.get('/', (req, res) => {
  res.send('ACS Risco Familiar API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});