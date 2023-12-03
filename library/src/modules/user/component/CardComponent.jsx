import React, { useContext, useEffect, useState } from "react";
import "./Card.css";
import { Card, Row, Col, Button } from "react-bootstrap";
import { getUser } from "../../../user/helpers/getUser";
import { AuthContext } from "../../../auth/context/AuthContext";
import { LoadingComponent } from "../../../auth/components/loading/LoadingComponent";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { UpdateUser } from "./UpdateUser";
import { MDBBtn } from "mdb-react-ui-kit";
import { updateUser } from "../../../user/helpers/updateUser";
import { useNavigate } from "react-router-dom";
import { SomeProblems } from "../../../auth/pages/SomeProblems";
import { validateToken } from '../../../auth/helpers/validateToken';
import Swal from 'sweetalert2';


export const CardComponent = () => {
    const { user, logout } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({});
    const [errorApi, setErrorApi] = useState(false);


    const fillUser = async () => {
        setLoading(true)
        const resultToken = await validateToken();
        if (!(resultToken == true)) {
            logout();
        }
        const response = await getUser(user.id);
        if (response == "ERROR") {
            setErrorApi(true);
        } else {
            setData(response)
            setErrorApi(false);
            console.log(response);
        }
        setLoading(false);
    }
    useEffect(() => {
        fillUser()
    }, []);

    const onUpdateUser = async (data) => {
        console.log(data);
        const response = await updateUser(data)
        if (response === 'ERROR') {
            Swal.fire(
                'Error',
                'Ocurrió un error al realizar la transacción',
                'danger'
            );
        } else {
            Swal.fire(
                '¡Actualizado!',
                'El usuario ha sido actualizado correctamente.',
                'success'
            ).then(() => window.location.reload())
        }
    };

    const showConfirmationSwal = (data) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres guardar tus cambios?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            preConfirm: async () => {
                await onUpdateUser(data);
            }
        });
    }

    return (
        <div style={{ marginLeft: '200px' }}>

            {errorApi ? <SomeProblems /> : loading ?
                <LoadingComponent /> :
                (<Row>
                    <div className="col-11" >
                        <div className="div-image">
                            <div className="profile-image">
                            </div>
                        </div>
                        <div className="card author-bf-card custom-size">
                            <img
                                className="img-fluid rounded-circle mb-3"
                                src="https://th.bing.com/th/id/R.423055c39be588a1643ea7aeb1ac83be?rik=pT92QfdWkxqHnw&riu=http%3a%2f%2f2.bp.blogspot.com%2f_JXi92wDCOGk%2fTGF1W98DwWI%2fAAAAAAAABqI%2fjmXaiB8h0nE%2fs1600%2fAlice%2bdevice%2bcover2.jpg&ehk=VXhL6QjA0lhMfVeSufHlKhmV4xEvzHwDt1S0b4WZ%2bAE%3d&risl=&pid=ImgRaw&r=0"
                                alt="author-img"
                            />
                            <h5 className="mb-3">{data.name} {data.surname}</h5>
                            <div className="social-icons social-icons-sm mb-3">
                                <a
                                    className="social-icon"
                                    href="#facedevice"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fab fa-facedevice-f"></i>
                                </a>
                                <a
                                    className="social-icon"
                                    href="#twitter"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a
                                    className="social-icon"
                                    href="#linkedin"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>

                        <div className="card-custom" >
                            <Row>
                                <Col>
                                    <Card className="shadow mb-4">
                                        <Card.Body>
                                            <Row>
                                                <Formik
                                                    initialValues={{ name: data.name, surname: data.surname, career: data.career }}
                                                    validationSchema={
                                                        Yup.object().shape({
                                                            name: Yup.string().required("Nombre requerido"),
                                                            career: Yup.string().required("Carrera requerida")
                                                        })}
                                                    onSubmit={(values, { setSubmitting }) => {
                                                        setTimeout(() => {
                                                            showConfirmationSwal(values);
                                                        }, 400);
                                                    }}

                                                >
                                                    {({ isSubmitting, setFieldTouched, setSubmitting, setFieldError, touched, errors }) =>
                                                    (<Form>

                                                        <Card.Text>
                                                            <strong>Modificar datos</strong>
                                                        </Card.Text >

                                                        <Card.Text style={{ textAlign: 'left' }}>
                                                            <strong>Estatus:</strong> {data.status ? "Activo" : "Inactivo"}  {data.status ? (<FontAwesomeIcon icon={faCheckCircle} color="#28a745" />) :
                                                                (<FontAwesomeIcon icon={faTimesCircle} color="#dc3545" />)}
                                                        </Card.Text>
                                                        <Card.Text style={{ textAlign: 'left' }}>
                                                            <Field className='form-control' placeholder={data.name} name='name' />
                                                            {touched.name && errors.name && <div className="alert alert-danger error">{errors.name}</div>}
                                                        </Card.Text>
                                                        <Card.Text style={{ textAlign: 'left' }}>
                                                            <Field className='form-control' placeholder={data.surname} name='surname' />
                                                            {touched.surname && errors.surname && <div className="alert alert-danger error">{errors.surname}</div>}
                                                        </Card.Text>
                                                        <Card.Text style={{ textAlign: 'left' }}>
                                                            <Field className='form-control' placeholder={data.career} name='career' />
                                                            {touched.career && errors.career && <div className="alert alert-danger error">{errors.career}</div>}
                                                        </Card.Text>

                                                        <hr />
                                                        <MDBBtn variant="primary" type="submit" >Editar perfil</MDBBtn>

                                                    </Form>)}

                                                </Formik>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="shadow mt-3">
                                        <Card.Body>
                                            <Card.Title className="text-center mb-1">
                                                Correo electrónico
                                            </Card.Title>
                                            <Row>

                                                <Card.Text className="text-center">
                                                    <i className="bi bi-code-slash h4 mb-3"></i>
                                                    <br />
                                                    {data.email}
                                                </Card.Text>

                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Row>)
            }
        </div>
    );
};
