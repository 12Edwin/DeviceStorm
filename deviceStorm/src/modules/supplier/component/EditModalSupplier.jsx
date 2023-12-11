import React, {useEffect, useState} from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import {MDBInput} from "mdb-react-ui-kit";
import Swal from "sweetalert2";
import {updateSupplier} from "../helpers/updateSupplier.js";
import {createSupplier} from "../helpers/createSupplier.js";
import {useFormik} from "formik";
import * as Yup from 'yup'


export const EditModalSupplier = ({show, onHide, supplier = null}) => {

    useEffect(() => {
        formik.handleReset()
        if(supplier && show) {
            formik.values.name = supplier.name
            formik.values.direction = supplier.direction
            formik.values.contact = supplier.contact
        }else{
            formik.values.name = ''
            formik.values.direction = ''
            formik.values.contact = 0
        }
    }, [show]);

    const resetForm = (value = '')=>{
        formik.values.name = ''
        formik.values.direction = ''
        formik.values.contact = ''
        formik.resetForm()
        formik.handleReset()
        onHide(value)
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            direction: '',
            contact: 0,
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required('El nombre es obligatorio'),
            direction: Yup.string().required('La dirección es obligatoria'),
            contact: Yup.string().required('Contacto obligatorio')
                .matches(/^[0-9]+$/, 'Formato incorrecto')
                .min(10, 'Formato incorrecto')
                .max(10, 'Formato incorrecto')
        }),
        onSubmit: async (values,{setSubmitting}) => {
            setSubmitting(true)
            await onConfirm(values)
            setSubmitting(false)
        },
    });

    const onUpdate = async ({name, direction, contact}) =>{
        const result = await updateSupplier({name, direction, contact, id: supplier.uid})
        if (typeof (result) === 'string'){
            resultFail(result)
        }else {
            resultOk('Proveedor actualizado correctamente')
        }
    }
    const onRegister = async ({name, direction, contact}) =>{
        const result = await createSupplier({name, direction, contact})
        if (typeof (result) === 'string'){
            resultFail(result)
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
                    await onUpdate(data)
                }else{
                    await onRegister(data)
                }
            }
        })
    }

    return (
        <Modal show={show} onHide={resetForm}  centered>
            <Form onSubmit={(event)=> {event.preventDefault(); formik.handleSubmit()}}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Editar proveedor
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form.Group className="mb-3">
                        <MDBInput wrapperClass='mb-2' label='Nombre' id='name' name="name" type='text'
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.name}/>
                        {formik.touched.name && formik.errors.name && (
                            <span className="text-error">{formik.errors.name}</span>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <MDBInput wrapperClass='mb-2'  label='Dirección' id='direction' name='direction' type='text'
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.direction}/>
                        {formik.touched.direction && formik.errors.direction && (
                            <span className="text-error">{formik.errors.direction}</span>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <MDBInput wrapperClass='mb-2'  label='Contacto' id='contact' name='contact' type='number'
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.contact}/>
                        {formik.touched.contact && formik.errors.contact && (
                            <span className="text-error">{formik.errors.contact}</span>
                        )}
                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={resetForm} disabled={formik.isSubmitting} variant="secondary">Cerrar</Button>
                    <Button type="submit" disabled={formik.isSubmitting} variant="primary">{supplier ? 'Guardar': 'Registrar'}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );


}
