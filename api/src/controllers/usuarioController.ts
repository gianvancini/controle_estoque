import { Request, Response } from "express";
import * as usuarioRepository from "../repositories/usuarioRepository";

export const login = async (req: Request, res: Response) => {
    try {
        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            return res.status(400).send("Usuário e senha são obrigatórios.");
        }

        const { token, usuarioId, usuarioTipo } = await usuarioRepository.authenticateUser(usuario, senha);
        res.status(200).json({ token, usuarioId, usuarioTipo });
    } catch (error) {
        console.error(error);
        const message =
            error.message === "Usuário não encontrado." || error.message === "Senha incorreta."
                ? error.message
                : "Erro interno ao processar o login.";
        const status = error.message === "Usuário não encontrado." || error.message === "Senha incorreta."
            ? 401
            : 500;
        res.status(status).send(message);
    }
};

export const postUsuario = async (req: Request, res: Response) => {
    try {
        const { usuario, senha, email, tipo } = req.body;

        if (!usuario || !senha || !email || !tipo) {
            return res.status(400).send("Usuário, senha, email e tipo são obrigatórios.");
        }

        const message = await usuarioRepository.createUsuario({usuario, senha, email, tipo});
        res.status(201).json({ message });
    } catch (error) {
        console.error(error);
        const message = error.message === "Usuário já existe."
            ? error.message
            : "Erro ao criar usuário.";
        const status = error.message === "Usuário já existe." ? 400 : 500;
        res.status(status).send(message);
    }
};

export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await usuarioRepository.getAllUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar os usuários.");
    }
};

export const getUsuario = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const usuario = await usuarioRepository.getUsuarioById(id);
        if (!usuario) {
            return res.status(404).send("Usuário não encontrado.");
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar o usuário.");
    }
};

export const deleteUsuario = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const success = await usuarioRepository.deleteUsuarioById(id);
        if (!success) {
            return res.status(404).send("Usuário não encontrado.");
        }
        res.status(200).json({ message: "Usuário excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir o usuário.");
    }
};

export const updateUsuario = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const usuario = await usuarioRepository.updateUsuario(id, req.body);
        if (!usuario) {
            return res.status(404).send("Usuário não encontrado.");
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao atualizar o usuário.");
    }
};