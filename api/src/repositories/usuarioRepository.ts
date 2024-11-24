import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/usuario";

const secret = process.env.SECRET;

export const usuarioRepository = AppDataSource.getRepository(Usuario);

export const authenticateUser = async (usuario: string, senha: string): Promise<{ token: string; usuarioId: number ; usuarioTipo: string}> => {
    const usuarioEncontrado = await usuarioRepository.findOne({ where: { usuario } });

    if (!usuarioEncontrado || !(await bcrypt.compare(senha, usuarioEncontrado.senha))) {
        throw new Error("Usuário ou senha incorretos.");
    }

    const token = jwt.sign({ id: usuarioEncontrado.id, usuarioTipo: usuarioEncontrado.tipo}, secret, { expiresIn: '60m' });
    return { token, usuarioId: usuarioEncontrado.id, usuarioTipo: usuarioEncontrado.tipo };
};

export const createUsuario = async (usuarioData: Partial<Usuario>): Promise<string> => {
    const { usuario, senha, email, tipo } = usuarioData;

    const usuarioExistente = await usuarioRepository.findOne({ where: { usuario } });
    if (usuarioExistente) {
        throw new Error("Usuário já existe.");
    }

    const novoUsuario = usuarioRepository.create({
        usuario,
        senha: await bcrypt.hash(senha, 10),
        email,
        tipo,
    });

    await usuarioRepository.save(novoUsuario);
    return "Usuário criado com sucesso!";
};

export const getAllUsuarios = async (): Promise<Usuario[]> => {
    return await usuarioRepository.find();
};

export const getUsuarioById = async (id: number): Promise<Usuario | null> => {
    return await usuarioRepository.findOneBy({ id });
};

export const deleteUsuarioById = async (id: number): Promise<boolean> => {
    const result = await usuarioRepository.delete(id);
    return result.affected !== 0;
};

export const updateUsuario = async (id: number, usuarioData: Partial<Usuario>): Promise<Usuario | null> => {
    const usuario = await getUsuarioById(id);
    if (!usuario) return null;

    const { senha, ...otherData } = usuarioData;
    usuarioRepository.merge(usuario, otherData);

    if (senha) {
        usuario.senha = await bcrypt.hash(senha, 10);
    }

    return await usuarioRepository.save(usuario);
};
