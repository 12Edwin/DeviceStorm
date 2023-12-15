import * as yup from "yup";
import React, { useState, useEffect } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
import {useFormik} from "formik";
import * as Yup from 'yup';
import '../style/Card.css'
import { register } from "../../../auth/helpers/register";
import { MDBInput } from "mdb-react-ui-kit";
import Swal from "sweetalert2";

export const CreateUser = ({isOpen, onClose}) => {


    const saveUser = async (user) => {
        try {
            const response = await register(user)
            if(response.status === 200){
                const {data: {message}} = response
                if(message === "Successful request"){
                    resultOk("Usuario registrado correctamente")
                }
            }else{
                resultFail("Error al registrar el usuario")
            }
        } catch (error) {
            console.log("Error al enviar los datos :c")
        }
    }

    const onConfirm = (values) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres registrar a este usuario?",
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                await saveUser(values)
            }
        })
    }
    const resultOk = (text) => {
        Swal.fire({
            title: 'Tarea completada!',
            text: text,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then(() => window.location.reload()).then(() => onClose())
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
    const form = useFormik({
        initialValues: {
            name: "",
            surname: "",
            lastname: "",
            email: "",
            password: "",
            repeatPass: ""
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Debes ingresar un nombre").matches(/^[aA-zZ\s]+$/, "Ingresa un nombre válido"),
            surname: yup.string(), 
            lastname: yup.string().required("Debes ingresar un apellido").matches(/^[aA-zZ\s]+$/, "Ingresa un apellido válido"),
            password: yup.string().required("Ingresa una contraseña válida").min(6, "Mínimo 6 caracteres"),
            email: yup.string().email('Formato Incorrecto').required("Ingresa un correo válido"),
            repeatPass: Yup.string().oneOf([Yup.ref('password')], "Contraseñas desiguales").required("Contraseñas desiguales")
        }),
        onSubmit: async (values, {setSubmitting}) =>{
            setSubmitting(true);
            onConfirm(values)
            setSubmitting(false);
        }
    }) 
    const handleClose = () => {
        form.resetForm();
        onClose();
      };
    return (
        <Modal show={isOpen} onHide={handleClose}  centered>
            <Form onSubmit={(event)=> form.handleSubmit(event)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Registrar usuario
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <MDBInput wrapperClass='mb-2' label='Nombre' id='name' type='text'
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            value={form.values.name}/>
                                {form.touched.name && form.errors.name && (
                                    <span className="text-error">{form.errors.name}</span>
                                )}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <MDBInput wrapperClass='mb-2'  label='Apellido paterno' id='lastname' type='text'
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            value={form.values.lastname}/>
                                {form.touched.lastname && form.errors.lastname && (
                                    <span className="text-error">{form.errors.lastname}</span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <MDBInput wrapperClass='mb-2' label='Apellido materno' id='surname' type='text'
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            value={form.values.surname}/>
                                {form.touched.surname && form.errors.surname && (
                                    <span className="text-error">{form.errors.surname}</span>
                                )} 
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <MDBInput wrapperClass='mb-2' label='Correo electrónico' id='email' type='email'
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            value={form.values.email}/>
                                {form.touched.email && form.errors.email && (
                                    <span className="text-error">{form.errors.email}</span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <MDBInput wrapperClass='mb-2' label='Contraseña' id='password' type='password'
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            value={form.values.password}/>
                                {form.touched.password && form.errors.password && (
                                    <span className="text-error">{form.errors.password}</span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <MDBInput wrapperClass='mb-2' label='Repetir contraseña' id='repeatPass' type='password'
                                            onChange={form.handleChange}
                                            onBlur={form.handleBlur}
                                            value={form.values.repeatPass}/>
                                {form.touched.repeatPass && form.errors.repeatPass && (
                                    <span className="text-error">{form.errors.repeatPass}</span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleClose} disabled={form.isSubmitting} variant="secondary">Cerrar</Button>
                    <Button type="submit" disabled={form.isSubmitting} variant="primary">Registrar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}
