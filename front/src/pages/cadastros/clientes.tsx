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
  fetchClientes,
  editCliente,
  addCliente,
  deleteCliente,
} from "../../services/cadastros/clienteService";
import { FaPlus, FaSearch } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    numero: "",
    cep: "",
    cidade: "",
    uf: "",
    data_nascimento: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [clientesPerPage] = useState(6);
  const [showToast, setShowToast] = useState(false);
  const [showAddToast, setShowAddToast] = useState(false);
  const [showEditToast, setShowEditToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const clientesData = await fetchClientes();
      setClientes(clientesData);
      setFilteredClientes(clientesData);
    };
    fetchData();
  }, []);

  const handleShowDetail = (cliente) => {
    setCurrentCliente(cliente);
    setFormData({
      nome: cliente.nome,
      cpf: cliente.cpf,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      numero: cliente.numero,
      cep: cliente.cep,
      cidade: cliente.cidade,
      uf: cliente.uf,
      data_nascimento: new Date(cliente.data_nascimento)
        .toISOString()
        .split("T")[0],
    });
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setCurrentCliente(null);
  };

  const handleShowEdit = () => {
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setCurrentCliente(null);
    setShowDetail(false);
  };

  const handleShowAdd = () => {
    setFormData({
      nome: "",
      cpf: "",
      email: "",
      telefone: "",
      endereco: "",  
      numero: "",
      cep: "",
      cidade: "",
      uf: "",
      data_nascimento: "",
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
      await editCliente(currentCliente.id, formData);
      const clientesData = await fetchClientes();
      setClientes(clientesData);
      setFilteredClientes(clientesData);
      handleCloseEdit();
      setShowEditToast(true);
      setShowDetail(false);
    } catch (error) {
      console.error("Erro ao editar cliente", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validarCPF(formData.cpf)) {
      alert("CPF inválido!");
      return;
    }

    try {
      await addCliente(formData);
      const clientesData = await fetchClientes();
      setClientes(clientesData);
      setFilteredClientes(clientesData);
      handleCloseAdd();
      setShowAddToast(true);
    } catch (error) {
      console.error("Erro ao adicionar cliente", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await deleteCliente(id);
        const clientesData = await fetchClientes();
        setClientes(clientesData);
        setFilteredClientes(clientesData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setShowDetail(false);
      } catch (error) {
        console.error("Erro ao excluir cliente", error);
      }
    }
  };

  const indexOfLastCliente = currentPage * clientesPerPage;
  const indexOfFirstCliente = indexOfLastCliente - clientesPerPage;
  const currentClientes = filteredClientes.slice(
    indexOfFirstCliente,
    indexOfLastCliente
  );
  const totalPages = Math.ceil(filteredClientes.length / clientesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(e.target.value.toLowerCase()) ||
        cliente.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        cliente.telefone.includes(e.target.value)
    );
    setFilteredClientes(filtered);
    setCurrentPage(1);
  };

  return (
    <div>
      <h4 className="text-center mb-3">Clientes</h4>

      <CustomToast
        show={showToast}
        message="Cliente excluído com sucesso!"
        onClose={() => setShowToast(false)}
        bg="success"
      />
      <CustomToast
        show={showAddToast}
        message="Cliente adicionado com sucesso!"
        onClose={() => setShowAddToast(false)}
        bg="success"
      />
      <CustomToast
        show={showEditToast}
        message="Cliente editado com sucesso!"
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
            aria-label="Pesquisar clientes"
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
            <th className="text-center">Telefone</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentClientes.map((cliente) => (
            <tr key={cliente.id}>
              <td className="align-middle">{cliente.nome}</td>
              <td className="align-middle">{cliente.email}</td>
              <td className="align-middle">{cliente.telefone}</td>
              <td className="align-middle">
                <Button
                  variant="warning"
                  onClick={() => handleShowDetail(cliente)}
                >
                  Ver mais
                </Button>
                <Button
                  variant="success"
                  onClick={() =>
                    window.open(
                      `https://api.whatsapp.com/send?phone=${cliente.telefone}`,
                      "_blank"
                    )
                  }
                  className="ms-2"
                >
                  <FaWhatsapp />
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

      <Modal show={showAdd} onHide={handleCloseAdd} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
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
                Adicionar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDetail} onHide={handleCloseDetail} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCliente && (
            <div>
              <Row className="mb-3">
                <Col md={8}>
                  <strong>Nome:</strong>
                  <p>{currentCliente.nome}</p>
                </Col>
                <Col md={4}>
                  <strong>Data de Nascimento:</strong>
                  <p>{new Date(currentCliente.data_nascimento).toLocaleDateString()}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <strong>CPF:</strong>
                  <p>{currentCliente.cpf}</p>
                </Col>
                <Col md={4}>
                  <strong>Telefone:</strong>
                  <p>{currentCliente.telefone}</p>
                </Col>
                <Col md={4}>
                  <strong>Email:</strong>
                  <p>{currentCliente.email}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={8}>
                  <strong>Endereço:</strong>
                  <p>{currentCliente.endereco}</p>
                </Col>
                <Col md={4}>
                  <strong>Número:</strong>
                  <p>{currentCliente.numero}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <strong>CEP:</strong>
                  <p>{currentCliente.cep}</p>
                </Col>
                <Col md={4}>
                  <strong>Cidade:</strong>
                  <p>{currentCliente.cidade}</p>
                </Col>
                <Col md={4}>
                  <strong>UF:</strong>
                  <p>{currentCliente.uf}</p>
                </Col>
              </Row>

              <Button variant="warning" className="me-2" onClick={handleShowEdit}>
                Editar
              </Button>
              <Button variant="danger" onClick={() => handleDelete(currentCliente.id)}>
                Excluir
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>


      <Modal show={showEdit} onHide={handleCloseEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentCliente && (
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

export default Clientes;
