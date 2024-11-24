import { AppDataSource } from "../data-source";
import { Cliente } from "../entities/cliente";

export const clienteRepository = AppDataSource.getRepository(Cliente);

export const getAllClientes = async (): Promise<Cliente[]> => {
    return await clienteRepository.find();
};

export const getClienteById = async (id: number): Promise<Cliente | null> => {
    return await clienteRepository.findOneBy({ id });
};

export const createCliente = async (clienteData: Partial<Cliente>): Promise<Cliente> => {
    const cliente = clienteRepository.create(clienteData);
    return await clienteRepository.save(cliente);
};

export const deleteClienteById = async (id: number): Promise<boolean> => {
    const result = await clienteRepository.delete(id);
    return result.affected !== 0;
};

export const updateCliente = async (id: number, clienteData: Partial<Cliente>): Promise<Cliente | null> => {
    const cliente = await getClienteById(id);
    if (!cliente) return null;
    clienteRepository.merge(cliente, clienteData);
    return await clienteRepository.save(cliente);
};