import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../../auth/components/login/Login.css'
import {
    MDBTabs, MDBTabsItem, MDBTabsLink, MDBTabsContent, MDBTabsPane, MDBBtn, MDBIcon, MDBInput, MDBCheckbox, MDBCardImage
  } from 'mdb-react-ui-kit';
import { Row, Col, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [repeatPasswor, setRepeatPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    return (
        <div className="p-3 my-2 h-35 w-50 main">
            <Row>
                <Col>   
                    <MDBTabsContent>
                        <form onSubmit={event => onAuth(event)} style={{ boxShadow: 'none' }}>
                            <Row>
                                <div className="d-flex justify-content-center">
                                    <Col lg={10}>
                                        <MDBInput wrapperClass='mb-4' label='Contraseña: ' id='form1' type='email'
                                        value={newPassword} onChange={text => setNewPassword(text.target.value)} />
                                    </Col>
                                </div>
                            </Row>
                            <Row>
                                <div className="d-flex justify-content-center">
                                    <Col lg={10}>
                                        <MDBInput wrapperClass='mb-4' label='Confirma la contraseña' id='form2' type='password'
                                        value={repeatPasswor} onChange={text => setRepeatPassword(text.target.value)} />
                                    </Col>
                                </div>
                            </Row>

                            <div className="d-flex justify-content-center mx-4 mb-4">
                            <MDBBtn className="mb-4 w-50" type='submit'>Restaurar</MDBBtn>
                            </div>
                        </form>
                    </MDBTabsContent>
                </Col>
            </Row>
        </div>
    )
}