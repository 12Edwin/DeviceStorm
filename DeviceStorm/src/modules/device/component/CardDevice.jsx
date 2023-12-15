import Card from "react-bootstrap/Card";
import image from "../../../assets/img/device.jpg";
import {Col, Row} from "react-bootstrap";
import {Button} from "@material-ui/core";
import {Cancel, EditRounded, RemoveRedEyeOutlined, Restore} from "@material-ui/icons";
import {DeviceEditModal} from "./DeviceEditModal.jsx";
import React, {useEffect, useState} from "react";
import Switch from "react-switch";
import Swal from "sweetalert2";
import {removedevice} from "../helpers/boundary.js";
import {Navigate, useNavigate} from "react-router-dom";

export const CardDevice = ({devices = [], setDevices = () => {}}) => {

    const [editModal, setEditModal] = useState(false)
    const [device, setDevice] = useState({})
    const [permission, setPermission] = useState(false)
    const navigator = useNavigate()

    useEffect(() => {
        const data = localStorage.getItem('user')
        if (data) {
            const user = JSON.parse(data)
            setPermission(user.role === 'ADMIN_ROLE')
        }
    }, []);

    const handleSwitchChange = async (id) => {
        if (await onConfirm(id, 'Quieres cambiar el estado de este dispositivo')) {
            const updatedItems = devices.map(item => {
                if (item.uid === id) {
                    return {...item, status: !item.status};
                }
                return item;
            });
            setDevices(updatedItems);
        }
    }

    const onModalEdit = (data) => {
        setDevice(data)
        setEditModal(true)
    }

    const onConfirm = async (id, text) => {
        return await Swal.fire({
            title: '¿Estás seguro?',
            text: text,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            async preConfirm(inputValue) {
                return await onChangeStatus(id)
            }
        }).then(result => result.isConfirmed)
    }

    const onChangeStatus = async (id) => {
        const result = await removedevice(id)
        if (typeof (result) === 'string') {
            resultFail(result)
            return false
        } else {
            resultOk()
            return true
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

    const resultOk = () => {
        Swal.fire({
            title: 'Tarea completada!',
            text: 'Dispositivo actualizado correctamente',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        })
    }

    return (<>
            {devices.map(device => (
                    <div key={device.uid}>
                        { (device.status || permission) &&
                            <>
                                <Card className="card-device"
                                      style={{width: '18rem', margin: '15px', display: 'flex', alignItems: 'center'}}>
                                    <Card.Header style={{height: '330px'}}>
                                        <Card.Img variant="top" style={{width: '200px'}}
                                                  src={device.img ? (import.meta.env.VITE_SECRET + '/device/image/' + device.img) : image}/>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Title>{device.name}</Card.Title>
                                        <Card.Text>
                                            <strong>Code:</strong> {device.code}
                                        </Card.Text>
                                        {device.stock <= 0 &&
                                                <Button disabled={true} className="w-100"
                                                        style={{fontSize: '10px'}} variant="contained"
                                                        color="secondary" startIcon={<Cancel/>}>Agotado</Button>
                                        }
                                    </Card.Body>
                                </Card>
                                <Card style={{width: '18rem', margin: '1rem', padding: '0px'}}>
                                    <Card.Body>
                                        <Row className="justify-content-around">
                                            <Col className="w-100" md={5}>{permission ?
                                                <Button onClick={() => onModalEdit(device)}
                                                        style={{fontSize: '10px', marginRight: '10px'}} variant="contained"
                                                        color="primary" startIcon={<EditRounded/>}>Editar</Button> :
                                                <Button onClick={() => navigator(`/user/details/${device.uid}`)}
                                                        style={{fontSize: '10px', width: '100%'}} variant="contained"
                                                        color="primary" startIcon={<RemoveRedEyeOutlined/>}>Ver detalles</Button>
                                            }
                                            </Col>
                                            {permission &&
                                                <Col md={5}>
                                                    <Switch checked={device.status}
                                                            onChange={() => handleSwitchChange(device.uid)}/>

                                                </Col>
                                            }
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </>
                        }
                    </div>
                )
            )}
            <DeviceEditModal show={editModal} setShow={setEditModal} data={device}/>
        </>
    )
}