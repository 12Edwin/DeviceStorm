import api from '../../../config/http.js'

export const updateCategory = async (category) =>{
    try{
        const response = await api.doPut(`/category/${category.id}`, category);
        return response.data;
    }catch(err){
        let text = 'Ocurrió un error en la actualización de la categoría'
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