import api from '../../../config/http.js'

export const insertdevice = async(device) =>{
    try{
        const response = await api.doPost('/device/', device)
        return response.data.device;
    }catch(err){
        return 'ERROR';
    }
}
