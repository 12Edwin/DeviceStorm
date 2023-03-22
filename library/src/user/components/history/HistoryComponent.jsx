import React, { useContext, useEffect, useState } from 'react';
import { LoadingComponent } from '../../../auth/components/loading/LoadingComponent';
import { AuthContext } from '../../../auth/context/AuthContext';
import { getHistory } from '../../helpers/getHistory';
import './History.css';
import { Box, Icon } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import { SomeProblems } from '../../../auth/pages/SomeProblems';
import { validateToken } from '../../../auth/helpers/validateToken';
import { getSales } from '../../helpers/getSales';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { cancelSale } from '../../helpers/cancelSale';
import { cancelRequest } from '../../helpers/cancelRequest';

export const HistoryComponent = () => {

  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const { logout } = useContext(AuthContext);
  const [ transaction, setTransaction] = useState({});

  const fillHistory = async () => {
    setLoading(true);

  const resultToken = await validateToken();
      if (!(resultToken == true)) {
      logout();
  }

      const response = await getHistory(user.id)
      if (response == 'ERROR') {
        setApiError(true)
      } else {
        setHistory(response || []);
        setApiError(false);
      }
      const resSales = await getSales(user.id)
      if (resSales == 'ERROR') {
        setApiError(true)
      } else {
        setSales(resSales || []);
        setApiError(false);
      }
      setLoading(false);
  }

  useEffect(() => {
    fillHistory()
  }, [])


  const onConfirm = async (type, id) => {
    console.log(id);
    if(type === 'request'){
      const response = await cancelRequest(id)
      if(response === 'ERROR')
        return(false);
      else
        return(true);
    }
    if(type === 'sale'){
    return new Promise ((resolve) =>{
      setTimeout(() =>{
        cancelSale(id).then( (response) =>{
          if(response === 'ERROR')
            resolve(false);
          else
            resolve(true);
        }).catch ((err) => resolve(false));
      },1000);
    }
    );}
  }
  

  const onCancel = () => {
    onCancel();
    
  };

  const handleConfirm = (type, id) => {
    Swal.fire({
      title: 'Confirmar Acción',
      text: '¿Está seguro que decea realizar esta acción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      preConfirm: async () => {
        const result = await onConfirm(type, id);
        if (result) {
          (await Swal.fire({title:'¡Listo!', text:'La transacción se ha completado exitosamente.', icon:'success'}).then(()=> window.location.reload()))

        } else {
          Swal.fire('Error', 'Ocurrió un error al procesar la transacción', 'error');
        }
      }
      
    })
  };

  return (

    <div className='col-11 mt-5' style={{ paddingLeft: "180px" }}>
      {apiError ? <SomeProblems /> : loading ?
        <LoadingComponent /> :
        (<><div className='banner'><h1>Historial</h1></div>
          <div className='card'>
            <div className="tabla-container mt-5">
              <div className="tabla-header">
                <div className="tabla-header-cell">Libro</div>
                <div className="tabla-header-cell">Creado</div>
                <div className="tabla-header-cell">Tipo</div>
                <div className="tabla-header-cell">Estatus</div>
                <div className="tabla-header-cell">-</div>
              </div>
              {(history.length != 0) ? history.map((fila) => (
                <div key={fila._id} className="tabla-fila">
                  <div className="tabla-celda">{fila.book}</div>
                  <div className="tabla-celda">{fila.created}</div>
                  <div className="tabla-celda">Devolver: <br /> {fila.returns}</div>
                  <div className="tabla-celda">{fila.status}</div>
                  <div className="tabla-celda"><Button color='secundary' disabled={fila.status === 'Finished'} onClick={async() => { handleConfirm('request', fila._id)}}>Cancelar</Button></div>
                </div>
              )) : <nothingBook/> }
              {(sales.length != 0) ?
                sales.map(fila => (
                  <div key={fila.uid} className="tabla-fila">
                    <div className="tabla-celda">{fila.book}</div>
                    <div className="tabla-celda">{fila.created}</div>
                    <div className="tabla-celda">Precio: ${fila.price}</div>
                    <div className="tabla-celda">{fila.status ? `Pago: $${fila.pay}`: `Rembolso $${fila.pay}`}</div>
                    <div className="tabla-celda"><Button variant='danger' disabled={!fila.status} onClick={async() => { handleConfirm('sale',fila.uid)}}>Rembolzar</Button></div>
                  </div>
                ))
                : <nothingBook/> }
            </div>
          </div></>)
      }
      
    </div>
  );
};

const nothingBook = () =>{
  return(
    <div className="tabla-fila" style={{ display: 'flex', alignItems: 'end', alignContent: 'end' }}>
      <div
        style={{
          backgroundImage: "url(https://cdn3.iconfinder.com/data/icons/working-3/4000/Paperwork-256.png)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          width: "200px",
          height: "200px",
        }}
      /> <div className='mb-3'> Aún no tienes libros! </div>
    </div>
  )
}
