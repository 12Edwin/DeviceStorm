import axios from "axios";


const user = JSON.parse(localStorage.getItem('user'))
export const getBookDetails = async (id) =>{
    try{
        const token = user.token;
        const url = 'http://localhost:3000/api/book/'
        const response = await axios.get(url,{
            headers:{
                'x-token' : token
            }
        });
        console.log(response);
        
    }catch(error){
        return 'ERROR';
    }
}