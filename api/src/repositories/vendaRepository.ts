import { AppDataSource } from "../data-source";
import { Venda } from "../entity/venda";

export const getAllVendas = async (): Promise<Venda[]> => {
    return await AppDataSource.getRepository(Venda).find({
        relations: ["cliente", "vendedor"]
    });
};

export const getVendaById = async (id: number): Promise<Venda | null> => {
    return await AppDataSource.getRepository(Venda).findOneBy({ id });
};

export const createVenda = async (data: Partial<Venda>): Promise<Venda> => {
    const venda = AppDataSource.getRepository(Venda).create(data);
    return await AppDataSource.getRepository(Venda).save(venda);
};

export const deleteVendaById = async (id: number): Promise<boolean> => {
    const result = await AppDataSource.getRepository(Venda).delete(id);
    return result.affected !== 0;
};