import axios from '../login/axiosConfig'

export interface Produto {
    id?: number;
    nome: String;
    marca: String;
    modelo: String;
    cor: String;
    capacidade: String;
    observacoes?: String;
    preco_venda: number;
}

const url = "produtos";

export const fetchProdutos = async (): Promise<Produto[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar produtos", error);
        throw error;
    }
};

export const editProduto = async (id: number, formData: Produto): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, formData);
    } catch (error) {
        console.error("Erro ao editar produto", error);
        throw error;
    }
};

export const addProduto = async (formData: Produto): Promise<void> => {
    try {
        await axios.post(url, formData);
    } catch (error) {
        console.error("Erro ao adicionar produto", error);
        throw error;
    }
};

export const deleteProduto = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error("Erro ao excluir produto", error);
        throw error;
    }
};