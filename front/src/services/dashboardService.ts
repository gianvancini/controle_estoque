import axios from './login/axiosConfig';

interface VendasPorMes {
  mesAtual: {
    numeroVendas: number;
    totalVendas: number;
  };
  mesAnterior: {
    numeroVendas: number;
    totalVendas: number;
  };
  mesAntesDoAnterior: {
    numeroVendas: number;
    totalVendas: number;
  };
}

interface VendasVendedor {
    vendedor: string;
    totalVendas: number;
  };

export const getVendasMes = async (): Promise<VendasPorMes> => {
  try {
    const response = await axios.get('vendasMes');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vendas por mês", error);
    throw new Error("Erro ao buscar vendas por mês.");
  }
};

export const getVendasVendedor = async (): Promise<VendasVendedor> => {
  try {
    const response = await axios.get('vendasVendedor');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vendas por vendedor", error);
    throw new Error("Erro ao buscar vendas por vendedor.");
  }
};

export const getCotacaoDolar = async (): Promise<number> => {
  try {
    const response = await axios.get('https://economia.awesomeapi.com.br/json/USD-BRL');
    return parseFloat(response.data[0].bid);
  } catch (error) {
    console.error('Erro ao buscar cotação do dólar', error);
    return 0;
  }
};