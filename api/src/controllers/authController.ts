// src/controllers/authController.ts
import { Request, Response } from "express";
import * as authService from "../repositories/usuarioRepository";

export const login = async (req: Request, res: Response) => {
    try {
        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            return res.status(400).send("Usuário e senha são obrigatórios.");
        }

        const { token, usuarioId } = await authService.authenticateUser(usuario, senha);

        res.json({ token, usuarioId });
    } catch (error) {
        console.error(error.message);
        if (error.message === "Usuário não encontrado." || error.message === "Senha incorreta.") {
            res.status(401).send(error.message);
        } else {
            res.status(500).send("Erro interno ao processar o login.");
        }
    }
};

export const criarUsuario = async (req: Request, res: Response) => {
    try {
        const { usuario, senha, email } = req.body;

        if (!usuario || !senha || !email) {
            return res.status(400).send("Usuário, senha e email são obrigatórios.");
        }

        const message = await authService.createUser(usuario, senha, email);
        res.status(201).send(message);
    } catch (error) {
        console.error(error.message);
        if (error.message === "Usuário já existe.") {
            res.status(400).send(error.message);
        } else {
            res.status(500).send("Erro ao criar usuário.");
        }
    }
};