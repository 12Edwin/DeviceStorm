import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HistoryPage, DetailsPage, ProfilePage, StockPage } from "../user/pages";
import { NavBar } from "../user/components/navigator/NavBar";
import PageNotFound from "../auth/pages/PageNotFound";

export const UserRouter = () => {
    return ( 
        <>
            
            <Routes>
                <Route path="stock" element={<><NavBar/><StockPage/></>}/>
                <Route path="profile" element={<><NavBar/><ProfilePage/></>}/>
                <Route path="history" element={<><NavBar/><HistoryPage/></>}/>
                <Route path="details/:id" element={<><NavBar/><DetailsPage/></>}/>
                <Route path="/" element={<Navigate to={"/user/stock"}/>}/>
                <Route path="/*" element={<PageNotFound/>} />
            </Routes>
        </>
     );    
}