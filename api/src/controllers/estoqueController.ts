import { Request, Response } from "express";
import * as estoqueService from "../repositories/estoqueRepository";

export const getEstoques = async (req: Request, res: Response) => {
    try {
        const estoques = await estoqueService.getEstoques();
        res.status(200).json(estoques);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar os estoques.");
    }
};

export const getEstoque = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const estoque = await estoqueService.getEstoque(id);

        if (!estoque) {
            return res.status(404).send("Estoque não encontrado.");
        }

        res.status(200).json(estoque);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar o estoque.");
    }
};

export const postEstoque = async (req: Request, res: Response) => {
    try {
        const estoqueData = req.body;
        const estoque = await estoqueService.createEstoque(estoqueData);
        res.status(201).json(estoque);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar o estoque.");
    }
};

export const deleteEstoque = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const isDeleted = await estoqueService.deleteEstoque(id);

        if (!isDeleted) {
            return res.status(404).send("Estoque não encontrada.");
        }

        res.status(200).json({ message: "Estoque excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir o estoque.");
    }
};

export const updateEstoque = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const estoqueData = req.body;
        const updatedEstoque = await estoqueService.updateEstoque(id, estoqueData);

        res.status(200).json(updatedEstoque);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message || "Erro interno ao atualizar o estoque.");
    }
};