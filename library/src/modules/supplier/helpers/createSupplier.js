import api from '../../../config/http.js'

export const createSupplier = async (supplier) =>{
    try{
        const response = await api.doPost(`/supplier/`, supplier);
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}