import api from '../../../config/http.js'

export const changeStatusSupplier = async (id) =>{
    try{
        const response = await api.doDelete(`/supplier/${id}`);
        return response.data;
    }catch(err){
        let text = 'Ocurrió un error al cambiar el estado del proveedor'
        const error = err.response.data.errors ? err.response.data.errors[0].msg.toLowerCase() : null
        switch (error || err.response.data.msg.toLowerCase() || ''){
            case 'this has devices':
                text = 'Este proveedor está siendo usado'
                break
            case 'already exists':
                text = 'Este proveedor ya está registrado'
                break
            case 'not found':
                text = 'Proveedor no encontrado'
                break
            case 'invalid id':
                text = 'La petición no se hizo correctamente'
                break
        }
        return text;
    }
}