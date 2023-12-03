import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LoginComponent } from "../components/login/LoginComponent"
import { AuthContext } from "../context/AuthContext"
import { auth } from "../helpers/auth"
import { register } from "../helpers/register"


export default function LoginPage (){

    const {login} = useContext(AuthContext)
    const navigate = useNavigate()

    const onLogin = async (data) =>{
        await auth(data)
        .then(res => {
            data.setErrors(null);
            data.setLoading(false);
            login(res.data)
            if(res.data.user.role == "ADMIN_ROLE")
            navigate('/admin/stock',{replace:true});
            if(res.data.user.role == "USER_ROLE")
            navigate('/user/stock',{replace:true});
        })
        .catch( error =>{
            console.log(error);
            data.setErrors('Username / Password invalid')
            data.setLoading(false);
        })
    }

    const onSignUp = async (data) =>{
        const response = await register(data)
        .then(async(res) =>{
            data.setErrRegister(null);
            const {email, password} = data;
            await auth({email, password}).then(res =>{
                login(res.data);
                data.setSubmitting(false)
                navigate('/user/stock',{replace:true});
            });
        })
        .catch( error =>{
            data.setErrRegister(error.response.data.errors[0].msg || "Ocurrió un error");
            data.setSubmitting(false)

        })
        if(response == 'ERROR'){
            setErrorApi(true)
        }
    }

    return(
        <LoginComponent onData = {onLogin} onRegister = {onSignUp}/>
    )
}