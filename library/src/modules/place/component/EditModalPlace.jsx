import React, {useEffect, useState} from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import {MDBInput} from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import {updatePlace} from "../helpers/updatePlace.js";
import {createPlace} from "../helpers/createPlace.js";
import {useFormik} from "formik";
import * as Yup from "yup";


export const EditModalPlace = ({show, onHide, place= null}) => {

    useEffect(() => {
        formik.handleReset()
        if(place && show) {
            formik.values.name = place.name
            formik.values.direction = place.direction
            formik.values.capacity = place.capacity
        }else{
            formik.values.name = ''
            formik.values.direction = ''
            formik.values.capacity = 0
        }
    }, [show]);

    const resetForm = (value = '')=>{
        formik.values.name = ''
        formik.values.direction = ''
        formik.values.capacity = 0
        formik.resetForm()
        formik.handleReset()
        onHide(value)
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            direction: '',
            capacity: 0,
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required('El nombre es obligatorio'),
            direction: Yup.string().required('La dirección es obligatoria'),
            capacity: Yup.number().required('Capacidad obligatorio')
                .min(5, 'El mínimo es 5')
                .max(200, 'El máximo es 200')
        }),
        onSubmit: async (values,{setSubmitting}) => {
            setSubmitting(true)
            await onConfirm(values)
            setSubmitting(false)
        },
    });

    const onUpdate = async ({name, direction, capacity}) =>{
        const result = await updatePlace({name, direction, capacity, id: place.uid})
        if (typeof (result) === 'string'){
            resultFail(result)
        }else {
            resultOk('Área actualizada correctamente')
        }
    }
    const onRegister = async ({name, direction, capacity}) =>{
        const result = await createPlace({name, direction, capacity})
        if (typeof (result) === 'string'){
            resultFail(result)
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
        }).then(res => resetForm('reload'))
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

    const onConfirm = (data) =>{
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
                    await onUpdate(data)
                }else{
                    await onRegister(data)
                }
            }
        })
    }

    return (
        <Modal show={show} onHide={resetForm}  centered>
            <Form onSubmit={(event)=> formik.handleSubmit()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Editar área
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form.Group className="mb-3">
                        <MDBInput wrapperClass='mb-2' label='Nombre' id='name' type='text'
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.name}/>
                        {formik.touched.name && formik.errors.name && (
                            <span className="text-error">{formik.errors.name}</span>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <MDBInput wrapperClass='mb-2'  label='Dirección' id='direction' type='text'
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.direction}/>
                        {formik.touched.direction && formik.errors.direction && (
                            <span className="text-error">{formik.errors.direction}</span>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <MDBInput wrapperClass='mb-2'  label='Espacio' id='capacity' type='number'
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.capacity}/>
                        {formik.touched.capacity && formik.errors.capacity && (
                            <span className="text-error">{formik.errors.capacity}</span>
                        )}
                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={resetForm} disabled={formik.isSubmitting} variant="secondary">Cerrar</Button>
                    <Button type="submit" disabled={formik.isSubmitting} variant="primary">{place ? 'Guardar': 'Registrar'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );


}
