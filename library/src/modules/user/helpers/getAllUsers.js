import {api} from "../../../config/http.js";

export const getAllUsers = async() =>{
    try{
        const response = await api.doGet('/user/');
        return response.data.users;
    }catch(error){
        return 'ERROR'
    }
    
} 