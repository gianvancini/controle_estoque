import express from 'express';
import { criarUsuario, login } from "../controllers/authController";

const router = express.Router()

router.post("/login", login);
router.post("/criar-usuario", criarUsuario); 

export default router;
