import api from '../../../config/http.js'

export const getdeviceDetails = async (id) =>{
    try{
        return await api.doGet('/device/')
    }catch(error){
        return 'ERROR';
    }
}