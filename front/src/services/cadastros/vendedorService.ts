import axios from '../login/axiosConfig'

export interface Vendedor {
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    comissao: string;
    data_adm?: Date;
}

const url = "vendedores";

export const fetchVendedores = async (): Promise<Vendedor[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar vendedores", error);
        throw error;
    }
};

export const editVendedor = async (id: number, formData: Vendedor): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, formData);
    } catch (error) {
        console.error("Erro ao editar vendedor", error);
        throw error;
    }
};

export const addVendedor = async (formData: Vendedor): Promise<void> => {
    try {
        await axios.post(url, formData);
    } catch (error) {
        console.error("Erro ao adicionar vendedor", error);
        throw error;
    }
};

export const deleteVendedor = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error("Erro ao excluir vendedor", error);
        throw error;
    }
};