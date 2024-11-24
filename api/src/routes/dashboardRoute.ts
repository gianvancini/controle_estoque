import express from 'express';
import { getVendas, getVendasVendedor } from '../controllers/dashboardController';

const router = express.Router();

router.get('/vendasMes', getVendas);
router.get('/vendasVendedor', getVendasVendedor);

export default router;
