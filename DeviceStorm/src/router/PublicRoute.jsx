import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/context/AuthContext"


export const PublicRoute = ({children}) =>{

    const {logged, user} = useContext(AuthContext);

    return(!logged) ?
    children :
    (logged && (user.role === 'USER_ROLE')) ?
    <Navigate to={'/user/stock'} /> :
    <Navigate to={'/admin/users'} />
}