import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export default function Login() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col sm={8} md={7} lg={4} className="mx-auto">
          <div className="shadow p-5 rounded" style={{ backgroundColor: '#f9f9f9' }}>
            <h1 className="text-center mb-4">Entrar</h1>
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Digite seu email" />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="Digite sua senha" />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Entrar
              </Button>

              <div className="mt-3 text-center">
                  <a href="#" style={{ fontSize: '0.75rem', textDecoration: 'none' }}>Esqueceu sua senha?</a>
              </div>


              {/* <hr className="my-4" />
              
              <Button variant="outline-danger" className="w-100">
                Entrar com Google
              </Button> */}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
