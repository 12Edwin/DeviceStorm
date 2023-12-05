import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// import device1 from './device1.jpg';
// import device2 from './device2.jpg';
// import device3 from './device3.jpg';
import '../style/DeviceStack.css';
import { SomeProblems } from '../../../auth/pages/SomeProblems.jsx';
import { LoadingComponent } from '../../../auth/components/loading/LoadingComponent.jsx';
import {getCategories, getdevices} from '../helpers/index.js';
import {AuthContext} from '../../../auth/context/AuthContext.jsx'
import { Button } from '@material-ui/core';
import Card from 'react-bootstrap/Card';
//import { deviceTwoTone, EditRounded, Cancel, Restore } from '@material-ui/icons';
import { Col, Row } from 'react-bootstrap';
import image from '../../../assets/img/device.jpg';
import { getRequestGral } from '../helpers/index.js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { removedevice } from '../helpers/index.js';
import { DeviceEditModal } from './DeviceEditModal.jsx';

export const DeviceStack = () => {
  const [devices, setdevices] = useState([]);
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(false);
  const [data, setData] = useState({});
  const [requests, setRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);


  const fillDevices = async () => {
    setLoading(true);
    
    const response = await getdevices();
    if(response == 'ERROR'){
      setApiError(true);
      
    }else{
      setdevices(response.devices);
      setApiError(false);
    }
    setLoading(false);
  }

  const fillCategories = async () =>{
    const response = await getCategories();
  }
  
  useEffect(() => {
    fillDevices();
    getRequests();
  }, []);

  const openModalRemove = (id) =>{
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Deceas deshabilitar este libro!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      preConfirm:  async() => {const result = await removedevice(id);
        if(result !== 'ERROR'){
          Swal.fire(
            '¡Felicidades!',
            'La transacción se ha realizado con éxito.',
            'success'
          ).then(() => window.location.reload());
        }else{
          Swal.fire(
            '¡Error!',
            'Ocurrió un error al realizar la transacción.',
            'danger'
          );
        }
      }
    });
  }

  const openModalEdit = (datos) =>{
    setData(datos);
    setOpenModal(true);
  }

  const getRequests = async () =>{
    const response = await getRequestGral();
    if(response === 'ERROR'){
      setApiError(true)
    }else{
      setApiError(false)
      let data = [];
      response.requests.forEach(element => {
        if(element.status !== 'Finished')
        data.push(element.device);
      });
      setRequests(data);
    }
  }


  return (
    <div className="deviceshelf-section" style={{ paddingLeft: "300px" }}>
      
      { apiError ? <SomeProblems/> : loading ? <LoadingComponent/> :
      (<><div className="deviceshelf-header">
        <h3>Best Sellers</h3>
        <div className="deviceshelf-controls">
          {/* Controles de la sección */}
        </div>
      </div>
      <div className="deviceshelf-devices">
        {devices.map(device => (
          <div key={device.uid}>{!device.available || requests.includes(device.name) || sales.includes(device.name) ? <></>  :(<>
          
          <Card style={{ width: '18rem', margin: '15px', display:'flex', alignItems:'center' }}>
            <Card.Header style={{height: '330px'}}>
            <Card.Img variant="top" style={{width:'200px'}} src={device.img ? device.img : image}/>
            </Card.Header>
            <Card.Body>
                <Card.Title>{device.name}</Card.Title>
                <Card.Text>
                <strong>Code:</strong> {device.code}
                </Card.Text>
            </Card.Body>
          </Card>
          <Card style={{ width: '18rem', margin: '1rem', padding:'0px' }}>
          <Card.Body>
              <Row>
                  <Col md ={5}>{ requests.includes(device.name) ? 
                      <></>
                      :
                      <Button onClick={()=>openModalEdit(device)} style={{fontSize:'10px', marginRight:'10px'}} variant="contained" color="primary"startIcon={<EditRounded />}>Editar</Button>
                  }
                  </Col>
                  <Col md ={5}>{ requests.includes(device.name) ? 
                      <Button onClick={()=>openModalRemove(device.uid)} disabled={true} style={{fontSize:'10px', marginLeft:'10px'}} variant="contained" color="secondary"startIcon={<Cancel />}>Agotado</Button>
                      : !device.status ?
                      <Button onClick={()=>openModalRemove(device.uid)} style={{fontSize:'10px', marginLeft:'10px', backgroundColor:'green', color:'white'}} variant="contained" startIcon={<Restore />}>Rehabilitar</Button>
                      :
                      <Button onClick={()=>openModalRemove(device.uid)} style={{fontSize:'10px', marginLeft:'10px'}} variant="contained" color="secondary"startIcon={<deviceTwoTone />}>Deshabilitar</Button>
                       
                  }
                  </Col>
              </Row>    
          </Card.Body>
          </Card>
           <DeviceEditModal open={openModal} onOpen={setOpenModal} data={data}/>
          </>)}
          </div>
        )
        )}
      </div> </>)
      }
      
    </div>
  );
};