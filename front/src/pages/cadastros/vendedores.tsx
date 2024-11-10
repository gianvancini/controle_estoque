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
  fetchVendedores,
  editVendedor,
  addVendedor,
  deleteVendedor,
} from "../../services/cadastros/vendedorService";
import { FaPlus, FaSearch } from "react-icons/fa";

const Vendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [filteredVendedores, setFilteredVendedores] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [currentVendedor, setCurrentVendedor] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    comissao: "",
    data_adm: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [vendedoresPerPage] = useState(6);
  const [showToast, setShowToast] = useState(false);
  const [showAddToast, setShowAddToast] = useState(false);
  const [showEditToast, setShowEditToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const vendedoresData = await fetchVendedores();
      setVendedores(vendedoresData);
      setFilteredVendedores(vendedoresData);
    };
    fetchData();
  }, []);

  const handleShowDetail = (vendedor) => {
    setCurrentVendedor(vendedor);
    setFormData({
      nome: vendedor.nome,
      cpf: vendedor.cpf,
      email: vendedor.email,
      comissao: vendedor.comissao,
      data_adm: new Date(vendedor.data_adm).toISOString().split("T")[0],
    });
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setCurrentVendedor(null);
  };

  const handleShowEdit = () => {
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setCurrentVendedor(null);
    setShowDetail(false);
  };

  const handleShowAdd = () => {
    setFormData({
      nome: "",
      cpf: "",
      email: "",
      comissao: "",
      data_adm: "",
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

  const validarCPF = (cpf) => {

    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validarCPF(formData.cpf)) {
      alert("CPF inválido!");
      return;
    }

    try {
      await editVendedor(currentVendedor.id, formData);
      const vendedoresData = await fetchVendedores();
      setVendedores(vendedoresData);
      setFilteredVendedores(vendedoresData);
      handleCloseEdit();
      setShowEditToast(true);
      setShowDetail(false);
    } catch (error) {
      console.error("Erro ao editar vendedor", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validarCPF(formData.cpf)) {
      alert("CPF inválido!");
      return;
    }

    try {
      await addVendedor(formData);
      const vendedoresData = await fetchVendedores();
      setVendedores(vendedoresData);
      setFilteredVendedores(vendedoresData);
      handleCloseAdd();
      setShowAddToast(true);
    } catch (error) {
      console.error("Erro ao adicionar vendedor", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este vendedor?")) {
      try {
        await deleteVendedor(id);
        const vendedoresData = await fetchVendedores();
        setVendedores(vendedoresData);
        setFilteredVendedores(vendedoresData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setShowDetail(false);
      } catch (error) {
        console.error("Erro ao excluir vendedor", error);
      }
    }
  };

  const indexOfLastVendedor = currentPage * vendedoresPerPage;
  const indexOfFirstVendedor = indexOfLastVendedor - vendedoresPerPage;
  const currentVendedores = filteredVendedores.slice(
    indexOfFirstVendedor,
    indexOfLastVendedor
  );
  const totalPages = Math.ceil(filteredVendedores.length / vendedoresPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = vendedores.filter(
      (vendedor) =>
        vendedor.nome.toLowerCase().includes(e.target.value.toLowerCase()) ||
        vendedor.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredVendedores(filtered);
    setCurrentPage(1);
  };

  return (
    <div>
      <h4 className="text-center mb-3">Vendedores</h4>

      <CustomToast
        show={showToast}
        message="Vendedor excluído com sucesso!"
        onClose={() => setShowToast(false)}
        bg="success"
      />
      <CustomToast
        show={showAddToast}
        message="Vendedor adicionado com sucesso!"
        onClose={() => setShowAddToast(false)}
        bg="success"
      />
      <CustomToast
        show={showEditToast}
        message="Vendedor editado com sucesso!"
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
            aria-label="Pesquisar vendedores"
          />
        </InputGroup>

        <Button variant="primary" onClick={handleShowAdd}>
          <FaPlus />
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-center">Nome</th>
            <th className="text-center">Email</th>
            <th className="text-center">Comissão</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentVendedores.map((vendedor) => (
            <tr key={vendedor.id}>
              <td className="align-middle">{vendedor.nome}</td>
              <td className="align-middle">{vendedor.email}</td>
              <td className="align-middle text-center">{vendedor.comissao}</td>
              <td className="align-middle">
                <Button
                  variant="warning"
                  onClick={() => handleShowDetail(vendedor)}
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
          <Modal.Title>Adicionar Vendedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Form.Group controlId="formNome" className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
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
              <Col>
                <Form.Group controlId="formAdm">
                  <Form.Label>Data de Admissão</Form.Label>
                  <Form.Control
                    type="date"
                    name="data_adm"
                    value={formData.data_adm}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
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
              <Col>
                <Form.Group controlId="formComissao">
                  <Form.Label>Comissão</Form.Label>
                  <Form.Control
                    type="text"
                    name="comissao"
                    value={formData.comissao}
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
          <Modal.Title>Detalhes do Vendedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentVendedor && (
            <div>
              <div className="mb-3">
                <strong>Nome:</strong>
                <p>{currentVendedor.nome}</p>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <strong>CPF:</strong>
                  <p>{currentVendedor.cpf}</p>
                </div>
                <div className="col">
                  <strong>Data de Admissão:</strong>
                  <p>
                    {new Date(currentVendedor.data_adm).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <strong>Email:</strong>
                  <p>{currentVendedor.email}</p>
                </div>
                <div className="col">
                  <strong>Comissão:</strong>
                  <p>{currentVendedor.comissao}</p>
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
                onClick={() => handleDelete(currentVendedor.id)}
              >
                Excluir
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Vendedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentVendedor && (
            <Form onSubmit={handleEdit}>
              <Form.Group controlId="formNome" className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Row className="mb-3">
                <Col>
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
                <Col>
                  <Form.Group controlId="formAdm">
                    <Form.Label>Data de Admissão</Form.Label>
                    <Form.Control
                      type="date"
                      name="data_adm"
                      value={formData.data_adm}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
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
                <Col>
                  <Form.Group controlId="formComissao">
                    <Form.Label>Comissão</Form.Label>
                    <Form.Control
                      type="text"
                      name="comissao"
                      value={formData.comissao}
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

export default Vendedores;
