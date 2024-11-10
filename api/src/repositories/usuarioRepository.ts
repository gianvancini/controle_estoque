// src/services/authService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/usuario";

const secret = process.env.SECRET

export const authenticateUser = async (usuario: string, senha: string) => {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuarioEncontrado = await usuarioRepository.findOne({ where: { usuario } });

    if (!usuarioEncontrado) {
        throw new Error("Usuário não encontrado.");
    }

    const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

    if (!senhaCorreta) {
        throw new Error("Senha incorreta.");
    }

    const token = jwt.sign({ id: usuarioEncontrado.id }, secret, { expiresIn: '15m' });
    return { token, usuarioId: usuarioEncontrado.id };
};

export const createUser = async (usuario: string, senha: string, email: string) => {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    
    const usuarioExistente = await usuarioRepository.findOne({ where: { usuario } });
    if (usuarioExistente) {
        throw new Error("Usuário já existe.");
    }

    const novoUsuario = new Usuario();
    novoUsuario.usuario = usuario;
    novoUsuario.senha = await bcrypt.hash(senha, 10);
    novoUsuario.email = email;

    await usuarioRepository.save(novoUsuario);
    return "Usuário criado com sucesso!";
};