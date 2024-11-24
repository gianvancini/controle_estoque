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
  fetchUsuarios,
  editUsuario,
  addUsuario,
  deleteUsuario,
} from "../../services/cadastros/usuarioService";
import { FaEdit, FaPlus, FaSearch, FaTrashAlt } from "react-icons/fa";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    usuario: "",
    tipo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usuariosPerPage] = useState(6);
  const [showToast, setShowToast] = useState(false);
  const [showAddToast, setShowAddToast] = useState(false);
  const [showEditToast, setShowEditToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const usuariosData = await fetchUsuarios();
      setUsuarios(usuariosData);
      setFilteredUsuarios(usuariosData);
    };
    fetchData();
  }, []);

  const handleShowEdit = (usuario) => {
    setCurrentUsuario(usuario);
    setFormData({
      email: usuario.email,
      usuario: usuario.usuario,
      tipo: usuario.tipo,
    });
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setCurrentUsuario(null);
  };

  const handleShowAdd = () => {
    setFormData({
      email: "",
      senha: "",
      usuario: "",
      tipo: "",
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
      await editUsuario(currentUsuario.id, formData);
      const usuariosData = await fetchUsuarios();
      setUsuarios(usuariosData);
      setFilteredUsuarios(usuariosData);
      handleCloseEdit();
      setShowEditToast(true);
    } catch (error) {
      console.error("Erro ao editar usuario", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await addUsuario(formData);
      const usuariosData = await fetchUsuarios();
      setUsuarios(usuariosData);
      setFilteredUsuarios(usuariosData);
      handleCloseAdd();
      setShowAddToast(true);
    } catch (error) {
      console.error("Erro ao adicionar usuário", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteUsuario(id);
        const usuariosData = await fetchUsuarios();
        setUsuarios(usuariosData);
        setFilteredUsuarios(usuariosData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        console.error("Erro ao excluir usuário", error);
      }
    }
  };

  const indexOfLastUsuario = currentPage * usuariosPerPage;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
  const currentUsuarios = filteredUsuarios.slice(
    indexOfFirstUsuario,
    indexOfLastUsuario
  );
  const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = usuarios.filter(
      (usuario) =>
        usuario.usuario.toLowerCase().includes(e.target.value.toLowerCase()) ||
        usuario.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsuarios(filtered);
    setCurrentPage(1);
  };

  return (
    <div>
      <h4 className="text-center mb-3">Usuários</h4>

      <CustomToast
        show={showToast}
        message="Usuário excluído com sucesso!"
        onClose={() => setShowToast(false)}
        bg="success"
      />
      <CustomToast
        show={showAddToast}
        message="Usuário adicionado com sucesso!"
        onClose={() => setShowAddToast(false)}
        bg="success"
      />
      <CustomToast
        show={showEditToast}
        message="Usuário editado com sucesso!"
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
            aria-label="Pesquisar usuarios"
          />
        </InputGroup>

        <Button variant="primary" onClick={handleShowAdd}>
          <FaPlus />
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-center">Usuário</th>
            <th className="text-center">Email</th>
            <th className="text-center">Tipo</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentUsuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td className="align-middle">{usuario.usuario}</td>
              <td className="align-middle">{usuario.email}</td>
              <td className="align-middle text-center">{usuario.tipo}</td>
              <td className="align-middle">
                <Button
                  variant="danger"
                  className="me-2"
                  onClick={() => handleDelete(usuario.id)}
                >
                  <FaTrashAlt />
                </Button>
                <Button
                variant="warning"
                className="me-2"
                onClick={() => handleShowEdit(usuario)}
              >
                <FaEdit />
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
          <Modal.Title>Adicionar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formUsuario">
                  <Form.Label>Usuário</Form.Label>
                  <Form.Control
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formSenha">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="senha"
                    value={formData.senha}
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
                <Form.Group controlId="formTipo">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    type="text"
                    name="tipo"
                    value={formData.tipo}
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

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUsuario && (
            <Form onSubmit={handleEdit}>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formUsuario">
                    <Form.Label>Usuário</Form.Label>
                    <Form.Control
                      type="text"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Data de Admissão</Form.Label>
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
                <Col>
                  <Form.Group controlId="formTipo">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Control
                      type="string"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
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

export default Usuarios;
