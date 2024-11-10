import express from 'express';
import { getCompras, postCompra, getCompra, deleteCompra } from '../controllers/compraController';

const router = express.Router();

router.get('/compras', getCompras);
router.get('/compras/:id', getCompra);
router.post('/compras', postCompra);
router.delete('/compras/:id', deleteCompra);

export default router;