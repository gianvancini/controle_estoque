import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cliente } from "../entity/cliente";

// Listar todos os clientes
export const getClientes = async (req: Request, res: Response) => {
    try {
        const clientes: Cliente[] = await AppDataSource.getRepository(Cliente).find();
        res.status(200).json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar os clientes.");
    }
};

// Buscar cliente por ID
export const getCliente = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const cliente: Cliente | null = await AppDataSource.getRepository(Cliente).findOneBy({ id: id });
        
        if (!cliente) {
            return res.status(404).send("Cliente não encontrado.");
        }
        
        res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar o cliente.");
    }
};

// Criar um novo cliente
export const postCliente = async (req: Request, res: Response) => {
    try {
        const cliente: Cliente[] = AppDataSource.getRepository(Cliente).create(req.body);
        const response: Cliente[] = await AppDataSource.getRepository(Cliente).save(cliente);
        
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar o cliente.");
    }
};

// Excluir cliente por ID
export const deleteCliente = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const result = await AppDataSource.getRepository(Cliente).delete(id);
        
        if (result.affected === 0) {
            return res.status(404).send("Cliente não encontrado.");
        }
        
        res.status(200).json({ message: "Cliente excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir o cliente.");
    }
};

// Atualizar cliente por ID
export const updateCliente = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const cliente: Cliente | null = await AppDataSource.getRepository(Cliente).findOneBy({ id: id });
        
        if (!cliente) {
            return res.status(404).send("Cliente não encontrado.");
        }
        
        AppDataSource.getRepository(Cliente).merge(cliente, req.body);
        const result = await AppDataSource.getRepository(Cliente).save(cliente);
        
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao atualizar o cliente.");
    }
};