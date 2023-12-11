import api from '../../../config/http.js'

export const updateRequest = async(id,status) =>{
    try{
        const response = await api.doPut(`/request/status/${id}`,status)
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}

export const sanction = async(id,sansion) => {
    try {
        const response = await api.doPut(`/request/sanction/${id}`,sansion);
        return response.data;
    }catch(err) {
        console.log("ERRRROR");
        return 'ERROR'
    }

}