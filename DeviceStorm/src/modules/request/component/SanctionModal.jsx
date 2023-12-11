import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-modal";
import * as Yup from 'yup';
import { CSSTransition } from "react-transition-group";
import '../style/SanctionModal.css';
import { sanction } from "../helpers/updateRequest";
import { Formik, Field, Form } from "formik";

export const SanctionModal = ({ open, onOpen, idR }) => {
    const [apiError, setApiError] = useState([]);

    const addSanction = async (sansion) => {
        try {
            const response = await sanction(idR, sansion);
            
        } catch (err) {
            console.log("Error al enviar los datos :c");
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
                    isOpen={open}
                    onRequestClose={handleCloseModal}
                    contentLabel="Sancionar"
                    className="modal-content"
                    overlayClassName="modal-overlay"
                >
                    <div className="modal-header">
                        <h4 className="text-center">
                            Sancionar la solicitud
                        </h4>
                        <button className="close-button" onClick={handleCloseModal}>X</button>
                    </div>
                    <div className="modal-body">
                        <div className="formulario-conatainer">
                            <Formik
                                initialValues={{
                                    sanction: '',

                                }}
                                validationSchema={Yup.object().shape({
                                    sanction: Yup.string().required("Campo obligatorio"),
                                })}
                                onSubmit={async (values, { setSubmitting }) => {
                                    setSubmitting(true);
                                    addSanction(values).then(()=>{window.location.reload(true)});
                                    setSubmitting(false);
                                }}
                            >
                                {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                                    <Form
                                        style={{ padding: '0px', boxShadow: 'none', backgroundColor: 'white' }}
                                    >
                                        <div className="form-step">
                                            <div className="mb-3">
                                                <label htmlFor="sanction" className="form-label">
                                                    Sanción
                                                </label>
                                                <Field className="mt-4 form-control field" id="sanction" name="sanction" type="text"></Field>
                                                {errors.sanction && touched.sanction && (
                                                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.sanction}</div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                            </div>
                                            <div className="form-buttons">
                                                <Button className="btn-enviar" disabled={isSubmitting} type="submit">
                                                    {isSubmitting ? 'Cargando...' : 'Enviar'}
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