import api from '../../../config/http.js'

export const createPlace = async (place) =>{
    try{
        const response = await api.doPost(`/place/`, place);
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}