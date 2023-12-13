import api from '../../../config/http.js'

export const updatedevice = async(id,device) =>{
    try{
        const response = await api.doPut(`/device/${id}`, device)
        return response.data.device;
    }catch(err){
        return 'ERROR';
    }
}