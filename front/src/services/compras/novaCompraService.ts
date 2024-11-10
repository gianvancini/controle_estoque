import axios from '@/services/login/axiosConfig'

export interface Compra {
    id?: number;
    data_compra: Date;
    fornecedor: string;
    n_nota: string;
    total_compra: number;
    itensCompra: ItemCompra[];
}

export interface ItemCompra {
    id?: number;
    compra: number;
    produto: number;
    n_serie: string;
    quantidade: number;
    preco_custo: number;
}

const url = "compras";
const url_itens = "itens-compra";

export const fetchCompras = async (): Promise<Compra[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar compras", error);
        throw error;
    }
};

export const postCompra = async (formData: Compra): Promise<void> => {
    try {
        const nova_compra = {
            data_compra: formData.data_compra,
            fornecedor: formData.fornecedor,
            n_nota: formData.n_nota,
            total_compra: formData.total_compra,
        }
        
        const compraResponse = await axios.post(url, nova_compra);

        const compraId = compraResponse.data.id;        

        const itensCompra = formData.itensCompra.map(item => ({
            ...item,
            compra: compraId,
        }));

        await axios.post(url_itens, itensCompra);

    } catch (error) {
        console.error("Erro ao adicionar compra", error);
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

export default {
    fetchCompras,
    postCompra,
    deleteCompra,
};
