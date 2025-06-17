const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const configRoutes = require('./routes/configRoutes');
const householdRoutes = require('./routes/householdRoutes');
const authRoutes = require('./routes/authRoutes');
const householdService = require('./services/householdService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const setCityMiddleware = (req, res, next) => {
    const city = req.query.city || 'imperatriz';
    householdService.setCity(city);
    next();
};

app.use('/api/config', configRoutes);
app.use('/api/households', setCityMiddleware, householdRoutes);
app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.send('ACS Risco Familiar API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});