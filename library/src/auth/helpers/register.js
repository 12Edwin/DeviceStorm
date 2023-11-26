import axios from 'axios'

export const register = async (form) =>{
        const url = 'http://localhost:3000/api/user/';
        console.log("Form =>", form);
        const response = await axios.post(url,{
            name: form.name,
            surname: form.surname,
            career: form.lastname,
            role: 'USER_ROLE',
            status: true,
            email: form.email,
            password: form.password
        })
        
        return response;
} 