import api from '../../../config/http.js'

export const changeStatusPlace = async (id) =>{
    try{
        const response = await api.doDelete(`/place/${id}`);
        return response.data;
    }catch(err){
        let text = 'Ocurrió un error en el cambio de estado del alamacen'
        const error = err.response.data.errors ? err.response.data.errors[0].msg.toLowerCase() : null
        switch (error || err.response.data.msg.toLowerCase() || ''){
            case 'this has devices':
                text = 'Este almacen está siendo usado'
                break
            case 'already exists':
                text = 'Este almacen ya está registrado'
                break
            case 'not found':
                text = 'Almacen no encontrado'
                break
            case 'invalid id':
                text = 'La petición no se hizo correctamente'
                break
        }
        return text;
    }
}