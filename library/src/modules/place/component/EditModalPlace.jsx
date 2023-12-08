import React, {useEffect, useState} from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import {MDBInput} from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import {updatePlace} from "../helpers/updatePlace.js";
import {createPlace} from "../helpers/createPlace.js";


export const EditModalPlace = ({show, onHide, place= null}) => {

    const [name, setName] = useState("")
    const [direction, setDirection] = useState("")
    const [capacity, setCapacity] = useState(0)
    useEffect(() => {
        if (place !== null) {
            setName(place.name)
            setDirection(place.direction)
            setCapacity(place.capacity)
        }else {
            setName('')
            setDirection('')
            setCapacity(0)
        }
    }, [show]);

    const onUpdate = async () =>{
        const result = await updatePlace({name, direction, capacity, id: place.uid})
        if (result === 'ERROR'){
            resultFail('Ups, ha ocurrido un error al actualizar el área')
        }else {
            resultOk('Área actualizada correctamente')
        }
    }
    const onRegister = async () =>{
        const result = await createPlace({name, direction, capacity})
        if (result === 'ERROR'){
            resultFail('Ups, ha ocurrido un error al registrar el área')
        }else {
            resultOk('Área registrada correctamente')
        }
    }

    const resultOk = (text) => {
        Swal.fire({
            title: 'Tarea completada!',
            text: text,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then(res => onHide('reload'))
    }
    const resultFail = (text) => {
        Swal.fire({
            title: 'Error!',
            text: text,
            icon: 'danger',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK',
        });
    }

    const onConfirm = (event) =>{
        event.preventDefault()
        Swal.fire({
            title: '¿Estás seguro?',
            text: place ? 'Quieres actualizar esta área' : 'Quieres registrar una nueva área',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            async preConfirm(inputValue) {
                if (place){
                    await onUpdate()
                }else{
                    await onRegister()
                }
            }
        })
    }

    return (
        <Modal show={show} onHide={onHide}  centered>
            <Form onSubmit={(event)=> onConfirm(event)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Editar área
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form.Group className="mb-3">
                        <MDBInput wrapperClass='mb-4' label='Nombre' id='name' type='text'
                                  value={name} onChange={txt => setName(txt.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <MDBInput wrapperClass='mb-4'  label='Dirección' id='direction' type='text'
                                  value={direction} onChange={txt => setDirection(txt.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <MDBInput wrapperClass='mb-4'  label='Espacio' id='space' type='number'
                                  value={capacity} onChange={txt => setCapacity(parseInt(txt.target.value) || -1)}/>
                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={onHide} variant="secondary">Cerrar</Button>
                    <Button type="submit" variant="primary">{place ? 'Guardar': 'Registrar'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );


}
