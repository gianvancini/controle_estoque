// src/controllers/vendedorController.ts
import { Request, Response } from "express";
import * as vendedorRepository from "../repositories/vendedorRepository";

export const getVendedores = async (req: Request, res: Response) => {
    try {
        const vendedores = await vendedorRepository.getAllVendedores();
        res.status(200).json(vendedores);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar os vendedores.");
    }
};

export const getVendedor = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const vendedor = await vendedorRepository.getVendedorById(id);
        if (!vendedor) {
            return res.status(404).send("Vendedor não encontrado.");
        }
        res.status(200).json(vendedor);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar o vendedor.");
    }
};

export const postVendedor = async (req: Request, res: Response) => {
    try {
        const vendedor = await vendedorRepository.createVendedor(req.body);
        res.status(201).json(vendedor);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar o vendedor.");
    }
};

export const deleteVendedor = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const success = await vendedorRepository.deleteVendedorById(id);
        if (!success) {
            return res.status(404).send("Vendedor não encontrado.");
        }
        res.status(200).json({ message: "Vendedor excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir o vendedor.");
    }
};

export const updateVendedor = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const vendedor = await vendedorRepository.updateVendedor(id, req.body);
        if (!vendedor) {
            return res.status(404).send("Vendedor não encontrado.");
        }
        res.status(200).json(vendedor);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao atualizar o vendedor.");
    }
};