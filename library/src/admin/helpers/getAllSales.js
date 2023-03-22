import axios from "axios";



export const getAllSales = async () =>{
    try{
        const user = await JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const url = 'http://localhost:3000/api/sale';
        const response = await axios.get(url,{
            headers:{
                'x-token' : token
            }
        })
        return response.data.sales;
    }catch(err){
        return 'ERROR';
    }
}