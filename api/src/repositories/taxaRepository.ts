import { AppDataSource } from "../data-source";
import { Taxa } from "../entities/taxa";

export const taxaRepository = AppDataSource.getRepository(Taxa);

export const getAllTaxas = async (): Promise<Taxa[]> => {
    return await taxaRepository.find({
    });
};

export const getTaxaById = async (id: number): Promise<Taxa | null> => {
    return await taxaRepository.findOneBy({ id });
};

export const createTaxa = async (data: Partial<Taxa>): Promise<Taxa> => {
    const taxa = taxaRepository.create(data);
    return await taxaRepository.save(taxa);
};

export const deleteTaxaById = async (id: number): Promise<boolean> => {
    const result = await taxaRepository.delete(id);
    return result.affected !== 0;
};

export const updateTaxa = async (id: number, taxaData: Partial<Taxa>): Promise<Taxa | null> => {
    const taxa = await getTaxaById(id);
    if (!taxa) return null;
    taxaRepository.merge(taxa, taxaData);
    return await taxaRepository.save(taxa);
};