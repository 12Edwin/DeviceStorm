import Card from "react-bootstrap/Card";
import image from "../../../assets/img/device.jpg";
import {Col, Row} from "react-bootstrap";
import {Button} from "@material-ui/core";
import {Cancel, EditRounded, Restore} from "@material-ui/icons";
import {DeviceEditModal} from "./DeviceEditModal.jsx";
import React, {useState} from "react";
import Switch from "react-switch";
import Swal from "sweetalert2";

export const CardDevice = ({devices = [], setDevices = () => {}, requests = []}) => {

    const [editModal, setEditModal] = useState(false)
    const [device, setDevice] = useState({})

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
                //return await onChangeStatus(id)
            }
        }).then(result => result.isConfirmed)
    }

    return (<>
        {devices.map(device => (
            <div key={device.uid}>{!device.available || requests.includes(device.name) ? <></> :
                (<>
                    <Card style={{width: '18rem', margin: '15px', display: 'flex', alignItems: 'center'}}>
                        <Card.Header style={{height: '330px'}}>
                            <Card.Img variant="top" style={{width: '200px'}} src={device.img ? (import.meta.env.VITE_SECRET + '/device/image/' + device.img) : image}/>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>{device.name}</Card.Title>
                            <Card.Text>
                                <strong>Code:</strong> {device.code}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card style={{width: '18rem', margin: '1rem', padding: '0px'}}>
                        <Card.Body>
                            <Row>
                                <Col md={5}>{requests.includes(device.name) ?
                                    <></>
                                    :
                                    <Button onClick={() => onModalEdit(device)}
                                            style={{fontSize: '10px', marginRight: '10px'}} variant="contained"
                                            color="primary" startIcon={<EditRounded/>}>Editar</Button>
                                }
                                </Col>
                                <Col md={5}>{requests.includes(device.name) ?
                                    <Button disabled={true}
                                            style={{fontSize: '10px', marginLeft: '10px'}} variant="contained"
                                            color="secondary" startIcon={<Cancel/>}>Agotado</Button> :
                                    <Switch checked={device.status} onChange={() => handleSwitchChange(device.uid)}/>
                                }
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </>)}
            </div>
            )
            )}
            <DeviceEditModal show={editModal} setShow={setEditModal} data={device}/>
        </>
    )
}