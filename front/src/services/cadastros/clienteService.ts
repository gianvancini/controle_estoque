import axios from '../login/axiosConfig'

export interface Cliente {
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereco?: string;
    numero?: number;
    cep?: number;
    cidade?: string;
    uf?: string;
    data_nascimento?: Date;
}

const url = "clientes";

export const fetchClientes = async (): Promise<Cliente[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar clientes", error);
        throw error;
    }
};

export const editCliente = async (id: number, formData: Cliente): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, formData);
    } catch (error) {
        console.error("Erro ao editar cliente", error);
        throw error;
    }
};

export const addCliente = async (formData: Cliente): Promise<void> => {
    try {
        await axios.post(url, formData);
    } catch (error) {
        console.error("Erro ao adicionar cliente", error);
        throw error;
    }
};

export const deleteCliente = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error("Erro ao excluir cliente", error);
        throw error;
    }
};