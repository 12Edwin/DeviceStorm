import api from '../../../config/http.js'
export const getdevices = async () =>{
  try{
    const response = await api.doPost('/device/devices', {})
    return response.data;
  }catch(err){
    let text = 'Ocurrió un error al obtener los dispositivos'
    const error = err.response.data.errors ? err.response.data.errors[0].msg.toLowerCase() : null
    switch (error || err.response.data.msg.toLowerCase() || ''){
      case 'busy device':
        text = 'Este dispositivo está ocupado'
        break
      case 'already exists':
        text = 'Este dispositivo ya está registrado'
        break
      case 'not found':
        text = 'Dispositivo no encontrado'
        break
      case 'invalid id':
        text = 'La petición no se hizo correctamente'
        break
      case 'capacity is so little':
        text = 'El total de unidades no puede ser mayor a la capacidad del almacen seleccionado'
    }
    return text;
  }
  
}