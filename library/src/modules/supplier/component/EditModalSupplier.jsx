import React, {useEffect, useState} from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import {MDBInput} from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import {updateSupplier} from "../helpers/updateSupplier.js";
import {createSupplier} from "../helpers/createSupplier.js";


export const EditModalSupplier = ({show, onHide, supplier = null}) => {

    const [name, setName] = useState("")
    const [direction, setDirection] = useState("")
    const [contact, setContact] = useState(0)

    useEffect(() => {
        if(supplier) {
            setName(supplier.name)
            setDirection(supplier.direction)
            setContact(supplier.contact)
        }else{
            setName('')
            setDirection('')
            setContact(0)
        }
    }, [show]);

    const onUpdate = async () =>{
        const result = await updateSupplier({name, direction, contact, id: supplier.uid})
        if (result === 'ERROR'){
            resultFail('Ups, ha ocurrido un error al actualizar el proveedor')
        }else {
            resultOk('Proveedor actualizado correctamente')
        }
    }
    const onRegister = async () =>{
        const result = await createSupplier({name, direction, contact})
        if (result === 'ERROR'){
            resultFail('Ups, ha ocurrido un error al registrar el proveedor')
        }else {
            resultOk('Proveedor registrado correctamente')
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
            text: supplier ? 'Quieres actualizar este proveedor' : 'Quieres registrar un nuevo proveedor',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            async preConfirm(inputValue) {
                if(supplier) {
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
                    <Button type="submit" variant="primary">{supplier ? 'Guardar': 'Registrar'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );


}
