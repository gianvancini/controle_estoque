import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Vendedor } from "../entity/vendedor";

export const getVendedores = async (req: Request, res: Response) => {
    try {
        const vendedores: Vendedor[] = await AppDataSource.getRepository(Vendedor).find();
        res.status(200).json(vendedores);
    } catch {
        res.status(500).send("Erro Interno.");
    }
};

export const getVendedor = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const vendedor: Vendedor = await AppDataSource.getRepository(Vendedor).findOneBy({id: id});
        res.status(200).json(vendedor);
    } catch {
        res.status(500).send("Erro Interno.");
    }
};

export const postVendedor = async (req: Request, res: Response) => {
    try {
        const vendedor: Vendedor[] = await AppDataSource.getRepository(Vendedor).create(req.body);
        const response: Vendedor[] = await AppDataSource.getRepository(Vendedor).save(vendedor);
        res.status(201).send(response);
    } catch {
        res.status(500).send("Erro Interno.");
    }
};

export const deleteVendedor = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const result = await AppDataSource.getRepository(Vendedor).delete(id)        
        res.status(200).json(result);
    } catch {
        res.status(500).send("Erro Interno.");
    }
};

export const updateVendedor = async (req: Request, res: Response) => {
    try {
        const id: number = +req.params.id;
        const vendedor: Vendedor = await AppDataSource.getRepository(Vendedor).findOneBy({id: id});
        AppDataSource.getRepository(Vendedor).merge(vendedor, req.body);
        const result = await AppDataSource.getRepository(Vendedor).save(vendedor)
        res.status(200).send(result);
    } catch {
        res.status(500).send("Erro Interno.");
    }
};