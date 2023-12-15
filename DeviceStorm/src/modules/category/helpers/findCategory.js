import api from '../../../config/http.js'

export const findCategory = async (id) =>{
    try{
        const response = await api.doGet(`/category/${id}`);
        return response.data.category;
    }catch(err){
        return 'Ocurrió un error al obtener la categoría';
    }
}