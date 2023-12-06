import api from '../../../config/http.js'

export const updatePlace = async (place) =>{
    try{
        const response = await api.doPut(`/place/${place.id}`, place);
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}