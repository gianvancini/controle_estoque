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
import {
  fetchProdutos,
  editProduto,
  addProduto,
  deleteProduto,
} from "../../services/cadastros/produtoService";
import { FaPlus, FaSearch } from "react-icons/fa";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [currentProduto, setCurrentProduto] = useState(null);
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    cor: "",
    capacidade: "",
    catalogavel: false,
    unico: false,
    estado: "",
    tipo: "",
    preco_venda: "",
    preco_forn: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [produtosPerPage] = useState(6);
  const [showToast, setShowToast] = useState(false);
  const [showAddToast, setShowAddToast] = useState(false);
  const [showEditToast, setShowEditToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const produtosData = await fetchProdutos();
      setProdutos(produtosData);
      setFilteredProdutos(produtosData);
    };
    fetchData();
  }, []);

  const handleShowDetail = (produto) => {
    setCurrentProduto(produto);
    setFormData({
      marca: produto.marca,
      modelo: produto.modelo,
      cor: produto.cor,
      tipo: produto.tipo,
      capacidade: produto.capacidade,
      catalogavel: produto.catalogavel,
      unico: produto.unico,
      estado: produto.estado,
      preco_venda: produto.preco_venda,
      preco_forn: produto.preco_forn,
    });
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setCurrentProduto(null);
  };

  const handleShowEdit = () => {
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setCurrentProduto(null);
    setShowDetail(false);
  };

  const handleShowAdd = () => {
    setFormData({
      marca: "",
      modelo: "",
      cor: "",
      tipo: "",
      capacidade: "",
      catalogavel: false,
      unico: false,
      estado: "",
      preco_venda: "",
      preco_forn: "",
    });
    setShowAdd(true);
  };

  const handleCloseAdd = () => {
    setShowAdd(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      await editProduto(currentProduto.id, formData);
      const produtosData = await fetchProdutos();
      setProdutos(produtosData);
      setFilteredProdutos(produtosData);
      handleCloseEdit();
      setShowEditToast(true);
      setShowDetail(false);
    } catch (error) {
      console.error("Erro ao editar produto", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await addProduto(formData);
      const produtosData = await fetchProdutos();
      setProdutos(produtosData);
      setFilteredProdutos(produtosData);
      handleCloseAdd();
      setShowAddToast(true);
    } catch (error) {
      console.error("Erro ao adicionar produto", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduto(id);
        const produtosData = await fetchProdutos();
        setProdutos(produtosData);
        setFilteredProdutos(produtosData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setShowDetail(false);
      } catch (error) {
        console.error("Erro ao excluir produto", error);
      }
    }
  };

  const indexOfLastProduto = currentPage * produtosPerPage;
  const indexOfFirstProduto = indexOfLastProduto - produtosPerPage;
  const currentProdutos = filteredProdutos.slice(
    indexOfFirstProduto,
    indexOfLastProduto
  );
  const totalPages = Math.ceil(filteredProdutos.length / produtosPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = produtos.filter(
      (produto) =>
        produto.marca.toLowerCase().includes(e.target.value.toLowerCase()) ||
        produto.modelo.toLowerCase().includes(e.target.value.toLowerCase()) ||
        produto.capacidade.includes(e.target.value)
    );
    setFilteredProdutos(filtered);
    setCurrentPage(1);
  };

  return (
    <div>
      <h4 className="text-center mb-3">Produtos</h4>

      <CustomToast
        show={showToast}
        message="Produto excluído com sucesso!"
        onClose={() => setShowToast(false)}
        bg="success"
      />
      <CustomToast
        show={showAddToast}
        message="Produto adicionado com sucesso!"
        onClose={() => setShowAddToast(false)}
        bg="success"
      />
      <CustomToast
        show={showEditToast}
        message="Produto editado com sucesso!"
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
            placeholder="Pesquisar por nome..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Pesquisar produtos"
          />
        </InputGroup>

        <Button variant="primary" onClick={handleShowAdd}>
          <FaPlus />
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-center">Marca</th>
            <th className="text-center">Modelo</th>
            <th className="text-center">Capacidade</th>
            <th className="text-center">Estado</th>
            <th className="text-center">Preço de Venda</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentProdutos.map((produto) => (
            <tr key={produto.id}>
              <td className="align-middle">{produto.marca}</td>
              <td className="align-middle">{produto.modelo}</td>
              <td className="align-middle text-center">{produto.capacidade}</td>
              <td className="align-middle text-center">{produto.estado}</td>
              <td className="align-middle text-center">{produto.preco_venda}</td>
              <td className="align-middle">
                <Button
                  variant="warning"
                  onClick={() => handleShowDetail(produto)}
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

      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formMarca">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formModelo">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
            <Col>
                <Form.Group controlId="formEstado" className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCapacidade">
                  <Form.Label>Capacidade</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacidade"
                    value={formData.capacidade}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formTipo" className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formCatalogavel">
                  <Form.Check
                    type="checkbox"
                    label="Catalogável"
                    name="catalogavel"
                    checked={formData.catalogavel}
                    onChange={(e) =>
                      setFormData({ ...formData, catalogavel: e.target.checked })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formUnico">
                  <Form.Check
                    type="checkbox"
                    label="Único"
                    name="unico"
                    checked={formData.unico}
                    onChange={(e) =>
                      setFormData({ ...formData, unico: e.target.checked })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formPrecoForn">
                  <Form.Label>Preco de Custo ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="preco_forn"
                    value={formData.preco_forn}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formPrecoVenda">
                  <Form.Label>Preco de Venda (R$) </Form.Label>
                  <Form.Control
                    type="number"
                    name="preco_venda"
                    value={formData.preco_venda}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="primary" type="submit">
                Adicionar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDetail} onHide={handleCloseDetail}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentProduto && (
            <div>
              <div className="row mb-3">
                <div className="col">
                  <strong>Marca:</strong>
                  <p>{currentProduto.marca}</p>
                </div>
                <div className="col">
                  <strong>Modelo:</strong>
                  <p>{currentProduto.modelo}</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <strong>Estado:</strong>
                  <p>{currentProduto.estado}</p>
                </div>
                <div className="col">
                  <strong>Capacidade:</strong>
                  <p>{currentProduto.capacidade}</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <strong>Tipo:</strong>
                  <p>{currentProduto.tipo}</p>
                </div>
                <div className="col">
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <strong>Catalogável:</strong>
                  <p>{currentProduto.catalogavel ? "Sim" : "Não"}</p>
                </div>
                <div className="col">
                  <strong>Único:</strong>
                  <p>{currentProduto.unico ? "Sim" : "Não"}</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <strong>Preço de custo ($):</strong>
                  <p>{currentProduto.preco_forn}</p>
                </div>
                <div className="col">
                  <strong>Preço de venda (R$):</strong>
                  <p>{currentProduto.preco_venda}</p>
                </div>
              </div>
              <Button
                variant="warning"
                className="me-2"
                onClick={handleShowEdit}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(currentProduto.id)}
              >
                Excluir
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentProduto && (
            <Form onSubmit={handleEdit}>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formMarca">
                    <Form.Label>Marca</Form.Label>
                    <Form.Control
                      type="text"
                      name="marca"
                      value={formData.marca}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formModelo">
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control
                      type="text"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formEstado" className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      type="text"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCapacidade">
                    <Form.Label>Capacidade</Form.Label>
                    <Form.Control
                      type="number"
                      name="capacidade"
                      value={formData.capacidade}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formTipo" className="mb-3">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Control
                      type="text"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formCatalogavel">
                    <Form.Check
                      type="checkbox"
                      label="Catalogável"
                      name="catalogavel"
                      checked={formData.catalogavel}
                      onChange={(e) =>
                        setFormData({ ...formData, catalogavel: e.target.checked })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formUnico">
                    <Form.Check
                      type="checkbox"
                      label="Único"
                      name="unico"
                      checked={formData.unico}
                      onChange={(e) =>
                        setFormData({ ...formData, unico: e.target.checked })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formPrecoForn">
                    <Form.Label>Preco de Custo ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="preco_forn"
                      value={formData.preco_forn}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formPrecoVenda">
                    <Form.Label>Preco de Venda (R$)</Form.Label>
                    <Form.Control
                      type="number"
                      name="preco_venda"
                      value={formData.preco_venda}
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

export default Produtos;
