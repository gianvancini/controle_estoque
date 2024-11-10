import express from 'express';
import {
    postItemCompra, 
    deleteItemCompra, 
    getItensCompraByCompraId 
} from '../controllers/itemCompraController';

const router = express.Router();

router.post('/itens-compra', postItemCompra);
router.delete('/itens-compra/:id', deleteItemCompra);
router.get('/itens-compra/compra/:compraId', getItensCompraByCompraId);


export default router;