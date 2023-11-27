import axios from "axios";


export const insertdevice = async(device) =>{
    try{
        console.log(device);
        const user = await JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const url = 'http://localhost:3000/api/device/'
        const response = await axios.post(url,device,{
            headers:{
                'x-token' : token
            }
        })
        return response.data.device.uid;
    }catch(err){
        return 'ERROR';
    }
}
