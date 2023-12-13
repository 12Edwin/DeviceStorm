import api from '../../../config/http.js'

export const createCategory = async (category) =>{
    try{
        const response = await api.doPost(`/category/`, category);
        return response.data;
    }catch(err){
        let text = 'Ocurrió un error en la creación de la categoría'
        const error = err.response.data.errors ? err.response.data.errors[0].msg.toLowerCase() : null
        switch (error || err.response.data.msg.toLowerCase() || ''){
            case 'this has devices':
                text = 'Esta categoría está siendo usada'
                break
            case 'already exists':
                text = 'Esta categoría ya está registrada'
                break
            case 'not found':
                text = 'Categoría no encontrada'
                break
            case 'invalid id':
                text = 'La petición no se hizo correctamente'
                break
        }
        return text;
    }
}