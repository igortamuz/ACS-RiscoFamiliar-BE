import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import householdRoutes from './routes/householdRoutes.js';
import authRoutes from './routes/authRoutes.js';
import configRoutes from './routes/configRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear o corpo das requisições em JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para identificar a aplicação (cidade) através do header 'X-App-Id'
app.use((req, res, next) => {
  const appId = req.headers['x-app-id'];
  if (!appId) {
    return res.status(400).json({ message: 'O header X-App-Id é obrigatório.' });
  }
  req.appId = appId;
  next();
});

app.use('/api/households', householdRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);

app.get('/', (req, res) => {
  res.send('API do Risco Familiar no Ar!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});