import { Navigate, Route, Routes } from "react-router-dom"
import { AccountPage, CretaedevicePage, InventoryPage, RequestPage, UsersPage} from '../pages'

import PageNotFound from "../../auth/pages/PageNotFound"
import { NavBarAdmin } from "../components/navigator/NavBar"

export const AdminRoute = () =>{
    return(
        <>
            
            <Routes>
                <Route path="stock" element={<><NavBarAdmin/><InventoryPage/></>}/>
                <Route path="requests" element={<><NavBarAdmin/><RequestPage/></>}/>
                <Route path="device" element={<><NavBarAdmin/><CretaedevicePage/></>}/>
                <Route path="profile" element={<><NavBarAdmin/><AccountPage/></>}/>
                <Route path="users" element={<><NavBarAdmin/><UsersPage/></>}/>
                <Route path="/" element={<Navigate to={'/admin/stock'}/> }/>
                <Route path="/*" element={<PageNotFound/>} />
            </Routes>
        </>
    )
}