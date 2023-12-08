import api from '../../../config/http.js'

export const cancelRequest = async(id) =>{
    try{
        return await api.put(`/request/${id}`, {status: 'Finished'});
    }catch(error){
        return 'ERROR';
    }
}