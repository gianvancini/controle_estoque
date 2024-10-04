import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Produto } from "../entity/produto";

// Listar todos os produtos
export const getProdutos = async (req: Request, res: Response) => {
    try {
        const produtos: Produto[] = await AppDataSource.getRepository(Produto).find();
        res.status(200).json(produtos);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar os produtos.");
    }
};

// Buscar produto por ID
export const getProduto = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const produto: Produto | null = await AppDataSource.getRepository(Produto).findOneBy({ id: id });
        
        if (!produto) {
            return res.status(404).send("Produto não encontrado.");
        }
        
        res.status(200).json(produto);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar o produto.");
    }
};

// Criar um novo produto
export const postProduto = async (req: Request, res: Response) => {
    try {
        const produto: Produto[] = AppDataSource.getRepository(Produto).create(req.body);
        const response: Produto[] = await AppDataSource.getRepository(Produto).save(produto);
        
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar o produto.");
    }
};

// Excluir produto por ID
export const deleteProduto = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const result = await AppDataSource.getRepository(Produto).delete(id);
        
        if (result.affected === 0) {
            return res.status(404).send("Produto não encontrado.");
        }
        
        res.status(200).json({ message: "Produto excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir o produto.");
    }
};

// Atualizar produto por ID
export const updateProduto = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const produto: Produto | null = await AppDataSource.getRepository(Produto).findOneBy({ id: id });
        
        if (!produto) {
            return res.status(404).send("Produto não encontrado.");
        }
        
        AppDataSource.getRepository(Produto).merge(produto, req.body);
        const result = await AppDataSource.getRepository(Produto).save(produto);
        
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao atualizar o produto.");
    }
};
