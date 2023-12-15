import React, {useEffect, useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Button, CardContent, CardMedia} from '@material-ui/core';
import {Navigate, useParams} from 'react-router-dom';
import {findCategory, findPlace, getdeviceDetails} from '../helpers/boundary.js';
import image from '../../../assets/img/device.jpg'
import {SomeProblems} from '../../../auth/pages/SomeProblems';
import {LoadingComponent} from '../../../auth/components/loading/LoadingComponent';
import {CardText, CardTitle} from 'reactstrap';
import Swal from "sweetalert2";


export const DetailsDeviceComponent = () => {

    const {id} = useParams();
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState(false);
    const [device, setdevice] = useState({});
    const [category, setCategory] = useState({})
    const [place, setPlace] = useState({})

    const fillDevice = async () => {
        const response = await getdeviceDetails(id);
        if (typeof (response) === 'string') {
            setApiError(true);
            resultFail('Ocurrió un error al consultar el dispositivo')
        } else {
            setApiError(false);
            setdevice(response);
            fillCategory(response.category)
            fillPlace(response.place)
        }
    }
    const fillPlace = async (ids) => {
        const response = await findPlace(ids);
        if (typeof (response) === 'string') {
            setApiError(true);
            resultFail('Ocurrió un error al consultar el dispositivo')
        } else {
            setApiError(false);
            setPlace(response);
        }
    }

    const fillCategory = async (ids) => {
        const response = await findCategory(ids);
        if (typeof (response) === 'string') {
            setApiError(true);
            resultFail('Ocurrió un error al consultar el dispositivo')
        } else {
            setApiError(false);
            setCategory(response);
            return response
        }
    }
    const resultFail = (text) => {
        Swal.fire({
            title: 'Error!',
            text,
            icon: 'danger',
            confirmButtonText: 'OK',
        });
    }

    useEffect(() => {
        setLoading(true);
        fillDevice()
        setLoading(false);
    }, []);


    return (
        <>
            <div className='mt-4' style={{marginLeft: '300px'}}>
                {loading ? <LoadingComponent/> : apiError ? <SomeProblems/> :
                    <div className='row'>
                        <Col md={5}>
                            <div className='card' style={{width: '100%', margin: '1rem'}}>
                                <div style={{height: '480px'}}>
                                    <CardMedia component="img" image={device.img ? (import.meta.env.VITE_SECRET + '/device/image/' + device.img) : image}/>
                                </div>
                                <CardContent>
                                    <CardTitle>{device.name}</CardTitle>
                                </CardContent>
                            </div>
                        </Col>
                        <Col md={5}>
                            <div className='card' style={{width: '18rem', margin: '1rem'}}>
                                <CardContent>
                                    <CardTitle> <strong>Código de artículo: </strong> {device.code}</CardTitle>
                                    <CardText>
                                        <strong>Dispositivos disponibles:</strong> {device.stock}
                                    </CardText>
                                </CardContent>
                            </div>
                            <div className='card' style={{width: '18rem', margin: '1rem'}}>
                                <CardContent>
                                    <CardText>
                                        <strong> Categoría: </strong> {category.name + ' ' + category.description}
                                    </CardText>
                                    <CardText>
                                        <strong>Ubicación:</strong> {place.name + ' ' + place.direction}
                                    </CardText>
                                </CardContent>
                            </div>
                        </Col>
                    </div>
                }
            </div>
        </>
    );
};
