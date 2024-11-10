import express from 'express';
import { getProdutos, postProduto, getProduto, deleteProduto, updateProduto } from '../controllers/produtoController'

const router = express.Router()

router.get('/produtos', getProdutos);
router.get('/produtos/:id', getProduto);
router.post('/produtos', postProduto);
router.delete('/produtos/:id', deleteProduto);
router.put('/produtos/:id', updateProduto);

export default router