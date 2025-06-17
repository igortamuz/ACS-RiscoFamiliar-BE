import express from 'express';
import configController from '../controllers/configController.js'; 

const router = express.Router();

router.get('/cities', configController.getCityConfig);
router.get('/sentinels', configController.getCoelhoSavassiConfig);

export default router;