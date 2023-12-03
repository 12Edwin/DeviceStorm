import axios from "axios";

export const getdevices = async () =>{
  try{
    const user = await JSON.parse(localStorage.getItem('user'));
    const token = user.token;
    const url = 'http://localhost:3000/api/device/';
    const response = await axios.get(url,{
      headers:{
        'x-token' : token
      }
    })
    return response.data;
  }catch(error){
    return 'ERROR';
  }
  
}