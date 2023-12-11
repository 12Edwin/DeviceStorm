import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
    baseURL: import.meta.env.VITE_SECRET,
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {

        const user = localStorage.getItem('user') || '';
        if (user) {
            const token = JSON.parse(user).token
            config.headers['x-token'] =  `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        return response
    },
    async (error) => {
        if (!error.response) {
            const newError = await Swal.fire({
                title: 'El servidor no responde',
                text: 'El servidor no está respondiendo',
                icon: 'error',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then(()=> {
                return {
                    ...error,
                    response:{
                        data:{
                            code: 503,
                            error: true,
                            msg: 'Server no responding'
                        }
                    }
                }
            })
            return Promise.reject(newError);
        }
        if (error.response.status === 401 && error.response.data.msg.toLowerCase() !== 'bad credentials'){
            localStorage.removeItem('user')
            await Swal.fire({
                title: 'Error',
                text: 'Tu sesión ha caducado',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                showCancelButton: false
            }).then(res => {window.location.href = '/login'})
        }
        if (error.response.status === 403){
            return Swal.fire({
                title: 'Error',
                text: 'No tienes acceso a este recurso',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                showCancelButton: false
            }).then(res => Promise.reject(error))
        }
        if (error.response.status === 500){
            return Swal.fire({
                title: 'Error interno en el servidor',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                showCancelButton: false
            }).then(res => Promise.reject(error))
        }
        return Promise.reject(error)
    }
);

export default {
    doGet (endPoint, config){
    return api.get(endPoint,config)
    },
    doPost (endPoint, object, config){
    return api.post(endPoint,object,config)
    },
    doPut (endPoint, object, config){
        return api.put(endPoint,object,config)
    },
    doPatch (endPoint, object, config){
        return api.patch(endPoint,object,config)
    },
    doDelete (endPoint, config){
        return api.delete(endPoint,config)
    }
}