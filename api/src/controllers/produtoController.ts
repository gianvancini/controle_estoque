// src/controllers/produtoController.ts
import { Request, Response } from "express";
import * as produtoRepository from "../repositories/produtoRepository";

export const getProdutos = async (req: Request, res: Response) => {
    try {
        const produtos = await produtoRepository.getAllProdutos();
        res.status(200).json(produtos);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar os produtos.");
    }
};

export const getProduto = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const produto = await produtoRepository.getProdutoById(id);
        if (!produto) {
            return res.status(404).send("Produto não encontrado.");
        }
        res.status(200).json(produto);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar o produto.");
    }
};

export const postProduto = async (req: Request, res: Response) => {
    try {
        const produto = await produtoRepository.createProduto(req.body);
        res.status(201).json(produto);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar o produto.");
    }
};

export const deleteProduto = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const success = await produtoRepository.deleteProdutoById(id);
        if (!success) {
            return res.status(404).send("Produto não encontrado.");
        }
        res.status(200).json({ message: "Produto excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir o produto.");
    }
};

export const updateProduto = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const produto = await produtoRepository.updateProduto(id, req.body);
        if (!produto) {
            return res.status(404).send("Produto não encontrado.");
        }
        res.status(200).json(produto);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao atualizar o produto.");
    }
};