import express from 'express';
import { getVendedores, postVendedor, getVendedor, deleteVendedor, updateVendedor } from '../controllers/vendedorController'

const router = express.Router()

router.get('/vendedores', getVendedores);
router.get('/vendedores/:id', getVendedor);
router.post('/vendedores', postVendedor);
router.delete('/vendedores/:id', deleteVendedor);
router.put('/vendedores/:id', updateVendedor);

export default router