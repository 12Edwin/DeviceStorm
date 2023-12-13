import api from '../../../config/http.js';

export const createSanction = async (idUser, emailUser, description, returns) => {
    try {
        //console.log("Datos de la sanción que se enviarán:", { idUser, emailUser, description, returns });
        return await api.doPost('/sanction/', { idUser, emailUser, description, returns }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return 'ERROR';
    }
};