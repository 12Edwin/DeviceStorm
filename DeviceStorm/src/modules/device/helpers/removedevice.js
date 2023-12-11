import api from '../../../config/http.js'

export const removedevice = async(id) =>{
    try{
        return await api.doDelete(`/device/${id}`);
    }catch(err){
        return 'ERROR';
    }
}