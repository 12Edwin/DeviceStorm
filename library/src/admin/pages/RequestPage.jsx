import React, { useEffect, useState } from 'react';
import { LoadingComponent } from '../../auth/components/loading/LoadingComponent';
import { SomeProblems } from '../../auth/pages/SomeProblems';
import {Request} from '../components/request/Request'
import { getRequestGral } from '../helpers/getRequestGral';


export const RequestPage = ()=>{

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [requests, setRequests] = useState([]);

    useEffect(() =>{
        fillRequests();
    },[]);

    const fillRequests = async () =>{
        setLoading(true);
        const response = await getRequestGral();
        if(response === 'ERROR'){
            setApiError(true);
            console.log(response);
        }else{
            setApiError(false);
            setRequests(response);
        }
        setLoading(false);
    }

    return( loading ? <LoadingComponent /> : apiError ? <SomeProblems/> :
        <Request requests={requests}/>
    )
}