import { Request, Response } from "express";
import * as compraService from "../repositories/compraRepository";

export const getCompras = async (req: Request, res: Response) => {
    try {
        const compras = await compraService.getAllCompras();
        res.status(200).json(compras);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar as compras.");
    }
};

export const getCompra = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const compra = await compraService.getCompraById(id);

        if (!compra) {
            return res.status(404).send("Compra não encontrada.");
        }

        res.status(200).json(compra);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar a compra.");
    }
};

export const postCompra = async (req: Request, res: Response) => {
    try {
        const { data_compra, n_nota, fornecedor, total_compra } = req.body;
        
        const compraData = {
            data_compra,
            n_nota,
            fornecedor,
            total_compra,
        };

        const newCompra = await compraService.createCompra(compraData);
        res.status(201).json(newCompra);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar a compra.");
    }
};

export const deleteCompra = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const isDeleted = await compraService.deleteCompraById(id);

        if (!isDeleted) {
            return res.status(404).send("Compra não encontrada.");
        }

        res.status(200).json({ message: "Compra excluída com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir a compra.");
    }
};