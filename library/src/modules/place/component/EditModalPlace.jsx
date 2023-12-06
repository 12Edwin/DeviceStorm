import React, {useEffect, useState} from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import {MDBInput} from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import {updatePlace} from "../helpers/updatePlace.js";


export const EditModalPlace = ({show, onHide, place}) => {

    const [name, setName] = useState("")
    const [direction, setDirection] = useState("")
    const [capacity, setCapacity] = useState(0)
    useEffect(() => {
        setName(place.name)
        setDirection(place.direction)
        setCapacity(place.capacity)
    }, [show]);

    const onUpdate = async () =>{
        const result = await updatePlace({name, direction, capacity, id: place.uid})
        if (result === 'ERROR'){
            resultFail()
        }else {
            resultOk()
        }
    }

    const resultOk = () => {
        Swal.fire({
            title: 'Tarea completada!',
            text: 'Área actualizada correctamente',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then(res => onHide('reload'))
    }
    const resultFail = () => {
        Swal.fire({
            title: 'Error!',
            text: 'Ups, ha ocurrido un error al actualizar el área',
            icon: 'danger',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK',
        });
    }

    const onConfirm = (event) =>{
        event.preventDefault()
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Quieres actualizar esta área',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            async preConfirm(inputValue) {
                await onUpdate()
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
                    <Button type="submit" variant="primary">Guardar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );


}
