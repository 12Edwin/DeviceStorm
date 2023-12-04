import axios from "axios";
import { getUser } from "../../user/helpers";

export const getRequstByEmail = async () => {
    try {
        const user = await JSON.parse(localStorage.getItem('user'))
        const userResponse = await getUser(user.id);
        const email = userResponse.email;
        const token = user.token;
        console.log("ciclandose")
        const url = `http://localhost:3000/api/request/email/${email}`
        const response = await axios(url, {
            headers: {
                'x-token': token
            }
        });
        console.log(response)
        return response.data;
    } catch (err) {
        return 'ERROR';
    }
}