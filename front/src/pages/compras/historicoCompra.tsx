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
import { fetchCompras, deleteCompra, fetchItensCompraByCompraId } from "../../services/compras/historicoCompraService";
import { FaSearch } from "react-icons/fa";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [filteredCompras, setFilteredCompras] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [currentCompra, setCurrentCompra] = useState(null);
  const [itensCompra, setItensCompra] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [comprasPerPage] = useState(6);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const comprasData = await fetchCompras();
      setCompras(comprasData);
      setFilteredCompras(comprasData);
    };
    fetchData();
  }, []);

  const handleShowDetail = async (compra) => {
    setCurrentCompra(compra);

    try {
      const fetchedItens = await fetchItensCompraByCompraId(compra.id);
      setItensCompra(fetchedItens);
    } catch (error) {
      console.error("Erro ao carregar itens da compra", error);
    }

    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setCurrentCompra(null);
    setItensCompra([]);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta compra?")) {
      try {
        await deleteCompra(id);
        const comprasData = await fetchCompras();
        setCompras(comprasData);
        setFilteredCompras(comprasData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setShowDetail(false);
      } catch (error) {
        console.error("Erro ao excluir compra", error);
      }
    }
  };

  const indexOfLastCompra = currentPage * comprasPerPage;
  const indexOfFirstCompra = indexOfLastCompra - comprasPerPage;
  const currentCompras = filteredCompras.slice(indexOfFirstCompra, indexOfLastCompra);
  const totalPages = Math.ceil(filteredCompras.length / comprasPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = compras.filter(
      (compra) =>
        compra.fornecedor.toLowerCase().includes(e.target.value.toLowerCase()) ||
        compra.data_compra.toLowerCase().includes(e.target.value.toLowerCase()) ||
        compra.n_nota.includes(e.target.value)
    );
    setFilteredCompras(filtered);
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div>
      <h4 className="text-center mb-3">Histórico de compras</h4>

      <CustomToast
        show={showToast}
        message="Compra excluída com sucesso!"
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
            aria-label="Pesquisar compras"
          />
        </InputGroup>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-center">Data</th>
            <th className="text-center">Fornecedor</th>
            <th className="text-center">Número da nota</th>
            <th className="text-center">Total</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentCompras.map((compra) => (
            <tr key={compra.id}>
              <td className="align-middle">{formatDate(compra.data_compra)}</td>
              <td className="align-middle">{compra.fornecedor}</td>
              <td className="align-middle text-center">{compra.n_nota}</td>
              <td className="align-middle">{compra.total_compra}</td>
              <td className="align-middle">
                <Button
                  variant="warning"
                  onClick={() => handleShowDetail(compra)}
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
          <Modal.Title>Detalhes da Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCompra && (
            <>
              <Row className="mb-3">
                <Col>
                  <strong>Data:</strong>
                  <p>{formatDate(currentCompra.data_compra)}</p>
                </Col>
                <Col>
                  <strong>Fornecedor:</strong>
                  <p>{currentCompra.fornecedor}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <strong>Número da nota:</strong>
                  <p>{currentCompra.n_nota}</p>
                </Col>
                <Col>
                  <strong>Total:</strong>
                  <p>{currentCompra.total_compra}</p>
                </Col>
              </Row>

              <h5 className="mt-4">Itens da Compra</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th className="text-center">Produto</th>
                    <th className="text-center">Cor</th>
                    <th className="text-center">Numero de serie</th>
                    <th className="text-center">Preço de Custo</th>
                    <th className="text-center">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {itensCompra.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle">{item.produto.modelo}</td>
                      <td className="align-middle">{item.cor}</td>
                      <td className="align-middle">{item.n_serie}</td>
                      <td className="align-middle">{item.preco_custo}</td>
                      <td className="align-middle">{item.quantidade}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Button
                variant="danger"
                onClick={() => handleDelete(currentCompra.id)}
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

export default Compras;