import { AppDataSource } from "../data-source";
import { ItensCompra } from "../entities/itensCompra";
import { Produto } from "../entities/produto";
import { createEstoque } from "./estoqueRepository"; 

export const getItensCompraByCompraId = async (compraId: number): Promise<ItensCompra[]> => {
    try {
        return await AppDataSource.getRepository(ItensCompra).find({
            where: { compra: { id: compraId } },
            relations: ['produto', 'compra'],
        });
    } catch (error) {
        throw new Error("Erro ao buscar itens dessa compra.");
    }
};

export const createItensCompra = async (itensCompraData: Partial<ItensCompra>[]): Promise<ItensCompra[]> => {
    try {
        const itensCompraRepository = AppDataSource.getRepository(ItensCompra);

        const itensCompra = await itensCompraRepository.save(itensCompraData);

        for (const item of itensCompra) {
            const estoqueData = {
                produto: item.produto as Produto,
                cor: item.cor,
                n_serie: item.n_serie,
                quantidade_disponivel: item.quantidade,
                preco_custo: item.preco_custo,
            };

            await createEstoque(estoqueData);
        }

        return itensCompra;
    } catch (error) {
        throw new Error("Erro ao criar itens de compra e atualizar o estoque.");
    }
};

export const deleteItensCompraById = async (id: number): Promise<boolean> => {
    const result = await AppDataSource.getRepository(ItensCompra).delete(id);
    return result.affected !== 0;
};