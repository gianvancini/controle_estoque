import axios from '@/services/login/axiosConfig'

export interface Venda {
    id?: number;
    data_venda: Date;
    cliente: string;
    vendedor: string;
    total_venda: number;
    desconto?: number;
    itensVenda: ItemVenda[];
}

export interface ItemVenda {
    id?: number;
    venda: number;
    estoque: number;
    quantidade: number;
    preco_venda: number;
}

const url = "vendas";
const url_itens = "itens-venda/venda/";

export const fetchVendas = async (): Promise<Venda[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar vendas", error);
        throw error;
    }
};

export const deleteVenda = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error("Erro ao excluir venda", error);
        throw error;
    }
};

export const fetchItensVendaByVendaId = async (vendaId: number): Promise<ItemVenda[]> => {
    try {
        const response = await axios.get(`${url_itens}${vendaId}`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar itens da venda", error);
        throw error;
    }
};
