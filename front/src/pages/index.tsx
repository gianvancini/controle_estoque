import { Container } from "react-bootstrap";

export default function Home() {
  return (
    <Container style={{ maxWidth: '60vw' }}>
      <div className="text-center">
        <h1>Bem vindo ao gerenciador de vendas e estoque!</h1>
      </div>
    </Container>
  )
}
