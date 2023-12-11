import React, {useEffect, useState} from "react";
import { Modal, Form, Button } from 'react-bootstrap';
import {MDBInput} from "mdb-react-ui-kit";
import {updateCategory} from "../helpers/updateCategory.js";
import Swal from "sweetalert2";
import {createCategory} from "../helpers/createCategory.js";
import {useFormik} from "formik";
import * as Yup from "yup";


export const ModalEdit = ({show, onHide, category= null}) => {

    useEffect(() => {
        formik.handleReset()
        if(category && show) {
            formik.values.name = category.name
            formik.values.description = category.description
        }else{
            formik.values.name = ''
            formik.values.description = ''
        }
    }, [show]);

    const resetForm = (value = '')=>{
        formik.values.name = ''
        formik.values.description = ''
        formik.resetForm()
        formik.handleReset()
        onHide(value)
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            description: ''
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required('El nombre es obligatorio'),
            description: Yup.string().required('La descripción es obligatoria'),
        }),
        onSubmit: async (values,{setSubmitting}) => {
            setSubmitting(true)
            await onConfirm(values)
            setSubmitting(false)
        },
    });

    const onUpdate = async ({name, description}) =>{
        const result = await updateCategory({name, description, id: category.uid})
        if (typeof (result) === 'string'){
            resultFail(result)
        }else {
            resultOk('Categoría actualizada correctamente')
        }
    }
    const onRegister = async ({name, description}) =>{
        const result = await createCategory({name, description})
        if (typeof (result) === 'string'){
            resultFail(result)
        }else {
            resultOk('Categoría registrada correctamente')
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
            text: category ? 'Quieres actualizar esta categoría' : 'Quieres registrar una nueva categoría',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            async preConfirm(inputValue) {
                if (category){
                    await onUpdate(data)
                }else {
                    await onRegister(data)
                }

            }
        })
    }

     return (
            <Modal show={show} onHide={resetForm}  centered>
                <Form onSubmit={(event)=> formik.handleSubmit(event)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Editar Categoría
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
                                <MDBInput wrapperClass='mb-2'  label='Descripción' id='description' type='text'
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          value={formik.values.description}/>
                                {formik.touched.description && formik.errors.description && (
                                    <span className="text-error">{formik.errors.description}</span>
                                )}
                            </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={resetForm} disabled={formik.isSubmitting} variant="secondary">Cerrar</Button>
                        <Button type="submit" disabled={formik.isSubmitting} variant="primary">{category ? 'Guardar' : 'Registrar'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );


}
