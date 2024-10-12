import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Pagination, Toast, ToastContainer } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import InputMask from "react-input-mask";
import CustomToast from '../pages/components/CustomToast';

const Vendedores = () => {
    const [vendedores, setVendedores] = useState([]);
    const [filteredVendedores, setFilteredVendedores] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [currentVendedor, setCurrentVendedor] = useState(null);
    const [formData, setFormData] = useState({ nome: "", cpf: "", email: "", comissao: "", data_adm: ""});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [vendedoresPerPage] = useState(7);
    const [showToast, setShowToast] = useState(false);
    const [showAddToast, setShowAddToast] = useState(false);
    const [showEditToast, setShowEditToast] = useState(false);

    const url = "http://localhost:3002/api";

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const fetchVendedores = async () => {
        try {
            const response = await axios.get(`${url}/vendedores`);
            setVendedores(response.data);
            setFilteredVendedores(response.data);
        } catch (error) {
            console.error("Erro ao buscar vendedores", error);
        }
    };

    useEffect(() => {
        fetchVendedores();
    }, []);

    const handleShowEdit = (vendedor) => {
        setCurrentVendedor(vendedor);
        setFormData({
            nome: vendedor.nome,
            cpf: vendedor.cpf,
            email: vendedor.email,
            comissao: vendedor.comissao,
            data_adm: new Date(vendedor.data_adm).toISOString().split('T')[0],

        });
        setShowEdit(true);
    };

    const handleShowAdd = () => {
        setFormData({ nome: "", cpf: "", email: "", comissao: "", data_adm: ""});
        setShowAdd(true);
    };

    const handleCloseEdit = () => {
        setShowEdit(false);
        setCurrentVendedor(null);
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
            await axios.put(`${url}/vendedores/${currentVendedor.id}`, formData);
            fetchVendedores();
            handleCloseEdit();
            setShowEditToast(true);
        } catch (error) {
            console.error("Erro ao editar vendedor", error);
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
            await axios.post(`${url}/vendedores`, formData);
            fetchVendedores();
            handleCloseAdd();
            setShowAddToast(true);
            setTimeout(() => setShowAddToast(false), 3000);
        } catch (error) {
            console.error("Erro ao adicionar vendedor", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este vendedor?")) {
            try {
                await axios.delete(`${url}/vendedores/${id}`);
                fetchVendedores();
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } catch (error) {
                console.error("Erro ao excluir vendedor", error);
            }
        }
    };

    const indexOfLastVendedor = currentPage * vendedoresPerPage;
    const indexOfFirstVendedor = indexOfLastVendedor - vendedoresPerPage;
    const currentVendedores = filteredVendedores.slice(indexOfFirstVendedor, indexOfLastVendedor);
    const totalPages = Math.ceil(filteredVendedores.length / vendedoresPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const filtered = vendedores.filter(vendedor => vendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredVendedores(filtered);
        setCurrentPage(1);
    };

    const handleClearFilter = () => {
        setSearchTerm("");
        setFilteredVendedores(vendedores);
        setCurrentPage(1);
    };

    return (
        <div>
            <h4 className="text-center mb-3">Vendedores</h4>

            {/* Toast de sucesso */}
            <CustomToast show={showToast} message="Vendedor excluído com sucesso!" onClose={() => setShowToast(false)} bg="success" />
            <CustomToast show={showAddToast} message="Vendedor adicionado com sucesso!" onClose={() => setShowAddToast(false)} bg="success" />
            <CustomToast show={showEditToast} message="Vendedor editado com sucesso!" onClose={() => setShowEditToast(false)} bg="success" />

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
                        <th className="text-center">Data Admissão</th>
                        <th className="text-center">Comissão</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentVendedores.map(vendedor => (
                        <tr key={vendedor.id}>
                            <td className="align-middle">{vendedor.id}</td>
                            <td className="align-middle">{vendedor.nome}</td>
                            <td className="align-middle">
                                {vendedor.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                            </td>
                            <td className="align-middle">{vendedor.email}</td>
                            <td className="align-middle">{formatDate(vendedor.data_adm)}</td>
                            <td className="align-middle">{vendedor.comissao}</td>
                            <td className="align-middle">
                                <Button variant="primary" onClick={() => handleShowEdit(vendedor)} className="small-font">
                                    Editar
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(vendedor.id)} className="ms-2 small-font">
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
                    Adicionar Vendedor
                </Button>
            </div>

            {/* Modal de edição */}
            <Modal show={showEdit} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Vendedor</Modal.Title>
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

                        <Form.Group controlId="formComissao" className="mt-3">
                            <Form.Label>Comissão (%)</Form.Label>
                            <Form.Control
                                type="number"
                                name="comissao"
                                value={formData.comissao}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formDataAdm" className="mt-3">
                            <Form.Label>Data de Admissão</Form.Label>
                            <Form.Control
                                type="date"
                                name="data_adm"
                                value={formData.data_adm}
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
                    <Modal.Title>Adicionar Vendedor</Modal.Title>
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

                        <Form.Group controlId="formComissaoAdd" className="mt-3">
                            <Form.Label>Comissão (%)</Form.Label>
                            <Form.Control
                                type="number"
                                name="comissao"
                                value={formData.comissao}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formDataAdmAdd" className="mt-3">
                            <Form.Label>Data de Admissão</Form.Label>
                            <Form.Control
                                type="date"
                                name="data_adm"
                                value={formData.data_adm}
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

export default Vendedores;
