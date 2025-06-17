import express from 'express';
import { getCityConfig, getCoelhoSavassiConfig } from '../controllers/configController.js';

const router = express.Router();

router.get('/cities', getCityConfig);
router.get('/sentinels', getCoelhoSavassiConfig);

export default router;