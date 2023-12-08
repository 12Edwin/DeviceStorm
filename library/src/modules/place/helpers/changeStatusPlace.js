import api from '../../../config/http.js'

export const changeStatusPlace = async (id) =>{
    try{
        const response = await api.doDelete(`/place/${id}`);
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}