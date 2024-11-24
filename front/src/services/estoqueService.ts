import axios from './login/axiosConfig';

export interface Estoque {
    id?: number;
    produto: number;
    n_serie: string;
    quantidade_disponivel: number;
    preco_custo: number;
}

const url = "estoque"; 

export const fetchEstoque = async (): Promise<Estoque[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar estoque", error);
        throw error;
    }
};

export const editEstoque = async (id: number, formData: Estoque): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, formData);
    } catch (error) {
        console.error("Erro ao editar estoque", error);
        throw error;
    }
};

export const updateEstoqueQuantity = async (id: number, quantidade: number): Promise<void> => {
    try {
        const estoqueAtualizado = await axios.patch(`${url}/${id}`, { quantidade_disponivel: quantidade });
        console.log("Estoque atualizado", estoqueAtualizado);
    } catch (error) {
        console.error("Erro ao atualizar estoque", error);
        throw error;
    }
};
