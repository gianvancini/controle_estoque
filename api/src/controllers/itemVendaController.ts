import { Request, Response } from "express";
import * as itensVendaService from "../repositories/itensVendaRepository";

export const getItensVendaByVendaId = async (req: Request, res: Response) => {
    try {
        const vendaId = +req.params.vendaId;

        const itensVendas = await itensVendaService.getItensVendaByVendaId(vendaId);

        if (itensVendas.length === 0) {
            return res.status(404).send("Nenhum item de venda encontrado para esta venda.");
        }

        const response = itensVendas.map(item => ({
            id: item.id,
            produto: item.estoque.produto,
            estoque: item.estoque,
            quantidade: item.quantidade,
            preco_venda: item.preco_venda
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar os itens de venda pela ID da venda.");
    }
};

export const postItemVenda = async (req: Request, res: Response) => {
    try {
        const newItensVenda = await itensVendaService.createItensVenda(req.body);
        res.status(201).json(newItensVenda);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar o item de venda.");
    }
};

export const deleteItemVenda = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const isDeleted = await itensVendaService.deleteItensVendaById(id);

        if (!isDeleted) {
            return res.status(404).send("Item de venda não encontrado.");
        }

        res.status(200).json({ message: "Item de venda excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir o item de venda.");
    }
};