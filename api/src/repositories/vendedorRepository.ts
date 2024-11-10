import { AppDataSource } from "../data-source";
import { Vendedor } from "../entity/vendedor";

export const vendedorRepository = AppDataSource.getRepository(Vendedor);

export const getAllVendedores = async (): Promise<Vendedor[]> => {
    return await vendedorRepository.find();
};

export const getVendedorById = async (id: number): Promise<Vendedor | null> => {
    return await vendedorRepository.findOneBy({ id });
};

export const createVendedor = async (vendedorData: Partial<Vendedor>): Promise<Vendedor> => {
    const vendedor = vendedorRepository.create(vendedorData);
    return await vendedorRepository.save(vendedor);
};

export const deleteVendedorById = async (id: number): Promise<boolean> => {
    const result = await vendedorRepository.delete(id);
    return result.affected !== 0;
};

export const updateVendedor = async (id: number, vendedorData: Partial<Vendedor>): Promise<Vendedor | null> => {
    const vendedor = await getVendedorById(id);
    if (!vendedor) return null;
    vendedorRepository.merge(vendedor, vendedorData);
    return await vendedorRepository.save(vendedor);
};