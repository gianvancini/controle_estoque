import express from 'express';
import { login } from "../controllers/usuarioController";

const router = express.Router()

router.post("/login", login);

export default router;
