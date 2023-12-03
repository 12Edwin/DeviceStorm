import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// import device1 from './device1.jpg';
// import device2 from './device2.jpg';
// import device3 from './device3.jpg';
import './DeviceStack.css';
import { SomeProblems } from '../../../auth/pages/SomeProblems';
import { LoadingComponent } from '../../../auth/components/loading/LoadingComponent';
import { getdevice } from '../../../user/helpers/getdevice';
import { validateToken } from '../../../auth/helpers/validateToken';
import {AuthContext} from '../../../auth/context/AuthContext'
import { Button } from '@material-ui/core';
import Card from 'react-bootstrap/Card';
//import { ShoppingCart, VisibilityRounded } from '@material-ui/icons';
import { Col, Row } from 'react-bootstrap';
import { DeviceRequestModal } from '../../request/component/DeviceRequestModal'; 
import image from '../../../assets/img/device.jpg';
import { getRequestGral } from '../../../user/helpers/getHistory';
import { useNavigate } from 'react-router-dom';
import { getAllSales } from '../../../admin/helpers/getAllSales';
export const DeviceStack = ({reload}) => {
  const [devices, setdevices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(false);
  const {logout} = useContext(AuthContext)
  const [openRequest, setOpenRequest] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [data, setData] = useState({});
  const [requests, setRequests] = useState([]);
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();
  

  const filldevices = async () => {
    setLoading(true);
    const resultToken = await validateToken();
    if(!(resultToken == true) ){
      logout();
    }
    const response = await getdevice();
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
    setCategories(response);
  }
  
  useEffect(() => {
    filldevices();
    getRequests();
  }, []);

  const openModal = (datos) =>{
    setOpenRequest(true)
    setData(datos)
  }
  const openModalBuy = (datos) =>{
    setOpenBuy(true)
    setData(datos)
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
          <div key={device.uid}>{!device.status || requests.includes(device.name) || sales.includes(device.name) ? <></>  :(<>
          
          <Card style={{ width: '18rem', margin: '15px', display:'flex', alignItems:'center' }}>
            <Card.Header style={{height: '330px'}}>
            <Card.Img variant="top" style={{width:'200px'}} src={device.img ? device.img : image}/>
            </Card.Header>
            <Card.Body>
                <Card.Title>{device.name}</Card.Title>
                <Card.Text>
                <strong>Author:</strong> {device.author}
                </Card.Text>
                <Button style={{fontSize:'10px', display: 'flex'}} variant="contained" color="default" onClick={()=>{navigate(`/user/details/${device.uid}`); reload(true)}} endIcon={<VisibilityRounded />}>Ver más</Button>
            </Card.Body>
          </Card>
          <Card style={{ width: '18rem', margin: '1rem', padding:'0px' }}>
          <Card.Body>
              <Row>
                  <Col md ={5}>
                      <Button onClick={()=>openModalBuy(device)} style={{fontSize:'10px', marginRight:'10px'}} variant="contained" color="primary"startIcon={<ShoppingCart />}>Comprar</Button>
                  </Col>
                  <Col md ={5}>
                      <Button onClick={()=>openModal(device)} style={{fontSize:'10px', marginLeft:'10px'}} variant="contained" color="secondary"startIcon={<deviceTwoTone />}>Prestamo</Button>
                  </Col>
              </Row>    
          </Card.Body>
          </Card>{ openRequest &&
          <deviceRequestModal data={data} open ={setOpenRequest}/>
          }
          { openBuy &&
          <BuydeviceComponent isOpen={openBuy} open={setOpenBuy} data={data}/>
          }
          </>)}
          </div>
        )
        )}
      </div> </>)
      }
      
    </div>
  );
};