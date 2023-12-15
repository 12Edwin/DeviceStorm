import api from "../../../config/http";

export const sendRecoveryPasswordEmail = async(email) =>{
    try{
        const response = await api.doPost('/auth/recovery-password/', {email});
        return response
    }catch{
        return 'CORREO INVÁLIDO';
    }
} 
