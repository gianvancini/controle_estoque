import { Request, Response } from "express";
import * as dashboardRepository from "../repositories/dashboardRepository";

export const getVendas = async (req: Request, res: Response) => {
    try {
        const vendas = await dashboardRepository.getVendasPorMes();
        res.status(200).json(vendas);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar as vendas.");
    }
};

export const getVendasVendedor = async (req: Request, res: Response) => {
    try {
        const vendasVendedor = await dashboardRepository.getVendasPorVendedor();
        res.status(200).json(vendasVendedor);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar as vendas.");
    }
};