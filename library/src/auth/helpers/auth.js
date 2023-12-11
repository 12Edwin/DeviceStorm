import api from "../../config/http.js";

export const auth = async (form) =>{
    try{
        return await api.doPost('/auth/login/', {...form});
    }catch{
        return 'CREDENCIALES INVÁLIDAS';
    }
} 