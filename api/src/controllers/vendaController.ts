import { Request, Response } from "express";
import * as vendaService from "../repositories/vendaRepository";

export const getVendas = async (req: Request, res: Response) => {
    try {
        const vendas = await vendaService.getAllVendas();
        res.status(200).json(vendas);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar as vendas.");
    }
};

export const getVenda = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const venda = await vendaService.getVendaById(id);

        if (!venda) {
            return res.status(404).send("Venda não encontrada.");
        }

        res.status(200).json(venda);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar a venda.");
    }
};

export const postVenda = async (req: Request, res: Response) => {
    try {
        const vendaData = req.body;
        const newVenda = await vendaService.createVenda(vendaData);
        res.status(201).json(newVenda);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar a venda.");
    }
};

export const deleteVenda = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const isDeleted = await vendaService.deleteVendaById(id);

        if (!isDeleted) {
            return res.status(404).send("Venda não encontrada.");
        }

        res.status(200).json({ message: "Venda excluída com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir a venda.");
    }
};