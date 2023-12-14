import api from '../../../config/http.js'
export const getdevices = async () =>{
  try{
    const response = await api.doPost('/device/devices', {})
    return response.data;
  }catch(error){
    return 'ERROR';
  }
  
}