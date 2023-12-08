import axios from "axios";

export const sendRecoveryPasswordEmail = async(email) =>{
    const url = "http://localhost:3000/api/user/recovery-password";
    const response = await axios.post(url,{
        email: email
    })
    return response;
} 