import axios from 'axios'
const url = import.meta.env.VITE_SECRET

export const auth = async (form) =>{
    try{
        const response = await axios.post(url + '/auth/login/',form);
        return response;
    }catch{
        return 'CREDENCIALES INVÁLIDAS';
    }
} 