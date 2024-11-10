import { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Table } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import compraService from "@/services/compras/novaCompraService";
import { fetchProdutos } from "@/services/cadastros/produtoService";
import CustomToast from "../components/CustomToast";

const NovaCompra = () => {
  const [data_compra, setDataCompra] = useState(new Date().toISOString().split('T')[0]);
  const [n_nota, setNumeroNota] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [busca, setBusca] = useState(""); 
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produtosData = await fetchProdutos();
        setProdutos(produtosData);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };
    fetchData();
  }, []);

  const handleAdicionarProduto = (produto) => {
    const novoProduto = {
      ...produto,
      n_serie: "",
      quantidade: 1,
      preco_custo: 0,
      cor: "",
    };
    setProdutosSelecionados((prev) => [...prev, novoProduto]);
    setShowModal(false);
  };

  const handleRemoverProduto = (index) => {
    const updatedProdutos = produtosSelecionados.filter((_, i) => i !== index);
    setProdutosSelecionados(updatedProdutos);
  };

  const calcularTotalCompra = () => {
    return produtosSelecionados.reduce((total, produto) => total + produto.preco_custo * produto.quantidade, 0);
  };

  const limparFormulario = () => {
    setDataCompra(new Date().toISOString().split('T')[0]);
    setNumeroNota("");
    setFornecedor("");
    setProdutosSelecionados([]);
  }

  const handleSalvarCompra = async () => {
    if (produtosSelecionados.length === 0) {
      setErrorMessage("É necessário adicionar pelo menos um item à compra.");
      return;
    }

    const total_compra = calcularTotalCompra();
    const compraData = {
      data_compra,
      n_nota,
      fornecedor,
      total_compra,
      itensCompra: produtosSelecionados.map(produto => ({
        produto: produto.id,
        n_serie: produto.n_serie,
        quantidade: produto.quantidade,
        preco_custo: produto.preco_custo,
        cor: produto.cor,
      })),
    };

    try {
      await compraService.postCompra(compraData);
      limparFormulario();
      setShowToast(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Erro ao salvar a compra", error);
    }
  };

  const produtosFiltrados = produtos.filter((produto) =>
    `${produto.marca} ${produto.modelo} ${produto.capacidade} ${produto.cor} ${produto.estado}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  return (
    <div>
      <h4 className="text-center mb-3">Nova Compra</h4>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <CustomToast
        show={showToast}
        message="Compra adicionada com sucesso!"
        onClose={() => setShowToast(false)}
        bg="success"
      />

      <Form>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Data da Compra</Form.Label>
              <Form.Control type="date" value={data_compra} onChange={(e) => setDataCompra(e.target.value)} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Número da Nota</Form.Label>
              <Form.Control type="text" value={n_nota} onChange={(e) => setNumeroNota(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Fornecedor</Form.Label>
              <Form.Control type="text" value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Total da Compra</Form.Label>
              <Form.Control type="text" value={calcularTotalCompra().toFixed(2)} readOnly />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <h5 className="mt-4">Itens da Compra</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Cor</th>
            <th>Número de Série</th>
            <th style={{ width: "100px" }}>Quantidade</th>
            <th>Preço de Custo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosSelecionados.map((produto, index) => (
            <tr key={index}>
              <td>{produto.marca} - {produto.modelo} - {produto.capacidade} - {produto.estado}</td>
              <td>
                <Form.Control
                  type="text"
                  value={produto.cor}
                  onChange={(e) => {
                    const updatedProdutos = [...produtosSelecionados];
                    updatedProdutos[index].cor = e.target.value;
                    setProdutosSelecionados(updatedProdutos);
                  }}
                  style={{ width: "150px" }}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={produto.n_serie}
                  onChange={(e) => {
                    const updatedProdutos = [...produtosSelecionados];
                    updatedProdutos[index].n_serie = e.target.value;
                    setProdutosSelecionados(updatedProdutos);
                  }}
                  style={{ width: "150px" }}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={produto.quantidade}
                  onChange={(e) => {
                    const updatedProdutos = [...produtosSelecionados];
                    updatedProdutos[index].quantidade = Number(e.target.value);
                    setProdutosSelecionados(updatedProdutos);
                  }}
                  style={{ width: "80px" }}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={produto.preco_custo}
                  onChange={(e) => {
                    const updatedProdutos = [...produtosSelecionados];
                    updatedProdutos[index].preco_custo = Number(e.target.value);
                    setProdutosSelecionados(updatedProdutos);
                  }}
                  style={{ width: "100px" }}
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => handleRemoverProduto(index)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={() => setShowModal(true)} className="me-4">Adicionar Produto</Button>
      <Button variant="success" onClick={handleSalvarCompra} className="me-4">Salvar Compra</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite o nome do produto"
              className="mb-4"
            />
          </Form.Group>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.slice(0, 6).map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.marca} - {produto.modelo} - {produto.capacidade} - {produto.estado}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => handleAdicionarProduto(produto)}
                    >
                      Adicionar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NovaCompra;
