import api from '../../../config/http.js';

export const createSanction = async (emailUser, description, returns,idRequest) => {
    try {
        console.log("Datos de la sanción que se enviarán:", {emailUser, description, returns, idRequest });
        return await api.doPost('/sanction/', { emailUser, description, returns, idRequest }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return 'ERROR';
    }
};