import { AppDataSource } from "../data-source";
import { Compra } from "../entities/compra";

export const getAllCompras = async (): Promise<Compra[]> => {
    return await AppDataSource.getRepository(Compra).find();
};

export const getCompraById = async (id: number): Promise<Compra | null> => {
    return await AppDataSource.getRepository(Compra).findOneBy({ id });
};

export const createCompra = async (data: Partial<Compra>): Promise<Compra> => {
    const compra = AppDataSource.getRepository(Compra).create(data);
    return await AppDataSource.getRepository(Compra).save(compra);
};

export const deleteCompraById = async (id: number): Promise<boolean> => {
    const result = await AppDataSource.getRepository(Compra).delete(id);
    return result.affected !== 0;
};