import axios from 'axios'

export const register = async (form) =>{
        const url = 'http://localhost:3000/api/user/';
        const response = await axios.post(url,{
            name: form.name,
            surname: form.surname,
            lastname: form.lastname,
            career: form.career,
            role: 'USER_ROLE',
            status: true,
            email: form.email,
            password: form.password
        })
        return response;
} 