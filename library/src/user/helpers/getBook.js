import axios from "axios";


export const getBook = async (id) =>{
  try{
    const user = await JSON.parse(localStorage.getItem('user'));
    const token = user.token;
    const url = `http://localhost:3000/api/book/${id}`;
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