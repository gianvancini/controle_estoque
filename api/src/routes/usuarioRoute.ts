import express from 'express';
import { postUsuario, getUsuarios, getUsuario, deleteUsuario, updateUsuario, login } from "../controllers/usuarioController";

const router = express.Router()

router.post("/login", login);
router.post("/usuarios", postUsuario); 
router.get('/usuarios', getUsuarios);
router.get('/usuarios/:id', getUsuario);
router.delete('/usuarios/:id', deleteUsuario);
router.put('/usuarios/:id', updateUsuario);

export default router;
