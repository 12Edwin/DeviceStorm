import api from '../../../config/http.js';

export const changeStatusSanction = async (id) => {
    try {
        if (!id) {
            throw new Error('ID no válido');
        }
        const response = await api.doPut(`/sanction/${id}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Error al cambiar el estado: ${response.statusText}`);
        }
    } catch (err) {
        let text = 'Ocurrió un error en el cambio de estado de la sanción';
        console.error(err);
        throw new Error(text);
    }
};
