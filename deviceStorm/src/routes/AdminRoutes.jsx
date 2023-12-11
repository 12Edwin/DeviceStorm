import { Navigate, Route, Routes } from "react-router-dom"
import { ProfilePage, UsersPage} from '../modules/user/view'
import { CretaedevicePage, InventoryPage} from '../modules/device/view'
import { RequestPage} from '../modules/request/view'

import PageNotFound from "../auth/pages/PageNotFound"
import { NavBar } from "../public/component/NavBar"
import {CategoryPage} from "../modules/category/view/CategoryPage.jsx";
import {PlacePage} from "../modules/place/view/PlacePage.jsx";
import {SupplierPage} from "../modules/supplier/view/SupplierPage.jsx";

export const AdminRoute = () =>{
    return(
        <>
            
            <Routes>
                <Route path="stock" element={<><NavBar /><InventoryPage/></>}/>
                <Route path="requests" element={<><NavBar /><RequestPage/></>}/>
                <Route path="device" element={<><NavBar /><CretaedevicePage/></>}/>
                <Route path="category" element={<><NavBar/><CategoryPage/></>}/>
                <Route path="place" element={<><NavBar/><PlacePage/></>}/>
                <Route path="supplier" element={<><NavBar/><SupplierPage/></>}/>
                <Route path="profile" element={<><NavBar /><ProfilePage/></>}/>
                <Route path="users" element={<><NavBar /><UsersPage/></>}/>
                <Route path="/" element={<Navigate to={'/admin/stock'}/> }/>
                <Route path="/*" element={<PageNotFound/>} />
            </Routes>
        </>
    )
}