import api from '../../../config/http.js'

export const updateCategory = async (category) =>{
    try{
        const response = await api.doPut(`/category/${category.id}`, category);
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}