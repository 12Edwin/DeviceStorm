import axios from "axios";

export const updateUser = async(user) =>{
try{
    const us = await JSON.parse(localStorage.getItem('user'));
    const token = us.token;
    const url = `http://localhost:3000/api/user/${us.id}`;
    const response = await axios.put(url,user,{
        headers:{
            'x-token':token
        }
        
    })
    console.log(response);
    return true;
}catch(error){
    return 'ERROR';
}
}