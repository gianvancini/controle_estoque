import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Produto } from "../entity/produto";

export const getProdutos = async (req: Request, res: Response) => {
    try {
        const produtos: Produto[] = await AppDataSource.getRepository(Produto).find();
        res.status(200).json(produtos);
    } catch {
        res.status(500).send("Erro Interno.");
    }
};

export const getProduto = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const produto: Produto = await AppDataSource.getRepository(Produto).findOneBy({id: id});
        res.status(200).json(produto);
    } catch {
        res.status(500).send("Erro Interno.");
    }
};

export const postProduto = async (req: Request, res: Response) => {
    try {
        const produto: Produto[] = await AppDataSource.getRepository(Produto).create(req.body);
        const response: Produto[] = await AppDataSource.getRepository(Produto).save(produto);
        res.status(201).send(response);
    } catch {
        res.status(500).send("Erro Interno.");
    }
};

export const deleteProduto = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const result = await AppDataSource.getRepository(Produto).delete(id)        
        res.status(200).json(result);
    } catch {
        res.status(500).send("Erro Interno.");
    }
};

export const updateProduto = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const produto: Produto = await AppDataSource.getRepository(Produto).findOneBy({id: id});
        AppDataSource.getRepository(Produto).merge(produto, req.body);
        const result = await AppDataSource.getRepository(Produto).save(produto)
        res.status(200).send(result);
    } catch {
        res.status(500).send("Erro Interno.");
    }
};