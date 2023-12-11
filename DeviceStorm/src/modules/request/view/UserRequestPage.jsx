import React, { useEffect, useState } from 'react';
import { LoadingComponent } from '../../../auth/components/loading/LoadingComponent';
import { SomeProblems } from '../../../auth/pages/SomeProblems';
import {Request} from '../component/Request'
import { getRequestGral } from '../helpers/getRequestGral';
import {UserRequest} from '../component/UserRequest';
import { getRequstByEmail } from '../helpers/getRequestByEmail';

export const UserRequestPage = ()=>{

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [requests, setRequests] = useState([]);

    useEffect(() =>{
        fillRequests();
    },[]);

    const fillRequests = async () =>{
        setLoading(true);
        const response = await getRequstByEmail();
        if(response === 'ERROR'){
            setApiError(true);
            console.log(response);
        }else{
            console.log("response: "+response)
            setApiError(false);
            setRequests(response);
        }
        setLoading(false);
    }

    return( loading ? <LoadingComponent /> : apiError ? <SomeProblems/> :
        <UserRequest requests={requests}/>
    )
}