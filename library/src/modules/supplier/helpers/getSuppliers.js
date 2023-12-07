import api from '../../../config/http.js'

export const getSuppliers = async () =>{
    try{
        const response = await api.doGet(`/supplier/`);
        return response.data.suppliers;
    }catch(err){
        return 'ERROR';
    }
}