import api from '../../../config/http.js'

export const getCategories = async () =>{
    try{
        const response = await api.doGet('/category/');
        return response.data.category;
    }catch(err){
        return 'Ocurrió un error al obtener las categorías';
    }
}