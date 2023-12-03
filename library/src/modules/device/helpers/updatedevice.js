import axios from "axios";


export const updatedevice = async(id,device) =>{
    try{
        const user = await JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const url = `http://localhost:3000/api/device/${id}`;
        const response = await axios.put(url,device,{
            headers:{
                'x-token' : token
            }
        })
        return response.data.device;
    }catch(err){
        return 'ERROR';
    }
}