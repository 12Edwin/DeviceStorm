import api from '../../../config/http.js'

export const changeStatusCategory = async (id, status) =>{
    try{
        const response = await api.doDelete(`/category/${id}/${status}`);
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}