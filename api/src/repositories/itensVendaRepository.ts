import { AppDataSource } from "../data-source";
import { Estoque } from "../entity/estoque";
import { ItensVenda } from "../entity/itensVenda";
import { updateEstoque } from "./estoqueRepository"; 

export const getItensVendaByVendaId = async (vendaId: number): Promise<ItensVenda[]> => {
    try {
        return await AppDataSource.getRepository(ItensVenda).find({
            where: { venda: { id: vendaId } },
            relations: ['estoque', 'estoque.produto'],
        });
    } catch (error) {
        throw new Error("Erro ao buscar itens dessa venda.");
    }
};

export const createItensVenda = async (itensVendaData: Partial<ItensVenda>[]): Promise<ItensVenda[]> => {
    try {
        const itensVendaRepository = AppDataSource.getRepository(ItensVenda);

        const itensVenda = await itensVendaRepository.save(itensVendaData);

        for (const item of itensVenda) {
            const estoque = await AppDataSource.getRepository(Estoque).findOne({
                where: { id: item.estoque.id },
            });

            if (!estoque) {
                throw new Error(`Estoque não encontrado para o produto selecionado.`);
            }

            const quantidadeDisponivel = estoque.quantidade_disponivel - item.quantidade;

            if (quantidadeDisponivel < 0) {
                throw new Error(`Quantidade insuficiente no estoque para o produto selecionado.`);
            }

            const estoqueData = {
                quantidade_disponivel: quantidadeDisponivel,
            };

            await updateEstoque(estoque.id, estoqueData);
        }

        return itensVenda;
    } catch (error) {
        throw new Error("Erro ao criar itens de venda e atualizar o estoque: " + error.message);
    }
};

export const deleteItensVendaById = async (id: number): Promise<boolean> => {
    const result = await AppDataSource.getRepository(ItensVenda).delete(id);
    return result.affected !== 0;
};