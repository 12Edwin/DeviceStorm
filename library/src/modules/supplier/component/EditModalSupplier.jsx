import React, {useEffect, useState} from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import {MDBInput} from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import {updateSupplier} from "../helpers/updateSupplier.js";


export const EditModalSupplier = ({show, onHide, supplier}) => {

    const [name, setName] = useState("")
    const [direction, setDirection] = useState("")
    const [contact, setContact] = useState(0)

    useEffect(() => {
        setName(supplier.name)
        setDirection(supplier.direction)
        setContact(supplier.contact)
    }, [show]);

    const onUpdate = async () =>{
        const result = await updateSupplier({name, direction, contact, id: supplier.uid})
        if (result === 'ERROR'){
            resultFail()
        }else {
            resultOk()
        }
    }

    const resultOk = () => {
        Swal.fire({
            title: 'Tarea completada!',
            text: 'Proveedor actualizado correctamente',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then(res => onHide('reload'))
    }
    const resultFail = () => {
        Swal.fire({
            title: 'Error!',
            text: 'Ups, ha ocurrido un error al actualizar el proveedor',
            icon: 'danger',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK',
        });
    }

    const onConfirm = (event) =>{
        event.preventDefault()
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Quieres actualizar este proveedor',
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
                        Editar proveedor
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
                        <MDBInput wrapperClass='mb-4'  label='Contacto' id='space' type='number'
                                  value={contact} onChange={txt => setContact(parseInt(txt.target.value) || -1)}/>
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
