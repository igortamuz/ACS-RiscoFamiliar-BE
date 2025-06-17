const cityConfig = require('../config/cityConfig');
const { coelhoSavassiSentinels } = require('../config/coelhoSavassiConfig');

const getCityConfig = (req, res) => {
    res.json(cityConfig);
};

const getCoelhoSavassiConfig = (req, res) => {
    res.json(coelhoSavassiSentinels);
};

module.exports = {
    getCityConfig,
    getCoelhoSavassiConfig
};