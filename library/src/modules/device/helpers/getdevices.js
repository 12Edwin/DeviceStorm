import api from '../../../config/http.js'
export const getdevices = async () =>{
  try{
    const response = await api.doGet('/device/')
    return response.data;
  }catch(error){
    return 'ERROR';
  }
  
}