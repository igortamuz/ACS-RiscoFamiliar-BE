import express from 'express';
import cors from 'cors';
import householdRoutes from './routes/householdRoutes.js';
import authRoutes from './routes/authRoutes.js';
import createConfigRoutes from './routes/configRoutes.js';
import { loadCityConfig } from './config/cityConfig.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const cityConfig = loadCityConfig(process.env.CITY_CODE || 'imperatriz-ma');

const configRoutes = createConfigRoutes(cityConfig);

// Rotas
app.use('/api/households', householdRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes); // Usa as rotas configuradas

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});