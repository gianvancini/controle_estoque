import express from 'express';
import { getVendas, postVenda, getVenda, deleteVenda } from '../controllers/vendaController';

const router = express.Router();

router.get('/vendas', getVendas);
router.get('/vendas/:id', getVenda);
router.post('/vendas', postVenda);
router.delete('/vendas/:id', deleteVenda);

export default router;
