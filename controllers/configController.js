const getCityConfig = (req, res) => {
    const city = req.query.city;
    let config;
    try {
        if (city === 'imperatriz') {
            config = require('../config/coelhoSavassiConfig');
        } else if (city === 'curitiba') {
            config = require('../config/cityConfig');
        } else {
            config = require('../config/cityConfig');
        }
        res.json(config);
    } catch (error) {
        console.error("Failed to load city config:", error);
        res.status(404).json({ message: "Configuration not found for the specified city." });
    }
};

module.exports = {
    getCityConfig
};