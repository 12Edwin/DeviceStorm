import api from '../../../config/http.js'

export const insertImage = async(id,img) =>{
    try{
        const formData = new FormData();
        formData.append('image', img);
        return await api.doPut(`device/image/${id}`, formData);
    }catch(err){
        return 'ERROR';
    }
}