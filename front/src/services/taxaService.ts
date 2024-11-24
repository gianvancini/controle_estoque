import axios from './login/axiosConfig'

export interface Taxa {
    id?: number;
    vezes: String;
    percentual: String;
}

const url = "taxas";

export const fetchTaxas = async (): Promise<Taxa[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar taxas", error);
        throw error;
    }
};

export const editTaxa = async (id: number, formData: Taxa): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, formData);
    } catch (error) {
        console.error("Erro ao editar taxa", error);
        throw error;
    }
};

export const addTaxa = async (formData: Taxa): Promise<void> => {
    try {
        await axios.post(url, formData);
    } catch (error) {
        console.error("Erro ao adicionar taxa", error);
        throw error;
    }
};

export const deleteTaxa = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error("Erro ao excluir taxa", error);
        throw error;
    }
};