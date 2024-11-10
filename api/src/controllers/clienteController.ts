import { Request, Response } from "express";
import * as clienteRepository from "../repositories/clienteRepository";

export const getClientes = async (req: Request, res: Response) => {
    try {
        const clientes = await clienteRepository.getAllClientes();
        res.status(200).json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar os clientes.");
    }
};

export const getCliente = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const cliente = await clienteRepository.getClienteById(id);
        if (!cliente) {
            return res.status(404).send("Cliente não encontrado.");
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar o cliente.");
    }
};

export const postCliente = async (req: Request, res: Response) => {
    try {
        const cliente = await clienteRepository.createCliente(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar o cliente.");
    }
};

export const deleteCliente = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const success = await clienteRepository.deleteClienteById(id);
        if (!success) {
            return res.status(404).send("Cliente não encontrado.");
        }
        res.status(200).json({ message: "Cliente excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir o cliente.");
    }
};

export const updateCliente = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const cliente = await clienteRepository.updateCliente(id, req.body);
        if (!cliente) {
            return res.status(404).send("Cliente não encontrado.");
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao atualizar o cliente.");
    }
};