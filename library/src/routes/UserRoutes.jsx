import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProfilePage } from "../modules/user/view";
import { DetailsPage, DeviceStack } from "../modules/device/view";
import { HistoryPage, RequestPage } from "../modules/request/view";
import { UserNavBar } from "../public/component/UserNavBar";
import PageNotFound from "../auth/pages/PageNotFound";
import { UserRequestPage } from "../modules/request/view/UserRequestPage";

export const UserRouter = () => {
    return ( 
        <>
            
            <Routes>
                <Route path="stock" element={<><UserNavBar/><DeviceStack/></>}/>
                <Route path="requests" element = {<><UserNavBar /><UserRequestPage/></>}/>
                <Route path="profile" element={<><UserNavBar/><ProfilePage/></>}/>
                <Route path="history" element={<><UserNavBar/><HistoryPage/></>}/>
                <Route path="details/:id" element={<><UserNavBar/><DetailsPage/></>}/>
                <Route path="/" element={<Navigate to={"/user/stock"}/>}/>
                <Route path="/*" element={<PageNotFound/>} />
            </Routes>
        </>
    );    
}