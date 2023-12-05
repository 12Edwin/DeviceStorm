import axios from "axios";


export const updateRequest = async(id,status) =>{
    try{
        const user = await JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const url = `http://localhost:3000/api/request/status/${id}`;
        const response = await axios.put(url,status,{
            headers:{
                'x-token' : token
            }
        })
        return response.data;
    }catch(err){
        return 'ERROR';
    }
}

export const sanction = async(id,sansion) => {
    console.log(id);
    try {
        const user = await JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const url = `http://localhost:3000/api/request/sanction/${id}`;
        const response = await axios.put(url,sansion, {
            headers: {
                'x-token': token
            }
        });
        return response.data;
    }catch(err) {
        console.log("ERRRROR");
        return 'ERROR'
    }

}