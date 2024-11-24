import { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { FaDollarSign, FaShoppingCart, FaUserAlt } from "react-icons/fa";
import { getVendasMes, getVendasVendedor, getCotacaoDolar } from "../services/dashboardService";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const Dashboard = () => {
  const [cotacaoDolar, setCotacaoDolar] = useState<number | null>(null);
  const [vendasPorMes, setVendasPorMes] = useState({
    mesAtual: { numeroVendas: 0, totalVendas: 0 },
    mesAnterior: { numeroVendas: 0, totalVendas: 0 },
    mesAntesDoAnterior: { numeroVendas: 0, totalVendas: 0 },
  });
  const [vendasPorVendedor, setVendasPorVendedor] = useState<
    { vendedorNome: string; totalVendas: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cotacao = await getCotacaoDolar();
        setCotacaoDolar(cotacao);
        const vendas = await getVendasMes();
        setVendasPorMes(vendas);
        const vendasVendedor = await getVendasVendedor();
        setVendasPorVendedor(vendasVendedor);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    };

    fetchData();
  }, []);

  const currentMonth = format(new Date(), 'MMMM', { locale: ptBR });
  const lastMonth = format(subMonths(new Date(), 1), 'MMMM', { locale: ptBR });
  const twoMonthsAgo = format(subMonths(new Date(), 2), 'MMMM', { locale: ptBR });

  const data = {
    labels: [currentMonth, lastMonth, twoMonthsAgo],
    datasets: [
        {
          label: "", 
        data: [
          vendasPorMes.mesAtual.totalVendas,
          vendasPorMes.mesAnterior.totalVendas,
          vendasPorMes.mesAntesDoAnterior.totalVendas,
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],
        borderColor: ['#388e3c', '#f57c00', '#1976d2'],
        borderWidth: 1,
        datalabels: {
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14,
          },
          formatter: (value: number) => `R$ ${value}`,
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: true,
        formatter: (value: number) => `R$ ${value.toFixed(2)}`,
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: false,
        },
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm mb-3" style={{ backgroundColor: '#f1f1f1' }}>
            <Card.Body>
              <Card.Title><FaDollarSign size={32} color="#2196f3" /> Cotação do Dólar</Card.Title>
              <Card.Text>
                <strong>{cotacaoDolar ? `R$ ${cotacaoDolar.toFixed(2)}` : 'Carregando...'}</strong>
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title><FaUserAlt size={32} color="#ff9800" /> Vendas por vendedor no mês</Card.Title>
              <ListGroup variant="flush">
                {vendasPorVendedor.map((vendedor, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{vendedor.vendedor}</strong> - R$ {vendedor.totalVendas.toFixed(2)}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={6} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title><FaShoppingCart size={32} color="#4caf50" /> Vendas nos últimos 3 meses</Card.Title>
              <Bar data={data} options={options} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;