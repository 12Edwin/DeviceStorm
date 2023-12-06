import * as yup from "yup";
import React, { useState, useEffect } from "react";
import { Button, Col, Modal, Row, FormSelect, FloatingLabel, FormControl } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import { Formik, Field, Form, useFormik} from "formik";
import * as Yup from 'yup';
import '../style/Card.css'
import { register } from "../../../auth/helpers/register";
export const CreateUser = ({isOpen, onClose}) => {
    const saveUser = async (user) => {
        try {
            const response = await register(user)
        } catch (error) {
            console.log("Error al enviar los datos :c")
        }
    }

    const form = useFormik({
        initialValues: {
            name: "",
            surname: "",
            lastname: "",
            email: "",
            password: "",
            repeatPassword: ""
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Debes ingresar un nombre válido"),
            surname: yup.string(),
            lastname: yup.string().required("Debes ingresar un apellido válido"),
            password: yup.string().required("Ingresa una contraseña válida").min(6, "Mínimo 6 caracteres"),
            email: yup.string().email('Formato Incorrecto').required("Ingresa un correo válido"),
            password: Yup.string().min(6, "El mínimo es de 6 caracteres").required("Contraseña requerdia"),
            repeatPass: Yup.string().oneOf([Yup.ref('password')], "Contraseñas desiguales").required("Contraseñas desiguales")
        })
    }) 
    const handleClose = () => {
        form.resetForm();
        onClose();
      };
    return (
        <CSSTransition
            in={isOpen}
            timeout={300}
            classNames="modal"
            unmountOnExit
        >
            <Modal
            backdrop="static"
            keyboard={false}
            show={isOpen}
            onHide={handleClose}
        >
            <div className="modal-header">
                <h4 className="text-center">Crear usuario</h4>
                <button className="close-button" onClick={handleClose}>
                    X
                </button>
            </div>
            <div className="modal-body">
                <div className="form-container">
                    <Formik
                        initialValues={{
                            name: "",
                            surname: "",
                            lastname: "",
                            email: "",
                            password: "",
                            repeatPass: ""
                        }}
 
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required("Debe ingresar un nombre válido"),
                            surname: Yup.string().required("Debe ingresar un apellido válido"),
                            lastname: Yup.string(),
                            password: Yup.string().required("Campo obligatorio").min(6, "Mínimo 6 caracteres"),
                            email: Yup.string().email('Ingrese un correo válido').required("El correo es obligatorio"),
                            repeatPass: Yup.string().oneOf([Yup.ref('password')], "Las contraseñas deben de coincidir").required("Debes confirmar la contraseña")
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            setSubmitting(true);
                            saveUser(values).then(()=>{window.location.reload(true)});
                            setSubmitting(false);
                        }}
                    >
                        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                            <Form
                                style={{ padding: '0px', boxShadow: 'none', backgroundColor: 'white' }}
                            >
                                <Row>
                                    <Col md={6}>
                                        <div className="form-step">
                                            <div className="field-container">
                                                <label htmlFor="name" className="form-label reqired-label">
                                                    Nombre: 
                                                </label>
                                                <Field className="form-control field" id="name" name="name" type="text"></Field>
                                                {errors.name && touched.name && (
                                                    <div style={{ color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.name}</div>
                                                )}
                                                    </div>
                                                <div> 
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-step">
                                            <div>
                                                <label htmlFor="surname" className="form-label reqired-label">
                                                    Apellido paterno: 
                                                </label>
                                                <Field className="form-control field" id="surname" name="surname" type="text"></Field>
                                                {errors.surname && touched.surname && (
                                                    <div style={{ color: 'red', fontSize: '12px', marginTop: '5px'}}>{errors.surname}</div>
                                                )}
                                                    </div>
                                                <div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} >
                                        <div className="field-container">
                                            <div>
                                                <label htmlFor="lastname" className="form-label">
                                                    Apellido materno: 
                                                </label>
                                                <Field className="form-control field" id="lastname" name="lastname" type="text"></Field>
                                                {errors.lastname && touched.lastname && (
                                                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.lastname}</div>
                                                )}
                                                    </div>
                                                <div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-step">
                                            <div>
                                                <label htmlFor="email" className="form-label reqired-label">
                                                    Correo: 
                                                </label>
                                                <Field className="form-control field" id="email" name="email" type="text"></Field>
                                                {errors.email && touched.email && (
                                                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.email}</div>
                                                )}
                                                    </div>
                                                <div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <div className="form-step">
                                            <div>
                                                <label htmlFor="password" className="form-label reqired-label">
                                                    Contraseña: 
                                                </label>
                                                <Field className="form-control field" id="password" name="password" type="password"></Field>
                                                {errors.password && touched.password && (
                                                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.password}</div>
                                                )}
                                                    </div>
                                                <div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-step">
                                            <div>
                                                <label htmlFor="repeatPass" className="form-label reqired-label">
                                                    Repetir contraseña: 
                                                </label>
                                                <Field className="form-control field" id="repeatPass" name="repeatPass" type="password"></Field>
                                                {errors.repeatPass && touched.repeatPass && (
                                                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.repeatPass}</div>
                                                )}
                                                    </div>
                                                <div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} className="text-center">
                                        <div className="form-buttons">
                                        <hr/>
                                            <Button className="btn-enviar" disabled={isSubmitting} type="submit">
                                                {isSubmitting ? 'Cargando...' : 'Guardar'}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            
            </Modal>
        </CSSTransition>
    )
}
