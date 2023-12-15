import api from '../../../config/http.js'

export const getdeviceDetails = async (id) =>{
    try{
        const response = await api.doGet(`/device/${id}`)
        return response.data.device
    }catch(error){
        return 'ERROR';
    }
}