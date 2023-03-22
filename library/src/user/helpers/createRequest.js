import axios from "axios";


export const createRequest = async (request) =>{
    try{
        const user = await JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const email = await getEmail(user.id, token);
        const url = 'http://localhost:3000/api/request/'
        const response = await axios.post(url,{...request, email:email},{
            headers:{
                'x-token' : token
            }
        });
        return response
    }catch(error){
        console.log(error);
        return 'ERROR';
    }
}

const getEmail = async (id, token) =>{
    const url = `http://localhost:3000/api/user/${id}`;
    const response = await axios.get(url,{
        headers:{
            'x-token' : token
        }
    });
    return response.data.user.email;
}

