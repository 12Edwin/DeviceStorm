import axios from "axios";


export const userDisabled = async(id) =>{
    try{
        const user = await JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const url = `http://localhost:3000/api/user/${id}`;
        const response = await axios.delete(url,{
            headers:{
                'x-token' : token
            }
        })
        return response.data;
    }catch(err){
        return 'ERROR';
    }
} 