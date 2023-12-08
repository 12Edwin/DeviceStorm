import api from '../../../config/http.js'

export const changeStatusSupplier = async (id) =>{
    try{
        const response = await api.doDelete(`/supplier/${id}`);
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}