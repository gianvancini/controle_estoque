import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Pagination, Toast, ToastContainer } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import InputMask from "react-input-mask";
import CustomToast from '../pages/components/CustomToast';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [currentCliente, setCurrentCliente] = useState(null);
    const [formData, setFormData] = useState({ nome: "", cpf: "", email: "", telefone: "", endereco: "", cidade: "", uf: "", data_nascimento: ""});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [clientesPerPage] = useState(7);
    const [showToast, setShowToast] = useState(false);
    const [showAddToast, setShowAddToast] = useState(false);
    const [showEditToast, setShowEditToast] = useState(false);

    const url = "http://localhost:3002/api";

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const fetchClientes = async () => {
        try {
            const response = await axios.get(`${url}/clientes`);
            setClientes(response.data);
            setFilteredClientes(response.data);
        } catch (error) {
            console.error("Erro ao buscar clientes", error);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleShowEdit = (cliente) => {
        setCurrentCliente(cliente);
        setFormData({
            nome: cliente.nome,
            cpf: cliente.cpf,
            email: cliente.email,
            telefone: cliente.telefone,
            endereco: cliente.endereco,
            cidade: cliente.cidade,
            uf: cliente.uf,
            data_nascimento: new Date(cliente.data_nascimento).toISOString().split('T')[0],

        });
        setShowEdit(true);
    };

    const handleShowAdd = () => {
        setFormData({ nome: "", cpf: "", email: "", telefone: "", endereco: "", cidade: "", uf: "", data_nascimento: ""});
        setShowAdd(true);
    };

    const handleCloseEdit = () => {
        setShowEdit(false);
        setCurrentCliente(null);
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
            await axios.put(`${url}/clientes/${currentCliente.id}`, formData);
            fetchClientes();
            handleCloseEdit();
            setShowEditToast(true);
        } catch (error) {
            console.error("Erro ao editar cliente", error);
        }
    };

    const isValidCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
        let sum = 0;
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) {
            remainder = 0;
        }
        if (remainder !== parseInt(cpf.charAt(9))) {
            return false;
        }
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) {
            remainder = 0;
        }
        return remainder === parseInt(cpf.charAt(10));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!isValidCPF(formData.cpf)) {
            alert("CPF inválido.");
            return;
        }
        try {
            await axios.post(`${url}/clientes`, formData);
            fetchClientes();
            handleCloseAdd();
            setShowAddToast(true);
            setTimeout(() => setShowAddToast(false), 3000);
        } catch (error) {
            console.error("Erro ao adicionar cliente", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
            try {
                await axios.delete(`${url}/clientes/${id}`);
                fetchClientes();
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } catch (error) {
                console.error("Erro ao excluir cliente", error);
            }
        }
    };

    const indexOfLastCliente = currentPage * clientesPerPage;
    const indexOfFirstCliente = indexOfLastCliente - clientesPerPage;
    const currentClientes = filteredClientes.slice(indexOfFirstCliente, indexOfLastCliente);
    const totalPages = Math.ceil(filteredClientes.length / clientesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const filtered = clientes.filter(cliente => cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredClientes(filtered);
        setCurrentPage(1);
    };

    const handleClearFilter = () => {
        setSearchTerm("");
        setFilteredClientes(clientes);
        setCurrentPage(1);
    };

    return (
        <div>
            <h4 className="text-center mb-3">Clientes</h4>

            {/* Toast de sucesso */}
            <CustomToast show={showToast} message="Cliente excluído com sucesso!" onClose={() => setShowToast(false)} bg="success" />
            <CustomToast show={showAddToast} message="Cliente adicionado com sucesso!" onClose={() => setShowAddToast(false)} bg="success" />
            <CustomToast show={showEditToast} message="Cliente editado com sucesso!" onClose={() => setShowEditToast(false)} bg="success" />

            {/* Campo de busca */}
            <Form onSubmit={handleSearchSubmit} className="mb-3">
                <div className="d-flex align-items-center">
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="me-2"
                    />
                    <Button type="submit" variant="outline-primary" className="me-2 small-font">
                        <FaSearch />
                    </Button>
                    <Button type="button" variant="outline-danger" onClick={handleClearFilter} className="small-font">
                        <FaTimes />
                    </Button>
                </div>
            </Form>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="text-center">ID</th>
                        <th className="text-center">Nome</th>
                        <th className="text-center">CPF</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Telefone</th>
                        <th className="text-center">Endereço</th>
                        <th className="text-center">Cidade</th>
                        <th className="text-center">UF</th>
                        <th className="text-center">Data Nasc.</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentClientes.map(cliente => (
                        <tr key={cliente.id}>
                            <td className="align-middle">{cliente.id}</td>
                            <td className="align-middle">{cliente.nome}</td>
                            <td className="align-middle">
                                {cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                            </td>
                            <td className="align-middle">{cliente.email}</td>
                            <td className="align-middle">{cliente.telefone}</td>
                            <td className="align-middle">{cliente.endereco}</td>
                            <td className="align-middle">{cliente.cidade}</td>
                            <td className="align-middle">{cliente.uf}</td>
                            <td className="align-middle">{formatDate(cliente.data_nascimento)}</td>
                            <td className="align-middle">
                                <Button variant="primary" onClick={() => handleShowEdit(cliente)} className="small-font">
                                    Editar
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(cliente.id)} className="ms-2 small-font">
                                    Excluir
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginação e botão adicionar */}
            <div className="d-flex justify-content-between align-items-center">
                <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => (
                        <Pagination.Item key={index} active={currentPage === index + 1} onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                </Pagination>
                <Button variant="success" onClick={handleShowAdd}>
                    Adicionar Cliente
                </Button>
            </div>

            {/* Modal de edição */}
            <Modal show={showEdit} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEdit}>
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

                        <Form.Group controlId="formCPF" className="mt-3">
                            <Form.Label>CPF</Form.Label>
                            <InputMask
                                mask="999.999.999-99"
                                value={formData.cpf}
                                onChange={handleInputChange}
                                disabled
                            >
                                {() => <Form.Control type="text" name="cpf" required />}
                            </InputMask>
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formTelefone" className="mt-3">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEndereco" className="mt-3">
                            <Form.Label>Endereço</Form.Label>
                            <Form.Control
                                type="text"
                                name="endereco"
                                value={formData.endereco}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formCidade" className="mt-3">
                            <Form.Label>Cidade</Form.Label>
                            <Form.Control
                                type="text"
                                name="cidade"
                                value={formData.cidade}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formUf" className="mt-3">
                            <Form.Label>UF</Form.Label>
                            <Form.Control
                                type="text"
                                name="uf"
                                value={formData.uf}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDataNasc" className="mt-3">
                            <Form.Label>Data Nascimento</Form.Label>
                            <Form.Control
                                type="date"
                                name="data_nascimento"
                                value={formData.data_nascimento}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseEdit}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Salvar
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal de adicionar */}
            <Modal show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAdd}>
                        <Form.Group controlId="formNomeAdd">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group controlId="formCPFAdd" className="mt-3">
                            <Form.Label>CPF</Form.Label>
                            <InputMask
                                mask="999.999.999-99"
                                value={formData.cpf}
                                onChange={handleInputChange}
                            >
                                {() => <Form.Control type="text" name="cpf" required />}
                            </InputMask>
                        </Form.Group>

                        <Form.Group controlId="formEmailAdd" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formTelefoneAdd" className="mt-3">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEndercoAdd" className="mt-3">
                            <Form.Label>Endereço</Form.Label>
                            <Form.Control
                                type="text"
                                name="endereco"
                                value={formData.endereco}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCidadeAdd" className="mt-3">
                            <Form.Label>Cidade</Form.Label>
                            <Form.Control
                                type="text"
                                name="cidade"
                                value={formData.cidade}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formUfAdd" className="mt-3">
                            <Form.Label>UF</Form.Label>
                            <Form.Control
                                type="text"
                                name="uf"
                                value={formData.uf}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formDataNascAdd" className="mt-3">
                            <Form.Label>Data de Nascimento</Form.Label>
                            <Form.Control
                                type="date"
                                name="data_nascimento"
                                value={formData.data_nascimento}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseAdd}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Adicionar
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Clientes;
