import api from '../../../config/http.js'

export const getUser = async(id) =>{
    try{
        const response = await api.doGet(`/user/${id}`,);
        return response.data.user;
    }catch(error){
        return 'ERROR'
    }
    
} 