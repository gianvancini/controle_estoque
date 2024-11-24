import { Venda } from '../entities/venda';
import { AppDataSource } from '../data-source';
import { Between } from 'typeorm';

const dataAtual = new Date();

const inicioMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
const fimMesAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);

export const getVendasPorMes = async () => {

  const inicioMesAnterior = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1);
  const fimMesAnterior = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 0);

  const inicioMesAntesDoAnterior = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 2, 1);
  const fimMesAntesDoAnterior = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 0);

  try {
    const vendasMesAtual = await AppDataSource.getRepository(Venda).find({
      where: { data_venda: Between(inicioMesAtual, fimMesAtual) },
      relations: ["cliente", "vendedor"]
    });

    const vendasMesAnterior = await AppDataSource.getRepository(Venda).find({
      where: { data_venda: Between(inicioMesAnterior, fimMesAnterior) },
      relations: ["cliente", "vendedor"]
    });

    const vendasMesAntesDoAnterior = await AppDataSource.getRepository(Venda).find({
      where: { data_venda: Between(inicioMesAntesDoAnterior, fimMesAntesDoAnterior) },
      relations: ["cliente", "vendedor"]
    });

    const calcularTotais = (vendas: Venda[]) => {
        const numeroVendas = vendas.length;
        const totalVendas = vendas.reduce((total, venda) => {
          const valorVenda = parseFloat(venda.total_venda.toString()) || 0;
          return total + valorVenda;
        }, 0);
        return { numeroVendas, totalVendas: totalVendas.toFixed(2) };
    };

    return {
      mesAtual: calcularTotais(vendasMesAtual),
      mesAnterior: calcularTotais(vendasMesAnterior),
      mesAntesDoAnterior: calcularTotais(vendasMesAntesDoAnterior)
    };
  } catch (error) {
    console.error("Erro ao buscar vendas dos últimos três meses:", error);
    throw new Error("Erro ao buscar vendas dos últimos três meses.");
  }
};

export const getVendasPorVendedor = async () => {
  try {
    const vendasMesAnterior = await AppDataSource.getRepository(Venda).find({
      where: { data_venda: Between(inicioMesAtual, fimMesAtual) },
      relations: ["cliente", "vendedor"]
    });

    const calcularVendasPorVendedor = (vendas: Venda[]) => {
      const vendasPorVendedor = vendas.reduce((acumulado, venda) => {
        const vendedorId = venda.vendedor.id;
        const valorVenda = parseFloat(venda.total_venda.toString()) || 0;

        if (!acumulado[vendedorId]) {
          acumulado[vendedorId] = { vendedor: venda.vendedor.nome, totalVendas: 0 };
        }
        acumulado[vendedorId].totalVendas += valorVenda;
        return acumulado;
      }, {});

      return Object.values(vendasPorVendedor);
    };

    return calcularVendasPorVendedor(vendasMesAnterior);
  } catch (error) {
    console.error("Erro ao buscar vendas por vendedor no mês anterior:", error);
    throw new Error("Erro ao buscar vendas por vendedor no mês anterior.");
  }
};
