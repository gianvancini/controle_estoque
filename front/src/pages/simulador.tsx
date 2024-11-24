import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col, InputGroup } from "react-bootstrap";
import CustomToast from "./components/CustomToast";
import { fetchTaxas, editTaxa, addTaxa, deleteTaxa } from "../services/taxaService";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";

const Taxas = () => {
  const [taxas, setTaxas] = useState([]);
  const [filteredTaxas1to10, setFilteredTaxas1to10] = useState([]);
  const [filteredTaxas11to20, setFilteredTaxas11to20] = useState([]);
  const [selectedTaxaId, setSelectedTaxaId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [currentTaxa, setCurrentTaxa] = useState(null);
  const [formData, setFormData] = useState({
    vezes: "",
    percentual: "",
  });
  const [valorEntrada, setValorEntrada] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showAddToast, setShowAddToast] = useState(false);
  const [showEditToast, setShowEditToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const taxasData = await fetchTaxas();
      setTaxas(taxasData);
      updateFilteredTaxas(taxasData, valorEntrada);
    };
    fetchData();
  }, []);

  const updateFilteredTaxas = (taxasData, valor) => {
    const sortedTaxas1to10 = taxasData
      .filter((t) => t.vezes >= 1 && t.vezes <= 10)
      .sort((a, b) => a.vezes - b.vezes)
      .map((t) => ({
        ...t,
        simulacao: calculateSimulation(valor, t.percentual, t.vezes),
      }));
  
    const sortedTaxas11to20 = taxasData
      .filter((t) => t.vezes >= 11 && t.vezes <= 20)
      .sort((a, b) => a.vezes - b.vezes)
      .map((t) => ({
        ...t,
        simulacao: calculateSimulation(valor, t.percentual, t.vezes),
      }));
  
    setFilteredTaxas1to10(sortedTaxas1to10);
    setFilteredTaxas11to20(sortedTaxas11to20);
  };

  const calculateSimulation = (valor, percentual, vezes) => {
    return ((valor * (1 + percentual / 100)) / vezes).toFixed(2);
  };

  const handleSimulation = () => {
    updateFilteredTaxas(taxas, valorEntrada);
  };

  const handleShowEdit = () => {
    const selectedTaxa = taxas.find((t) => t.id === selectedTaxaId);
    if (selectedTaxa) {
      setCurrentTaxa(selectedTaxa);
      setFormData({ vezes: selectedTaxa.vezes, percentual: selectedTaxa.percentual });
      setShowEdit(true);
    }
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setCurrentTaxa(null);
  };

  const handleShowAdd = () => {
    setFormData({
      vezes: "",
      percentual: "",
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

  const handleValorEntradaChange = (e) => {
    setValorEntrada(e.target.value);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await editTaxa(currentTaxa.id, formData);
      const taxasData = await fetchTaxas();
      setTaxas(taxasData);
      updateFilteredTaxas(taxasData, valorEntrada);
      handleCloseEdit();
      setShowEditToast(true);
    } catch (error) {
      console.error("Erro ao editar taxa", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addTaxa(formData);
      const taxasData = await fetchTaxas();
      setTaxas(taxasData);
      updateFilteredTaxas(taxasData, valorEntrada);
      handleCloseAdd();
      setShowAddToast(true);
    } catch (error) {
      console.error("Erro ao adicionar taxa", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta taxa?")) {
      try {
        await deleteTaxa(selectedTaxaId);
        const taxasData = await fetchTaxas();
        setTaxas(taxasData);
        updateFilteredTaxas(taxasData, valorEntrada);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        console.error("Erro ao excluir taxa", error);
      }
    }
  };

  return (
    <div>
      <h4 className="text-center mb-3">Simulador de Parcelas</h4>

      <CustomToast
        show={showToast}
        message="Taxa excluída com sucesso!"
        onClose={() => setShowToast(false)}
        bg="success"
      />
      <CustomToast
        show={showAddToast}
        message="Taxa adicionada com sucesso!"
        onClose={() => setShowAddToast(false)}
        bg="success"
      />
      <CustomToast
        show={showEditToast}
        message="Taxa editada com sucesso!"
        onClose={() => setShowEditToast(false)}
        bg="success"
      />

      <div className="d-flex align-items-center mb-3">
        <InputGroup className="me-3">
          <InputGroup.Text>Valor:</InputGroup.Text>
          <Form.Control
            type="number"
            value={valorEntrada}
            onChange={handleValorEntradaChange}
          />
        </InputGroup>
        <Button variant="primary" onClick={handleSimulation}>
          Simular
        </Button>
        <Button variant="primary" className="ms-3" onClick={handleShowAdd}>
          <FaPlus />
        </Button>
        <Button
          variant="warning"
          className="ms-3"
          onClick={handleShowEdit}
          disabled={!selectedTaxaId}
        >
          <FaEdit />
        </Button>
        <Button
          variant="danger"
          className="ms-2"
          onClick={handleDelete}
          disabled={!selectedTaxaId}
        >
          <FaTrashAlt />
        </Button>
      </div>

      <div className="d-flex justify-content-between">
        {[filteredTaxas1to10, filteredTaxas11to20].map((filteredTaxas, index) => (
          <Table striped bordered hover responsive key={index}>
            <thead>
              <tr>
                <th className="text-center">Selecionar</th>
                <th className="text-center">Vezes</th>
                <th className="text-center">Percentual</th>
                <th className="text-center">Simulação</th>
              </tr>
            </thead>
            <tbody>
              {filteredTaxas.map((taxa) => (
                <tr key={taxa.id}>
                  <td className="text-center">
                    <Form.Check
                      type="radio"
                      name="selectedTaxa"
                      onChange={() => setSelectedTaxaId(taxa.id)}
                      checked={selectedTaxaId === taxa.id}
                    />
                  </td>
                  <td className="align-middle text-center">{taxa.vezes}</td>
                  <td className="align-middle text-center">{taxa.percentual} %</td>
                  <td className="align-middle text-center">
                    {valorEntrada === 0 ? "-" : `${taxa.vezes} x ${taxa.simulacao}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ))}
      </div>

      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Taxa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formVezes">
                  <Form.Label>Vezes</Form.Label>
                  <Form.Control
                    type="number"
                    name="vezes"
                    value={formData.vezes}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formPercentual">
                  <Form.Label>Percentual</Form.Label>
                  <Form.Control
                    type="number"
                    name="percentual"
                    value={formData.percentual}
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
          <Modal.Title>Editar Taxa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formVezes">
                  <Form.Label>Vezes</Form.Label>
                  <Form.Control
                    type="number"
                    name="vezes"
                    value={formData.vezes}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formPercentual">
                  <Form.Label>Percentual</Form.Label>
                  <Form.Control
                    type="number"
                    name="percentual"
                    value={formData.percentual}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-4">
              <Button variant="primary" type="submit">
                Salvar Alterações
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Taxas;