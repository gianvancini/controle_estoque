import { MoreThan } from "typeorm";
import { AppDataSource } from "../data-source";
import { Estoque } from "../entities/estoque";

export const getEstoques = async (): Promise<Estoque[]> => {
    try {
        return await AppDataSource.getRepository(Estoque).find({
            relations: ["produto"],
            where: {
                quantidade_disponivel: MoreThan(0)
            }
        });
    } catch (error) {
        throw new Error("Erro ao buscar todos os estoques.");
    }
};

export const getEstoque = async (id: number): Promise<Estoque | null> => {
    try {
        const estoque = await AppDataSource.getRepository(Estoque).findOneBy({ id });
        if (!estoque) throw new Error("Estoque não encontrado.");
        return estoque;
    } catch (error) {
        throw new Error(error.message || "Erro ao buscar o estoque.");
    }
};

export const createEstoque = async (estoqueData: Partial<Estoque>): Promise<Estoque> => {
    try {
        const estoqueRepository = AppDataSource.getRepository(Estoque);
        const estoque = estoqueRepository.create(estoqueData);
        return await estoqueRepository.save(estoque);
    } catch (error) {
        throw new Error("Erro ao criar o estoque.");
    }
};

export const updateEstoque = async (id: number, estoqueData: Partial<Estoque>): Promise<Estoque> => {
    try {
        const estoqueRepository = AppDataSource.getRepository(Estoque);
        const estoque = await estoqueRepository.findOneBy({ id });
        if (!estoque) throw new Error("Estoque não encontrado.");

        estoqueRepository.merge(estoque, estoqueData);
        return await estoqueRepository.save(estoque);
    } catch (error) {
        throw new Error(error.message || "Erro ao atualizar o estoque.");
    }
};

export const deleteEstoque = async (id: number): Promise<boolean> => {
    try {
        const estoqueRepository = AppDataSource.getRepository(Estoque);
        const estoque = await estoqueRepository.findOneBy({ id });
        if (!estoque) throw new Error("Estoque não encontrado.");

        const result = await estoqueRepository.delete(id);
        return result.affected !== 0;
    } catch (error) {
        throw new Error(error.message || "Erro ao excluir o estoque.");
    }
};