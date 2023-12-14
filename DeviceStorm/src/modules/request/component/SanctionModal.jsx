import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-modal";
import * as Yup from 'yup';
import { CSSTransition } from "react-transition-group";
import '../style/SanctionModal.css';
import { sanction } from "../helpers/updateRequest";
import { Formik, Field, Form } from "formik";
import { createSanction } from "../../sanctions/helpers/createSanction";

export const SanctionModal = ({ open, onOpen, idR }) => {
    const [apiError, setApiError] = useState([]);
    const [idUser, setIdUser] = useState("");
    const [emailUser, setEmailUser] = useState("");
    const [returns, setReturns] = useState("");
    const [loading, setLoading] = useState(false);
    const [sanctionData, setSanctionData] = useState({});
    const [completeSanctionData, setCompleteSanctionData] = useState({});

    useEffect(() => {
        console.log('Valores de completeSanctionData:', idUser, emailUser, returns, sanctionData.description);
    }, [sanctionData]);

    const onSanction = (idUser, emailUser, returns) => {
        console.log('Datos recibidos:', idUser, emailUser, returns);

        setIdUser(idUser);
        setEmailUser(emailUser);
        setReturns(returns);

        setSanctionData({
            description: '', // Puedes establecer la descripción según sea necesario
        });

        // Imprime los valores de sanctionData después de setSanctionData
        console.log('Valores de sanctionData:', sanctionData);
    };

    const addSanction = async () => {
        console.log('Datos que se están pasando a createSanction:', {
            idUser: idUser,
            emailUser: emailUser,
            returns: returns,
            description: sanctionData.description,
        });

        try {
            const response = await createSanction({
                idUser: idUser,
                emailUser: emailUser,
                returns: returns,
                description: sanctionData.description,
            });
            console.log('Respuesta de createSanction:', response);
            handleCloseModal();
        } catch (err) {
            console.log("Error al enviar los datos :c", err);
        }
    };

    const handleCloseModal = () => {
        onOpen(false);
    };

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
                                    description: '',
                                }}
                                validationSchema={Yup.object().shape({
                                    description: Yup.string().required("Campo obligatorio"),
                                })}
                                onSubmit={async (values, { setSubmitting }) => {
                                    setSubmitting(true);
                                    try {
                                        await addSanction({
                                            ...sanctionData,
                                            description: values.description,
                                            idUser: sanctionData.idUser,
                                            emailUser: sanctionData.emailUser,
                                            returns: sanctionData.returns,
                                        });
                                        handleCloseModal();
                                    } catch (err) {
                                        console.log("Error al enviar los datos :c", err);
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                                    <Form
                                        style={{ padding: '0px', boxShadow: 'none', backgroundColor: 'white' }}
                                    >
                                        <div className="form-step">
                                            <div className="mb-3">
                                                <label htmlFor="description" className="form-label">
                                                    Sanción
                                                </label>
                                                <Field className="mt-4 form-control field" id="description" name="description" type="text"></Field>
                                                {errors.description && touched.description && (
                                                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.description}</div>
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