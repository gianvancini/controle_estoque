import { Request, Response } from "express";
import * as taxaRepository from "../repositories/taxaRepository";

export const getTaxas = async (req: Request, res: Response) => {
    try {
        const taxas = await taxaRepository.getAllTaxas();
        res.status(200).json(taxas);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar as taxas.");
    }
};

export const getTaxa = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const taxa = await taxaRepository.getTaxaById(id);

        if (!taxa) {
            return res.status(404).send("Taxa não encontrada.");
        }

        res.status(200).json(taxa);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao buscar a taxa.");
    }
};

export const postTaxa = async (req: Request, res: Response) => {
    try {
        const taxaData = req.body;
        const newTaxa = await taxaRepository.createTaxa(taxaData);
        res.status(201).json(newTaxa);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao criar a taxa.");
    }
};

export const deleteTaxa = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const isDeleted = await taxaRepository.deleteTaxaById(id);

        if (!isDeleted) {
            return res.status(404).send("Taxa não encontrada.");
        }

        res.status(200).json({ message: "Taxa excluída com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao excluir a taxa.");
    }
};

export const updateTaxa = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const taxa = await taxaRepository.updateTaxa(id, req.body);
        if (!taxa) {
            return res.status(404).send("Taxa não encontrado.");
        }
        res.status(200).json(taxa);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro interno ao atualizar o taxa.");
    }
};