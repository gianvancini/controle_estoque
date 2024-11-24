// src/pages/login.tsx
import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { login as loginService } from '../services/login/loginService';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/router';

export default function Login() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await loginService(usuario, senha);
            const { token, usuarioTipo } = data;

            login(token, usuarioTipo);
            router.push('/');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100">
                <Col sm={8} md={7} lg={4} className="mx-auto">
                    <div className="shadow p-5 rounded" style={{ backgroundColor: '#f9f9f9' }}>
                        <h1 className="text-center mb-4">Entrar</h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formUsuario">
                                <Form.Label>Usuário</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Digite seu usuário" 
                                    value={usuario} 
                                    onChange={(e) => setUsuario(e.target.value)} 
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="mt-3">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Digite sua senha" 
                                    value={senha} 
                                    onChange={(e) => setSenha(e.target.value)}
                                    required 
                                />
                            </Form.Group>

                            {error && <p className="text-danger">{error}</p>}

                            <Button variant="primary" type="submit" className="w-100 mt-4">
                                Entrar
                            </Button>

                            <div className="mt-3 text-center">
                                <a href="#" style={{ fontSize: '0.75rem', textDecoration: 'none' }}>Esqueceu sua senha?</a>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}