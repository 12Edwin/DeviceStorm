import api from '../../../config/http.js'

export const updatePlace = async (place) =>{
    try{
        const response = await api.doPut(`/place/${place.id}`, place);
        return response.data;
    }catch(err){
        let text = 'Ocurrió un error en al actualizar el alamacen'
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
            case 'capacity is so little':
                text = 'La capacidad no puede ser menor a los dispositivos que ya están registrados en este almacen'
        }
        return text;
    }
}