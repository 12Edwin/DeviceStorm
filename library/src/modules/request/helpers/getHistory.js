import api from '../../../config/http.js'
export const getHistory = async (id) =>{
    try{
    const email = await getUser(id);
    const response = await api.doGet(`/request/email/${email}`);
    return response.data;
}catch(err){
    return 'ERROR';
}
}


const getUser = async(id, token) =>{
    const response = await api.doGet(`/user/${id}`);
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