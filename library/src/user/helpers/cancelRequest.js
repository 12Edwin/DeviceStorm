import axios from "axios";

export const cancelRequest = async(id) =>{
    try{
        const user = await JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const url = `http://localhost:3000/api/request/${id}`
        const response = await axios.put(url,{status:'Finished'},{
            headers:{
                'x-token' : token
            }
        })
        console.log(response);
        return response;
    }catch(error){
        return 'ERROR';
    }
}