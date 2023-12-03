import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProfilePage } from "../modules/user/view";
import { DetailsPage, DeviceStack } from "../modules/device/view";
import { HistoryPage } from "../modules/request/view";
import { NavBar } from "../public/component/NavBar";
import PageNotFound from "../auth/pages/PageNotFound";

export const UserRouter = () => {
    return ( 
        <>
            
            <Routes>
                <Route path="stock" element={<><NavBar/><DeviceStack/></>}/>
                <Route path="profile" element={<><NavBar/><ProfilePage/></>}/>
                <Route path="history" element={<><NavBar/><HistoryPage/></>}/>
                <Route path="details/:id" element={<><NavBar/><DetailsPage/></>}/>
                <Route path="/" element={<Navigate to={"/user/stock"}/>}/>
                <Route path="/*" element={<PageNotFound/>} />
            </Routes>
        </>
     );    
}