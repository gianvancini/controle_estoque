import express from 'express';
import { getTaxas, postTaxa, getTaxa, deleteTaxa, updateTaxa } from '../controllers/taxaController';

const router = express.Router();

router.get('/taxas', getTaxas);
router.get('/taxas/:id', getTaxa);
router.post('/taxas', postTaxa);
router.put('/taxas/:id', updateTaxa);
router.delete('/taxas/:id', deleteTaxa);

export default router;
