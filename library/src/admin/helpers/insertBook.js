import axios from "axios";


export const insertBook = async(book) =>{
    try{
        console.log(book);
        const user = await JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const url = 'http://localhost:3000/api/book/'
        const response = await axios.post(url,book,{
            headers:{
                'x-token' : token
            }
        })
        return response.data.book.uid;
    }catch(err){
        return 'ERROR';
    }
}
