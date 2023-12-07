import api from '../../../config/http.js'

export const createCategory = async (category) =>{
    try{
        const response = await api.doPost(`/category/`, category);
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}