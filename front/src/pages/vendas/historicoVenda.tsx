import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Pagination,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import CustomToast from "../components/CustomToast";
import { fetchVendas, deleteVenda, fetchItensVendaByVendaId } from "../../services/vendas/historicoVendaService";
import { FaSearch } from "react-icons/fa";

const Vendas = () => {
  const [vendas, setVendas] = useState([]);
  const [filteredVendas, setFilteredVendas] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [currentVenda, setCurrentVenda] = useState(null);
  const [itensVenda, setItensVenda] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [vendasPerPage] = useState(6);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const vendasData = await fetchVendas();
      setVendas(vendasData);
      setFilteredVendas(vendasData);
    };
    fetchData();
  }, []);

  const handleShowDetail = async (venda) => {
    setCurrentVenda(venda);

    try {
      const fetchedItens = await fetchItensVendaByVendaId(venda.id);
      setItensVenda(fetchedItens);
    } catch (error) {
      console.error("Erro ao carregar itens da venda", error);
    }

    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setCurrentVenda(null);
    setItensVenda([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      try {
        await deleteVenda(id);
        const vendasData = await fetchVendas();
        setVendas(vendasData);
        setFilteredVendas(vendasData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setShowDetail(false);
      } catch (error) {
        console.error("Erro ao excluir venda", error);
      }
    }
  };

  const indexOfLastVenda = currentPage * vendasPerPage;
  const indexOfFirstVenda = indexOfLastVenda - vendasPerPage;
  const currentVendas = filteredVendas.slice(indexOfFirstVenda, indexOfLastVenda);
  const totalPages = Math.ceil(filteredVendas.length / vendasPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = vendas.filter(
      (venda) =>
        venda.cliente.nome.toLowerCase().includes(e.target.value.toLowerCase()) ||
        venda.vendedor.nome.toLowerCase().includes(e.target.value.toLowerCase()) ||
        venda.data_venda.includes(e.target.value)
    );
    setFilteredVendas(filtered);
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div>
      <h4 className="text-center mb-3">Histórico de vendas</h4>

      <CustomToast
        show={showToast}
        message="Venda excluída com sucesso!"
        onClose={() => setShowToast(false)}
        bg="success"
      />

      <div className="d-flex align-items-center mb-3">
        <InputGroup className="me-2">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Pesquisar vendas"
          />
        </InputGroup>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-center">Data</th>
            <th className="text-center">Cliente</th>
            <th className="text-center">Vendedor</th>
            <th className="text-center">Total</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentVendas.map((venda) => (
            <tr key={venda.id}>
              <td className="align-middle">{formatDate(venda.data_venda)}</td>
              <td className="align-middle">{venda.cliente.nome}</td>
              <td className="align-middle text-center">{venda.vendedor.nome}</td>
              <td className="align-middle">{venda.total_venda}</td>
              <td className="align-middle">
                <Button
                  variant="warning"
                  onClick={() => handleShowDetail(venda)}
                >
                  Ver mais
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showDetail} onHide={handleCloseDetail} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da Venda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentVenda && (
            <>
              <Row className="mb-3">
                <Col>
                  <strong>Data:</strong>
                  <p>{formatDate(currentVenda.data_venda)}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <strong>Cliente:</strong>
                  <p>{currentVenda.cliente.nome}</p>
                </Col>
                <Col>
                  <strong>Vendedor:</strong>
                  <p>{currentVenda.vendedor.nome}</p>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col>
                  <strong>Desconto:</strong>
                  <p>{currentVenda.desconto}</p>
                </Col>
                <Col>
                  <strong>Total:</strong>
                  <p>{currentVenda.total_venda}</p>
                </Col>
              </Row>

              <h5 className="mt-4">Itens da Venda</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th className="text-center">Produto</th>
                    <th className="text-center">Capacidade</th>
                    <th className="text-center">Cor</th>
                    <th className="text-center">Estado</th>
                    <th className="text-center">N. Série</th>
                  </tr>
                </thead>
                <tbody>
                  {itensVenda.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle">{item.produto.modelo}</td>
                      <td className="align-middle">{item.produto.capacidade}</td>
                      <td className="align-middle">{item.estoque.cor}</td>
                      <td className="align-middle">{item.produto.estado}</td>
                      <td className="align-middle">{item.estoque.n_serie}</td>

                    </tr>
                  ))}
                </tbody>
              </Table>

              <Button
                variant="danger"
                onClick={() => handleDelete(currentVenda.id)}
                className="mt-2"
              >
                Excluir
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Vendas;