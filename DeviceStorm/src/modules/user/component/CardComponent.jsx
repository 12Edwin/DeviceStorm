import React, { useContext, useEffect, useState } from "react";
import "../style/Card.css";
import { Card, Row, Col, Button } from "react-bootstrap";
import { getUser } from "../helpers";
import { AuthContext } from "../../../auth/context/AuthContext";
import { LoadingComponent } from "../../../auth/components/loading/LoadingComponent";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { UpdateUser } from "./UpdateUser";
import { MDBBtn } from "mdb-react-ui-kit";
import { updateUser } from "../helpers";
import { useNavigate } from "react-router-dom";
import { SomeProblems } from "../../../auth/pages/SomeProblems";
import Swal from 'sweetalert2';


export const CardComponent = () => {
    const { user, logout } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({});
    const [errorApi, setErrorApi] = useState(false);


    const fillUser = async () => {
        setLoading(true)
        
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
        const payload = {
            name: data.name,
            surname: data.surname,
            lastname: data.lastname,
        }
        const response = await updateUser(data)
        if (response === 'ERROR') {
            Swal.fire(
                'Error',
                'Ocurrió un error al realizar la transacción',
                'error'
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
                            <FontAwesomeIcon
                                icon={faUser}
                                className="rounded-circle mb-1"
                                style={{fontSize: '30px'}}
                                alt="author-img"
                            />
                            <h5 className="mb-1">{data.name} {data.lastname} {data.surname}</h5>
                            <small className="mb-2">{data.email}</small>
                            <div className="social-icons social-icons-sm mb-1">
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
                                    <Card className="shadow mb-1">
                                        <Card.Body>
                                            <Row>
                                                <Formik
                                                    initialValues={{ name: data.name, surname: data.surname, lastname: data.lastname }}
                                                    validationSchema={
                                                        Yup.object().shape({
                                                            name: Yup.string().required("Nombre requerido"),
                                                            surname: Yup.string().required("Apellido materno requerido"),
                                                            lastname: Yup.string().required("Apellido paterno requerido"),
                                                        })}
                                                    onSubmit={(values, { setSubmitting }) => {
                                                        console.log("ola",values);
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
                                                        <Row>
                                                            <Col>
                                                                <Card.Text style={{ textAlign: 'left' }} className="mb-2">
                                                                    <strong>Estatus:</strong> {data.status ? "Activo" : "Inactivo"}  {data.status ? (<FontAwesomeIcon icon={faCheckCircle} color="#28a745" />) :
                                                                        (<FontAwesomeIcon icon={faTimesCircle} color="#dc3545" />)}
                                                                </Card.Text>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Card.Text style={{ textAlign: 'left' }}>
                                                                    <Field className='form-control mb-3' placeholder={data.name} name='name' id="name" />
                                                                    {touched.name && errors.name && <div className="alert alert-danger error">{errors.name}</div>}
                                                                </Card.Text>
                                                            </Col>
                                                        </Row>
                                                        
                                                        <Row>
                                                            <Col>
                                                                <Card.Text style={{ textAlign: 'left' }}>
                                                                    <Field className='form-control' placeholder={data.lastname} name='lastname' id="lastname" />
                                                                    {touched.lastname && errors.lastname && <div className="alert alert-danger error">{errors.lastname}</div>}
                                                                </Card.Text>
                                                            </Col>
                                                            <Col>
                                                                <Card.Text style={{ textAlign: 'left' }}>
                                                                    <Field className='form-control' placeholder={data.surname} name='surname' id="surname" />
                                                                    {touched.surname && errors.surname && <div className="alert alert-danger error">{errors.lastname}</div>}
                                                                </Card.Text>
                                                            </Col>
                                                        </Row>
                                                        <hr />
                                                        <MDBBtn variant="primary" type="submit" >Editar perfil</MDBBtn>

                                                    </Form>)}

                                                </Formik>
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
