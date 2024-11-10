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
import CustomToast from "./components/CustomToast";
import {
  fetchEstoque,
  editEstoque,
  deleteEstoque,
} from "../services/estoqueService";
import { FaSearch } from "react-icons/fa";

const Estoques = () => {
  const [estoques, setEstoques] = useState([]);
  const [filteredEstoques, setFilteredEstoques] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentEstoque, setCurrentEstoque] = useState(null);
  const [formData, setFormData] = useState({
    produto: "",
    cor: "",
    n_serie: "",
    quantidade_disponivel: "",
    preco_custo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [estoquesPerPage] = useState(6);
  const [showToast, setShowToast] = useState(false);
  const [showEditToast, setShowEditToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const estoquesData = await fetchEstoque();
      setEstoques(estoquesData);
      setFilteredEstoques(estoquesData);
    };
    fetchData();
  }, []);

  const handleShowDetail = (estoque) => {
    setCurrentEstoque(estoque);
    setFormData({
        produto: estoque.produto,
        cor: estoque.cor,
        n_serie: estoque.n_serie,
        quantidade_disponivel: estoque.quantidade_disponivel,
        preco_custo: estoque.preco_custo,
    });
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setCurrentEstoque(null);
  };

  const handleShowEdit = () => {
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setCurrentEstoque(null);
    setShowDetail(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      await editEstoque(currentEstoque.id, formData);
      const estoquesData = await fetchEstoque();
      setEstoques(estoquesData);
      setFilteredEstoques(estoquesData);
      handleCloseEdit();
      setShowEditToast(true);
      setShowDetail(false);
    } catch (error) {
      console.error("Erro ao editar estoque", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este estoque?")) {
      try {
        await deleteEstoque(id);
        const estoquesData = await fetchEstoque();
        setEstoques(estoquesData);
        setFilteredEstoques(estoquesData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setShowDetail(false);
      } catch (error) {
        console.error("Erro ao excluir estoque", error);
      }
    }
  };

  const indexOfLastEstoque = currentPage * estoquesPerPage;
  const indexOfFirstEstoque = indexOfLastEstoque - estoquesPerPage;
  const currentEstoques = filteredEstoques.slice(
    indexOfFirstEstoque,
    indexOfLastEstoque
  );
  const totalPages = Math.ceil(filteredEstoques.length / estoquesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = estoques.filter(
      (estoque) =>
        estoque.produto.modelo.toLowerCase().includes(e.target.value.toLowerCase()) ||
        estoque.n_serie.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEstoques(filtered);
    setCurrentPage(1);
  };

  return (
    <div>
      <h4 className="text-center mb-3">Estoque</h4>

      <CustomToast
        show={showToast}
        message="Estoque excluído com sucesso!"
        onClose={() => setShowToast(false)}
        bg="success"
      />
      <CustomToast
        show={showEditToast}
        message="Estoque editado com sucesso!"
        onClose={() => setShowEditToast(false)}
        bg="success"
      />

      <div className="d-flex align-items-center mb-3">
        <InputGroup className="me-2">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Pesquisar por nome ou número de série..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Pesquisar estoques"
          />
        </InputGroup>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-center">Marca</th>
            <th className="text-center">Produto</th>
            <th className="text-center">Capacidade</th>
            <th className="text-center">Cor</th>
            <th className="text-center">Quantidade</th>
            <th className="text-center">Preço de Custo</th>
            <th className="text-center">Preço de Venda</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentEstoques.map((estoque) => (
            <tr key={estoque.id}>
              <td className="align-middle text-center">{estoque.produto.marca}</td>
              <td className="align-middle text-center">{estoque.produto.modelo}</td>
              <td className="align-middle text-center">{estoque.produto.capacidade}</td>
              <td className="align-middle text-center">{estoque.cor}</td>
              <td className="align-middle text-center">{estoque.quantidade_disponivel}</td>
              <td className="align-middle text-center">{estoque.preco_custo}</td>
              <td className="align-middle text-center">{estoque.produto.preco_venda}</td>
              <td className="align-middle text-center">
                <Button
                  variant="warning"
                  onClick={() => handleShowDetail(estoque)}
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
          <Modal.Title>Detalhes do Estoque</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentEstoque && (
            <div>
              <Row className="mb-3">
                <Col md={8}>
                  <strong>Nome:</strong>
                  <p>{currentEstoque.nome}</p>
                </Col>
                <Col md={4}>
                  <strong>Data de Nascimento:</strong>
                  <p>{new Date(currentEstoque.data_nascimento).toLocaleDateString()}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <strong>CPF:</strong>
                  <p>{currentEstoque.cpf}</p>
                </Col>
                <Col md={4}>
                  <strong>Telefone:</strong>
                  <p>{currentEstoque.telefone}</p>
                </Col>
                <Col md={4}>
                  <strong>Email:</strong>
                  <p>{currentEstoque.email}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={8}>
                  <strong>Endereço:</strong>
                  <p>{currentEstoque.endereco}</p>
                </Col>
                <Col md={4}>
                  <strong>Número:</strong>
                  <p>{currentEstoque.numero}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <strong>CEP:</strong>
                  <p>{currentEstoque.cep}</p>
                </Col>
                <Col md={4}>
                  <strong>Cidade:</strong>
                  <p>{currentEstoque.cidade}</p>
                </Col>
                <Col md={4}>
                  <strong>UF:</strong>
                  <p>{currentEstoque.uf}</p>
                </Col>
              </Row>

              <Button variant="warning" className="me-2" onClick={handleShowEdit}>
                Editar
              </Button>
              <Button variant="danger" onClick={() => handleDelete(currentEstoque.id)}>
                Excluir
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>


      <Modal show={showEdit} onHide={handleCloseEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Estoque</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentEstoque && (
            <Form onSubmit={handleEdit}>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group controlId="formNome">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formDataNascimento">
                    <Form.Label>Data de Nascimento</Form.Label>
                    <Form.Control
                      type="date"
                      name="data_nascimento"
                      value={formData.data_nascimento}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="formCpf">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formTelefone">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group controlId="formEndereco">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formNumero">
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="formCep">
                    <Form.Label>CEP</Form.Label>
                    <Form.Control
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formCidade">
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formUf">
                    <Form.Label>UF</Form.Label>
                    <Form.Control
                      type="text"
                      name="uf"
                      value={formData.uf}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-4">
                <Button variant="primary" type="submit">
                  Salvar
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Estoques;