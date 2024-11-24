import { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Table } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import vendaService from "@/services/vendas/novaVendaService";
import { fetchEstoque } from "@/services/estoqueService";
import { fetchClientes } from "@/services/cadastros/clienteService";
import { fetchVendedores } from "@/services/cadastros/vendedorService";
import CustomToast from "../components/CustomToast";

const NovaVenda = () => {
  const [data_venda, setDataVenda] = useState(new Date().toISOString().split('T')[0]);
  const [desconto, setDesconto] = useState("");
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [vendedorSelecionado, setVendedorSelecionado] = useState(null);
  const [showModalItem, setShowModalItem] = useState(false);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [showModalVendedor, setShowModalVendedor] = useState(false);
  const [buscaProduto, setBuscaProduto] = useState(""); 
  const [buscaCliente, setBuscaCliente] = useState("");
  const [buscaVendedor, setBuscaVendedor] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const estoqueData = await fetchEstoque();
        setEstoque(estoqueData);
        const clientesData = await fetchClientes();
        setClientes(clientesData);
        const vendedoresData = await fetchVendedores();
        const vendedoresAtivos = vendedoresData.filter(vendedor => vendedor.ativo === true);
        setVendedores(vendedoresAtivos);
      } catch (error) {
        console.error("Erro ao carregar informações para a venda:", error);
      }
    };
    fetchData();
  }, []);

  const handleAdicionarItem = (produto_estoque) => {
    const novoItem = {
      ...produto_estoque,
      quantidade: 1,
    };
    setItensSelecionados((prev) => [...prev, novoItem]);
    setShowModalItem(false);
  };

  const handleRemoverItem = (index) => {
    const updatedItens = itensSelecionados.filter((_, i) => i !== index);
    setItensSelecionados(updatedItens);
  };

  const calcularTotalVenda = () => {
    return itensSelecionados.reduce((total, item) => total + item.produto.preco_venda * item.quantidade - desconto, 0);
  };

  const limparFormulario = () => {
    setDataVenda(new Date().toISOString().split('T')[0]);
    setDesconto("")
    setClienteSelecionado(null);
    setVendedorSelecionado(null);
    setItensSelecionados([]);
  };

  const handleSalvarVenda = async () => {
    if (itensSelecionados.length === 0 ) {
      setErrorMessage("É necessário adicionar pelo menos um item à venda.");
      return;
    }

    if (!clienteSelecionado) {
      setErrorMessage("É necessário adicionar um cliente na venda.");
      return;
    }

    if (!vendedorSelecionado) {
      setErrorMessage("É necessário adicionar um vendedor na venda.");
      return;
    }

    const total_venda = calcularTotalVenda();
    const vendaData = {
      data_venda,
      clienteSelecionado,
      vendedorSelecionado,
      total_venda,
      desconto,
      itensVenda: itensSelecionados.map(item => ({
        estoque: item.id,
        quantidade: item.quantidade,
        preco_venda: item.produto.preco_venda,
      })),
    };

    try {
      await vendaService.postVenda(vendaData);
      limparFormulario();
      setShowToast(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Erro ao salvar a venda", error);
    }
  };

  const produtosFiltrados = estoque.filter((produto) =>
    `${produto.produto.marca} ${produto.produto.modelo} ${produto.produto.capacidade} ${produto.produto.cor} ${produto.produto.estado}`
      .toLowerCase()
      .includes(buscaProduto.toLowerCase()) &&
      !itensSelecionados.some((item) => item.id === produto.id)
  );

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(buscaCliente.toLowerCase())
  );

  const vendedoresFiltrados = vendedores.filter(vendedor =>
    vendedor.nome.toLowerCase().includes(buscaVendedor.toLowerCase())
  );

  return (
    <div>
      <h4 className="text-center mb-3">Nova Venda</h4>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <CustomToast
        show={showToast}
        message="Venda adicionada com sucesso!"
        onClose={() => setShowToast(false)}
        bg="success"
      />

      <Form>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Data da Venda</Form.Label>
              <Form.Control type="date" value={data_venda} onChange={(e) => setDataVenda(e.target.value)} />
            </Form.Group>
          </Col>
          <Col>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar Cliente"
                value={clienteSelecionado ? clienteSelecionado.nome : ""}
                onClick={() => setShowModalCliente(true)}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Vendedor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar Vendedor"
                value={vendedorSelecionado ? vendedorSelecionado.nome : ""}
                onClick={() => setShowModalVendedor(true)}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Total da Venda</Form.Label>
              <Form.Control type="text" value={calcularTotalVenda().toFixed(2)} readOnly />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Desconto</Form.Label>
              <Form.Control type="number" value={desconto} onChange={(e) => setDesconto(e.target.value)}/>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <h5 className="mt-4">Itens da Venda</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Produto</th>
            <th style={{ width: "100px" }}>Quantidade</th>
            <th>Preço de Venda</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {itensSelecionados.map((item, index) => (
            <tr key={index}>
              <td>{item.produto.marca} - {item.produto.modelo} - {item.produto.capacidade} - {item.cor} - {item.produto.estado}</td>
              <td>
                <Form.Control
                  type="number"
                  value={item.quantidade}
                  onChange={(e) => {
                    const updatedItens = [...itensSelecionados];
                    const novaQuantidade = Number(e.target.value);

                    if (novaQuantidade >= 1 && novaQuantidade <= item.quantidade_disponivel) {
                      updatedItens[index].quantidade = novaQuantidade;
                      setItensSelecionados(updatedItens);
                    } else if (novaQuantidade < 1) {
                      updatedItens[index].quantidade = 1;
                      setItensSelecionados(updatedItens);
                    } else {
                      updatedItens[index].quantidade = item.quantidade_disponivel;
                      setItensSelecionados(updatedItens);
                    }
                  }}
                  min={1}
                  max={item.quantidade_disponivel}
                  style={{ width: "80px" }}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={item.produto.preco_venda}
                  style={{ width: "100px" }}
                />
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleRemoverItem(index)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button
        variant="primary"
        onClick={() => setShowModalItem(true)}
        className="me-4"
      >
        Adicionar Produto
      </Button>

      <Button
        variant="success"
        onClick={handleSalvarVenda}
        className="me-4"
      >
        Salvar Venda
      </Button>

      <Modal
        show={showModalCliente}
        onHide={() => setShowModalCliente(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Selecione um Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Buscar Cliente"
            value={buscaCliente}
            onChange={(e) => setBuscaCliente(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Endereço</th>
                <th>Telefone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.cpf}</td>
                  <td>{cliente.endereco} - {cliente.numero} - {cliente.cidade}</td>
                  <td>{cliente.telefone}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setClienteSelecionado(cliente);
                        setShowModalCliente(false);
                      }}
                    >
                      Selecionar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={showModalItem} onHide={() => setShowModalItem(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              value={buscaProduto}
              onChange={(e) => setBuscaProduto(e.target.value)}
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
                  <td>{produto.produto.marca} - {produto.produto.modelo} - {produto.produto.capacidade} - {produto.cor} - {produto.produto.estado} - {produto.n_serie}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => handleAdicionarItem(produto)}
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
          <Button variant="secondary" onClick={() => setShowModalItem(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModalVendedor}
        onHide={() => setShowModalVendedor(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Selecione um Vendedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Buscar Vendedor"
            value={buscaVendedor}
            onChange={(e) => setBuscaVendedor(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendedoresFiltrados.map((vendedor) => (
                <tr key={vendedor.id}>
                  <td>{vendedor.nome}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setVendedorSelecionado(vendedor);
                        setShowModalVendedor(false);
                      }}
                    >
                      Selecionar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NovaVenda;