import express from 'express';
import { getEstoques, postEstoque, getEstoque, deleteEstoque, updateEstoque } from '../controllers/estoqueController';

const router = express.Router();

router.get('/estoque', getEstoques);
router.get('/estoque/:id', getEstoque);
router.post('/estoque', postEstoque);
router.delete('/estoque/:id', deleteEstoque);
router.put('/estoque/:id', updateEstoque);

export default router;
