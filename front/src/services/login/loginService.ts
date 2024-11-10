import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

export const login = async (usuario: string, senha: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { usuario, senha });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data);
        } else {
            throw new Error('Erro ao fazer login. Verifique suas credenciais.');
        }
    }
};