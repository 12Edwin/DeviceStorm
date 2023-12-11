import React, { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import images from '../../../assets/img/500.png' 
import { Button, Card, CardContent, CardHeader, CardMedia } from '@material-ui/core';
//import { ShoppingCart,deviceTwoTone, VisibilityRounded } from '@material-ui/icons';
import { Navigate, useParams } from 'react-router-dom';
import { getdeviceDetails } from '../helpers';
import image from '../../../assets/img/device.jpg'
import { SomeProblems } from '../../../auth/pages/SomeProblems';
import { LoadingComponent } from '../../../auth/components/loading/LoadingComponent';
import { AuthContext } from '../../../auth/context/AuthContext';
import { DeviceStack } from './DeviceStack'; 
import { CardText, CardTitle } from 'reactstrap';
import { DeviceRequestModal } from '../../request/component/DeviceRequestModal';


export const DetailsDeviceComponent = () => {

    const {id} = useParams();
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState(false);
    const [device, setdevice] = useState({});
    const [openRequest, setOpenRequest] = useState(false);
    const [openBuy, setOpenBuy] = useState(false);
    const {logout} = useContext(AuthContext);
    const [reload, setReload] = useState(false);
    
    const filldevice = async () =>{
        setLoading(true);

        const response = await getdeviceDetails(id);
        if(response === 'ERROR'){
            setApiError(true);
        }else{
            setApiError(false);
            setdevice(response.device);
        }
        setLoading(false);
    }

    useEffect(() =>{
        filldevice();
    },[]);

    const charge = () =>{
        setReload(false)
        window.location.reload();
    }

    const onBuy = () =>{
        setOpenBuy(true)
    }

    const onRequest = () =>{
        setOpenRequest(true);
    }

  return (
    <>
    <div className='mt-4' style={{marginLeft:'300px'}}>
        { loading ? <LoadingComponent/> : apiError ? <SomeProblems/> : device.status == false ? <Navigate to={'/user/stock'} /> :
            (<><div className='row'>
            <Col md = {5}>
                <div className='card' style={{ width: '100%', margin: '1rem' }}>
                    <div style={{height:'480px'}}>
                        <CardMedia component="img"  image={device.img ? device.img : image} />
                    </div>
                    <CardContent>
                        <CardTitle>{device.name}</CardTitle>
                    </CardContent>
                </div>
            </Col>
            <Col md = {5}>
                <div className='card' style={{ width: '18rem', margin: '1rem' }}>
                <CardContent>
                    <CardTitle>{device.publication}</CardTitle>
                    <CardText>
                    <strong>Author:</strong> {device.author}
                    </CardText>
                </CardContent>
                </div>
                <div className='card' style={{ width: '18rem', margin: '1rem' }}>
                <CardContent>
                    <CardTitle>Publicación: {device.publication}</CardTitle>
                    <CardText>
                    <strong>Reseña:</strong> {device.resume}
                    </CardText>
                </CardContent>
                </div>
                <div className='card' style={{ width: '18rem', margin: '1rem', padding:'0px' }}>
                <CardContent>
                    <CardTitle>Deceas pedirlo</CardTitle>
                    <Row className='mt-4'>
                        <Col md ={5}>
                            <Button onClick={onBuy} style={{fontSize:'10px', marginRight:'10px'}} variant="contained" color="primary"startIcon={<ShoppingCart />}>Comprar</Button>
                        </Col>
                        <Col md ={5}>
                            <Button onClick={onRequest} style={{fontSize:'10px', marginLeft:'10px'}} variant="contained" color="secondary"startIcon={<deviceTwoTone />}>Prestamo</Button>
                        </Col>
                    </Row>
                    
                </CardContent>
                </div>
            </Col>
        </div>
        <Row>
            <div className='mt-4 mb-2' style={{marginLeft:'20px'}}> <h3>También te pueden gustar</h3> </div>
            
        </Row></>)
        }
    </div>
    { openBuy &&
    <BuydeviceComponent open={setOpenBuy} data={device}/>
    }
    { openRequest &&
    <deviceRequestModal open={setOpenRequest} data={device} />
    }
    <deviceStack reload = {setReload}/>
    { reload &&
        charge()
    }
    </>
);
};
