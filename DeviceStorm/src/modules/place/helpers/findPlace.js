import api from '../../../config/http.js'

export const findPlace = async (id) =>{
    try{
        const response = await api.doGet(`/place/${id}`);
        return response.data.place;
    }catch(err){
        return 'Ocurrió un error al obtener el almacen';
    }
}