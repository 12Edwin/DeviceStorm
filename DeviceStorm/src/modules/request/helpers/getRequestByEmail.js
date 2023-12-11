import api from '../../../config/http.js'
import {getUser} from "../../user/helpers/index.js";
export const getRequstByEmail = async () => {
    try {
        const user = await JSON.parse(localStorage.getItem('user'))
        const userResponse = await getUser(user.id);
        const email = userResponse.email;
        const response = await api.doGet(`/request/email/${email}`);
        return response.data;
    } catch (err) {
        return 'ERROR';
    }
}