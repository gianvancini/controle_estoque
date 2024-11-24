import { AppDataSource } from "../data-source";
import { Produto } from "../entities/produto";

export const produtoRepository = AppDataSource.getRepository(Produto);

export const getAllProdutos = async (): Promise<Produto[]> => {
    return await produtoRepository.find();
};

export const getProdutoById = async (id: number): Promise<Produto | null> => {
    return await produtoRepository.findOneBy({ id });
};

export const createProduto = async (produtoData: Partial<Produto>): Promise<Produto> => {
    const produto = produtoRepository.create(produtoData);
    return await produtoRepository.save(produto);
};

export const deleteProdutoById = async (id: number): Promise<boolean> => {
    const result = await produtoRepository.delete(id);
    return result.affected !== 0;
};

export const updateProduto = async (id: number, produtoData: Partial<Produto>): Promise<Produto | null> => {
    const produto = await getProdutoById(id);
    if (!produto) return null;
    produtoRepository.merge(produto, produtoData);
    return await produtoRepository.save(produto);
};