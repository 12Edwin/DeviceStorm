import api from '../../../config/http.js'

export const getSanctions = async () => {
    try{
        const response = await api.doGet('/sanction/');
        return response.data.sanctions;
    }catch(err){
        return 'Ocurrió un error al obtener las sanciones';
    }
};