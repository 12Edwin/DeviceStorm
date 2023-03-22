import axios from "axios";
import { useContext } from "react";
import { json } from "react-router-dom";
import { AuthContext } from "../../auth/context/AuthContext";


const user = JSON.parse (localStorage.getItem('user'));

export const getUser = async(id) =>{
    try{
        const token = await user.token;
        const url = `http://localhost:3000/api/user/${id}`;
        const response = await axios.get(url,{
            headers:{
                'x-token': token
            }
        });
        
        return response.data.user;
    }catch(error){
        return 'ERROR'
    }
    
} 