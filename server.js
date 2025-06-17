import express from 'express';
import cors from 'cors';
import configRoutes from './routes/configRoutes.js';
import householdRoutes from './routes/householdRoutes.js';
import authRoutes from './routes/authRoutes.js';
import householdService from './services/householdService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());

app.use(express.json());

const setCityMiddleware = (req, res, next) => {
    const city = req.query.city || 'imperatriz-ma';
    householdService.setCity(city);
    next();
};

// Rotas da Aplicação
app.use('/api/config', configRoutes);
app.use('/api/households', setCityMiddleware, householdRoutes);
app.use('/api', authRoutes);

// Rota raiz
app.get('/', (req, res) => {
    res.send('ACS Risco Familiar API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});