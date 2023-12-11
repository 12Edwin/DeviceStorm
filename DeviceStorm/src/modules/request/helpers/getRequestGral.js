import api from '../../../config/http.js'

export const getRequestGral = async () =>{
    try{
        const response = await api.doGet('/request/')
        return response.data.requests;
    }catch(err){
        return 'ERROR';
    }
}
