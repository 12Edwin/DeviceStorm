import api from '../../../config/http.js'

export const createRequest = async (request) =>{
    try{
        const user = await JSON.parse(localStorage.getItem('user'));
        const email = await getEmail(user.id);
        return await api.doPost('/request/', {...request, email: email})
    }catch(error){
        return 'ERROR';
    }
}

const getEmail = async (id) =>{
    const response = await api.doGet(`/user/${id}`);
    return response.data.user.email;
}

