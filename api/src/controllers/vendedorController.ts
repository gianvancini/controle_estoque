import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Vendedor } from "../entity/vendedor";

// Listar todos os vendedores
export const getVendedores = async (req: Request, res: Response) => {
    try {
        const vendedores: Vendedor[] = await AppDataSource.getRepository(Vendedor).find();
        res.status(200).json(vendedores);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar os vendedores.");
    }
};

// Buscar vendedor por ID
export const getVendedor = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const vendedor: Vendedor | null = await AppDataSource.getRepository(Vendedor).findOneBy({ id: id });
        
        if (!vendedor) {
            return res.status(404).send("Vendedor não encontrado.");
        }
        
        res.status(200).json(vendedor);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar o vendedor.");
    }
};

// Criar um novo vendedor
export const postVendedor = async (req: Request, res: Response) => {
    try {
        const vendedor: Vendedor[] = AppDataSource.getRepository(Vendedor).create(req.body);
        const response: Vendedor[] = await AppDataSource.getRepository(Vendedor).save(vendedor);
        
        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar o vendedor.");
    }
};

// Excluir vendedor por ID
export const deleteVendedor = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const result = await AppDataSource.getRepository(Vendedor).delete(id);
        
        if (result.affected === 0) {
            return res.status(404).send("Vendedor não encontrado.");
        }
        
        res.status(200).json({ message: "Vendedor excluído com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir o vendedor.");
    }
};

// Atualizar vendedor por ID
export const updateVendedor = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const vendedor: Vendedor | null = await AppDataSource.getRepository(Vendedor).findOneBy({ id: id });
        
        if (!vendedor) {
            return res.status(404).send("Vendedor não encontrado.");
        }
        
        AppDataSource.getRepository(Vendedor).merge(vendedor, req.body);
        const result = await AppDataSource.getRepository(Vendedor).save(vendedor);
        
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao atualizar o vendedor.");
    }
};
