import api from '../../../config/http.js'
export const updateUser = async(user) =>{
try{
    const us = await JSON.parse(localStorage.getItem('user'));
    const response = await api.doPut(`/user/${us.id}`,user)
    return true;
}catch(error){
    return 'ERROR';
}
}