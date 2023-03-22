import axios from "axios";

export const getHistory = async (id) =>{
    try{
    const user = await JSON.parse(localStorage.getItem('user'))
    const token = user.token;
    const email = await getUser(id, token);
    const url = `http://localhost:3000/api/request/email/${email}`;
    const response = await axios(url,{
        headers:{
            'x-token': token
        }
    });
    console.log(response);
    return response.data;
}catch(err){
    return 'ERROR';
}
}


const getUser = async(id, token) =>{
    const url = `http://localhost:3000/api/user/${id}`;
    const response = await axios(url,{
        headers:{
            'x-token': token
        }
    });
    return response.data.user.email
}

export const getRequestGral = async () =>{
    try{
    const user = await JSON.parse(localStorage.getItem('user'))
    const token = user.token;
    const url = `http://localhost:3000/api/request/`;
    const response = await axios(url,{
        headers:{
            'x-token': token
        }
    });
    return response.data;
}catch(err){
    return 'ERROR';
}
}