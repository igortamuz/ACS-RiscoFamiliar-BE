import coelhoSavassiConfig from '../config/coelhoSavassiConfig.js';
import CITY_CONFIG from '../config/cityConfig.js';

const getCityConfig = (req, res) => {
    const cityKey = req.query.city;

    if (cityKey && CITY_CONFIG[cityKey]) {
        res.json(CITY_CONFIG[cityKey]);
    } else {
        res.status(404).json({ message: "Configura��o n�o encontrada para a cidade especificada." });
    }
};

const getCoelhoSavassiConfig = (req, res) => {
    const sentinels = coelhoSavassiConfig.coelhoSavassiSentinels;

    if (sentinels) {
        res.json({ sentinels: sentinels });
    } else {
        console.error("Falha ao carregar a configura��o Coelho Savassi.");
        res.status(500).json({ message: "Configura��o Coelho Savassi n�o encontrada ou indispon�vel." });
    }
};

export {
    getCityConfig,
    getCoelhoSavassiConfig
};