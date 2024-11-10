import express from 'express';
import { postItemVenda, deleteItemVenda, getItensVendaByVendaId } from '../controllers/itemVendaController';

const router = express.Router();

router.post('/itens-venda', postItemVenda);
router.delete('/itens-venda/:id', deleteItemVenda);
router.get('/itens-venda/venda/:vendaId', getItensVendaByVendaId);

export default router;
