import axios from '../login/axiosConfig'

export interface Usuario {
    id?: number;
    email: string;
    usuario: string;
    tipo: string;
    senha: string;
}

const url = "usuarios";

export const fetchUsuarios = async (): Promise<Usuario[]> => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuarios", error);
        throw error;
    }
};

export const editUsuario = async (id: number, formData: Usuario): Promise<void> => {
    try {
        await axios.put(`${url}/${id}`, formData);
    } catch (error) {
        console.error("Erro ao editar usuario", error);
        throw error;
    }
};

export const addUsuario = async (formData: Usuario): Promise<void> => {
    try {
        await axios.post(url, formData);
    } catch (error) {
        console.error("Erro ao adicionar usuario", error);
        throw error;
    }
};

export const deleteUsuario = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${url}/${id}`);
    } catch (error) {
        console.error("Erro ao excluir usuario", error);
        throw error;
    }
};