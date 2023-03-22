import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../auth/context/AuthContext"


export const PrivateRouteUser = ({children}) =>{
    const {logged, user} = useContext(AuthContext)

    return(logged && (user.role == 'USER_ROLE')) ?
    children : 
    (logged && (user.role == 'ADMIN_ROLE')) ?
    <Navigate to={'/admin/stock'} /> :
    <Navigate to={'/login'}/>
}