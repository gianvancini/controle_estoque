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
const url_itens = "itens-venda";

export const fetchVendas = async (): Promise<Venda[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar vendas", error);
        throw error;
    }
};

export const postVenda = async (venda): Promise<void> => {
    try {
        
        const nova_venda = {
            data_venda: venda.data_venda,
            cliente: venda.clienteSelecionado,
            vendedor: venda.vendedorSelecionado,
            total_venda: venda.total_venda,
            desconto: venda.desconto ? venda.desconto : 0
        }

        const vendaResponse = await axios.post(url, nova_venda);

        const vendaId = vendaResponse.data.id;

        const itensVenda = venda.itensVenda.map(item => ({
            ...item,
            venda: vendaId,
        }));

        console.log(itensVenda)

        await axios.post(url_itens, itensVenda);

    } catch (error) {
        console.error("Erro ao adicionar venda", error);
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

export default {
    fetchVendas,
    postVenda,
    deleteVenda,
};
