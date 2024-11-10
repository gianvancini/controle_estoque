import { Request, Response } from "express";
import * as itensCompraService from "../repositories/itensCompraRepository";

export const getItensCompraByCompraId = async (req: Request, res: Response) => {
    try {
        const compraId = +req.params.compraId;
        const itensCompras = await itensCompraService.getItensCompraByCompraId(compraId);

        if (itensCompras.length === 0) {
            return res.status(404).send("Nenhum item de compra encontrado para esta compra.");
        }

        const response = itensCompras.map(item => ({
            id: item.id,
            cor: item.cor,
            n_serie: item.n_serie,
            quantidade: item.quantidade,
            preco_custo: item.preco_custo,
            produto: item.produto,
            compraId: item.compra?.id,
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar os itens de compra pela ID da compra.");
    }
};

export const postItemCompra = async (req: Request, res: Response) => {
    try {
        const itensCompra = req.body;

        if (!Array.isArray(itensCompra)) {
            return res.status(400).send("Dados dos itens de compra inválidos.");
        }

        const savedItens = await itensCompraService.createItensCompra(itensCompra);
        res.status(201).json(savedItens);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar os itens de compra.");
    }
};

export const deleteItemCompra = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const isDeleted = await itensCompraService.deleteItensCompraById(id);

        if (!isDeleted) {
            return res.status(404).send("Item de compra não encontrado.");
        }

        res.status(200).json({ message: "Item de compra excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir o item de compra.");
    }
};