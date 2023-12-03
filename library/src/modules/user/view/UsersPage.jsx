import { useState, useEffect } from 'react';
import { LoadingComponent } from '../../../auth/components/loading/LoadingComponent';
import { SomeProblems } from '../../../auth/pages/SomeProblems';
import {UsersComponent} from '../component/UsersComponent'
import {getAllUsers} from '../helpers/getAllUsers';

export const UsersPage = () =>{
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(false);

    const fillUsers = async () =>{
        setLoading(true);
        const response = await getAllUsers();
        if(response === 'ERROR'){
          setApiError(true);
        }else{
          setApiError(false);
          setUsers(response);
          console.log(response);
        }
        setLoading(false);
      }
    
      useEffect(() =>{
        fillUsers();
      },[]);

    return(
        <div className='col-11 mt-5' style={{ paddingLeft: "300px" }}>
            { loading ? <LoadingComponent/> : apiError ? <SomeProblems/> :
            <UsersComponent users={users}/>
            }
        </div>
    )
}