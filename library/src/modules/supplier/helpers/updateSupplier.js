import api from '../../../config/http.js'

export const updateSupplier = async (supplier) =>{
    try{
        const response = await api.doPut(`/supplier/${supplier.id}`, supplier);
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}