import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button } from "react-bootstrap";
import  Modal  from "react-modal";
import * as Yup from 'yup';
import { getdevices } from "../../device/helpers";
import { CSSTransition } from "react-transition-group";

import '../style/RequestModal.css';
import { createRequest } from "../helpers/createRequest";

export const RequestModal = ({open,onOpen, email}) => {
    const [devices, setDevices] = useState([]);
    const [apiError, setApiError] = useState([]);  
    useEffect(()=> {
        fillDevices();
    },[])



    const fillDevices = async () => {
        const response = await getdevices();
        if (response === 'ERROR') {
            setApiError(true);
            console.log("Error");
        } else {
            setApiError(false);
            setDevices(response.devices);
        }
        console.log(devices);
    }

    const addRequest = async(request) => {
        try{
            const response = await createRequest(request);
        } catch(err) {
            console.log("Error al enviar datos :C");
        }
    }
    const handleCloseModal = () => {
        onOpen(false);
    }
    return (
        <div>
            <CSSTransition
            in={open}
            timeout={300}
            classNames="modal"
            unmountOnExit>
                <Modal
                isOpen = {open}
                onRequestClose={handleCloseModal}
                contentLabel="Nueva Solicitud"
                className = "modal-content"
                overlayClassName = "modal-overlay"
                >
                    <div className="modal-header">
                        <h4 className="text-center">
                            Registra una nueva solicitud
                        </h4>
                        <button className="close-button" onClick={handleCloseModal}>X</button>                        
                    </div>
                    <div className="modal-body">
                        <div className="formulario-conatainer">
                            <Formik
                            initialValues={{
                                device: '',
                                returns: '',

                            }}
                            validationSchema={Yup.object().shape({
                                device: Yup.string().required("Campo obligatorio"),
                                returns: Yup.date().min(new Date(), "La fecha debe ser mayor a la actual").required("DebeIngresar una fecha válida")
                            })}
                            onSubmit={async(values,{ setSubmitting}) => {
                                setSubmitting(true);
                                addRequest(values);
                                setSubmitting(false);
                            }}
                            >
                                {({values, errors, touched, isSubmitting, setFieldValue})=>(
                                    <Form
                                        style={{padding:'0px', boxShadow:'none', backgroundColor:'white'}}
                                    >
                                        <div className="form-step">
                                            <div className="mb-3">
                                                <label htmlFor="device" className="form-label">
                                                    Device
                                                </label>
                                                <Field
                                                    type="select"
                                                    name="device"
                                                    as="select"
                                                    className={`form-control ${errors.device && touched.device ? 'is-invalid' : ''}`}
                                                >
                                                    <option value="">Selecciona una opción</option>
                                                    {devices.map(dev => (
                                                        <option key={dev.uid} value={dev.uid}>
                                                            {dev.name}
                                                        </option>
                                                    ))}
                                                </Field>                                                
                                                {errors.device && touched.device && (
                                                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.device}</div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="returns" className="form-label">Fecha de Regreso</label>
                                                <Field
                                                    type="date"
                                                    className="form-control"
                                                    id="returns"
                                                    name="returns"
                                                    placeholder="Ingresa la fecha de devolución"
                                                />
                                                {errors.returns && touched.returns && <div style={{ color: 'red', fontSize: '12px' }}>{errors.returns}</div>}
                                            </div>
                                            <div className="form-buttons">
                                                <Button className="btn-enviar" disabled={isSubmitting} type="submit">
                                                    {isSubmitting ? 'Cargando...':'Enviar'}
                                                </Button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </Modal>
            </CSSTransition>
        </div>
    )
}
