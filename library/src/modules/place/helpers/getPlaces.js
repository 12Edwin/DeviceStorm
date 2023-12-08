import api from '../../../config/http.js'

export const getPlaces = async () =>{
    try{
        const response = await api.doGet(`/place/`);
        return response.data.places;
    }catch(err){
        return 'Ocurrió un error al obtener los alamacenes';
    }
}