import React, {useEffect, useState} from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import {MDBInput} from "mdb-react-ui-kit";
import {updateCategory} from "../helpers/updateCategory.js";
import Swal from "sweetalert2";


export const ModalEdit = ({show, onHide, category}) => {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    useEffect(() => {
        setName(category.name)
        setDescription(category.description)
    }, [show]);

    const onUpdate = async () =>{
        const result = await updateCategory({name, description, id: category.uid})
        if (result === 'ERROR'){
            resultFail()
        }else {
            resultOk()
        }
    }

    const resultOk = () => {
        Swal.fire({
            title: 'Tarea completada!',
            text: 'Categoría actualizada correctamente',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then(res => onHide('reload'))
    }
    const resultFail = () => {
        Swal.fire({
            title: 'Error!',
            text: 'Ups, ha ocurrido un error al actualizar la categoría',
            icon: 'danger',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK',
        });
    }

    const onConfirm = (event) =>{
        event.preventDefault()
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Quieres actualizar esta categoría',
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
                            Editar Categoría
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                            <Form.Group className="mb-3">
                                <MDBInput wrapperClass='mb-4' label='Nombre' id='name' type='text'
                                          value={name} onChange={txt => setName(txt.target.value)}/>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <MDBInput wrapperClass='mb-4'  label='Descripción' id='description' type='text'
                                          value={description} onChange={txt => setDescription(txt.target.value)}/>
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
