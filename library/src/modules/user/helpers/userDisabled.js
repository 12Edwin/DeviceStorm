import api from '../../../config/http.js'

export const userDisabled = async(id) =>{
    try{
        const response = await api.doDelete(`/user/${id}`)
        return response.data;
    }catch(err){
        return 'ERROR';
    }
} 