import axios from '@/services/login/axiosConfig'

export interface Compra {
    id?: number;
    data_compra: string;
    n_nota: string;
    total_compra: number;
    itensCompra?: ItensCompra[];
}

export interface ItensCompra {
    id?: number;
    compra: number;
    produto: string;
    cor: string;
    n_serie: string;
    quantidade: number;
    preco_custo: number;
}

const url = "compras";
const url_itens = "itens-compra/compra/";

export const fetchCompras = async (): Promise<Compra[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar compras", error);
        throw error;
    }
};

export const deleteCompra = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error("Erro ao excluir compra", error);
        throw error;
    }
};

export const fetchItensCompraByCompraId = async (compraId: number): Promise<ItemCompra[]> => {
    try {
        const response = await axios.get(`${url_itens}${compraId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar itens da compra", error);
        throw error;
    }
};
