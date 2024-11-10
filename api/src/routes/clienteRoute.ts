import express from 'express';
import { getClientes, postCliente, getCliente, deleteCliente, updateCliente } from '../controllers/clienteController'

const router = express.Router()

router.get('/clientes', getClientes);
router.get('/clientes/:id', getCliente);
router.post('/clientes', postCliente);
router.delete('/clientes/:id', deleteCliente);
router.put('/clientes/:id', updateCliente);

export default router