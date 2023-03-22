import { useEffect, useState } from 'react'
import { SomeProblems } from '../../auth/pages/SomeProblems';
import {SalesComponent} from '../components/sales/SalesComponent'
import { getAllSales } from '../helpers/getAllSales';
import { LoadingComponent } from '../../auth/components/loading/LoadingComponent';

export const SalesPage = () =>{

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [sales, setSales] = useState([]);

    useEffect(() =>{
        fillSales();
    },[]);

    const fillSales = async () =>{
        setLoading(true);
        const response = await getAllSales();
        if(response === 'ERROR'){
            setApiError(true);
            console.log(response);
        }else{
            setApiError(false);
            setSales(response);
        }
        setLoading(false);
    }
    return( loading ? <LoadingComponent /> : apiError ? <SomeProblems /> :
        <SalesComponent sales={sales}/>
    )
}