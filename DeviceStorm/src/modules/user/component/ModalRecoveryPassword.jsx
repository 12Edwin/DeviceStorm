import React from 'react';
import '../style/Card.css'
import { Formik, Field, Form, useFormik} from "formik";
import {sendRecoveryPasswordEmail} from "../helpers/sendRecoveryPasswordEmail"
import { Button, Col, Modal, Row} from "react-bootstrap";
import * as yup from "yup";
import Swal from 'sweetalert2';
export const ModalRecoveryPassword = ({open, onOpen}) =>{
    const handleCloseModal = () => {
        onOpen(false);
    }

    const onEmailEntered = async (email) =>{
        try {
            const response = await sendRecoveryPasswordEmail(email);
            const {status, data:{message}} = response
            if(status === 200){
                switch(message){
                    case "Correo enviado":
                        resultOk()
                        break
                    case "Usuario no encontrado":
                        resultFail("El usuario no existe")
                        break   
                }
            }else{
                resultFail("Error al enviar el correo")
            }
        } catch (error) {
            console.log("error",error)
        }
    }

    const resultFail = (text) => {
        Swal.fire({
            title: 'Error!',
            text,
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3000
        });
      }
    
    const resultOk = () => {
        Swal.fire({
            title: 'Tarea completada!',
            text: 'Hemos enviado un correo con las instrucciones para recuperar tu contraseña',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
            timer: 3000
        })
    }
    return (
        <div>
            <Modal
                backdrop="static"
                keyboard={false}
                show={open}
                onHide={handleCloseModal}
            >
                <div className="modal-header">
                    <h4 className="text-center">Recuperación de contraseña</h4>
                    <button className="close-button" onClick={handleCloseModal}>
                        X
                    </button>
                </div>
                <div className="modal-body">
                    <div className='form-container'>
                        <Formik
                            initialValues={{
                                email: '',
                            }}
                            validationSchema={yup.object().shape({
                                email: yup.string().email('Formato Incorrecto').required("Ingresa un correo válido"),
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                setSubmitting(true);
                                onEmailEntered(values.email);
                                setSubmitting(false);
                                handleCloseModal();
                            }}
                        >
                            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                                <Form
                                style={{ padding: '0px', boxShadow: 'none', backgroundColor: 'white' }}
                                >
                                    <Row>
                                        <Col md={12}>
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
                                        <Col md={12} className="text-center">
                                            <div className="form-buttons">
                                            <hr/>
                                                <Button className="btn-enviar w-100" disabled={isSubmitting} type="submit">
                                                    {isSubmitting ? 'Generando claves de acceso...' : 'Enviar correo'}
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
        </div>
    )
}