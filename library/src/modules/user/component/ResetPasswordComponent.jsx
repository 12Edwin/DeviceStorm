import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../../auth/components/login/Login.css'
import {MDBBtn, MDBInput, MDBCheckbox, MDBCardImage} from 'mdb-react-ui-kit';
import { Row, Col } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {resetPassword} from "../helpers/resetUserPassword"
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [errRegister, setErrRegister] = useState("");
    const [checked, setChecked] = useState(false);

    const handleResetPassword = async (credentials) => {
        try {
           const response = await resetPassword(credentials);
           if(response.status === 200){
               Swal.fire({
                    title: 'Contraseña cambiada',
                    text: 'Se ha cambiado la contraseña exitosamente',
                    icon: 'success',
                    timer: 3000,
                    showCancelButton: false,
                    showConfirmButton: false
               }).then(() =>{
                navigate("/login");
               }) 
           }else{
                setErrRegister(response.message);
           }
            
        } catch (error) {
            setErrRegister(error.message);
        }
    }

    const showPassword = (checked) =>{
        return checked ? "text" : "password";
    }
    return (
        <div className="p-3 my-2 h-35 w-50 main">
            <Row>
                <Col>
                    <div className='d-flex justify-content-center'>
                        <MDBCardImage
                            src='/src/assets/img/reset.jpg'
                            className='img-fluid'
                            style={{ width: '32%', height: '32%' }}
                            alt='login'
                        >
                        </MDBCardImage>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Formik
                        initialValues={{newPassword: "",repeatPassword: "",}}
                        validationSchema={Yup.object().shape({
                            newPassword: Yup.string().length(6, 'La contraseña debe tener 6 caracteres').required('Debe ingresar una contraseña'),
                            repeatPassword: Yup.string().oneOf([Yup.ref('newPassword')], "Contraseñas desiguales").required("Debe confirmar la contraseña")
                        
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            setSubmitting(true);
                            handleResetPassword({token, password: values.newPassword});
                        }}
                    >
                        {({ isSubmitting, setFieldTouched, setFieldError, touched, errors }) => (
                            <Form style={{ boxShadow: 'none' }}>
                              {errRegister && (<div className='alert alert-danger' style={{ textAlign: "center" }}>{errRegister}</div>)}
                              <div className='mb-4'>
                                <Field className='form-control' name='newPassword' id="newPassword">
                                  {({ field }) => (
                                    <MDBInput
                                      {...field}
                                      wrapperClass='mb-4'
                                      label='Contraseña'
                                      id='form1'
                                      type={showPassword(checked)}
                                    />
                                  )}
                                </Field>
                                {touched.newPassword && errors.newPassword && <div className='alert alert-danger error'>{errors.newPassword}</div>}
                              </div>
                        
                              <div className='mb-4'>
                                <Field className='form-control' name='repeatPassword' id="repeatPassword">
                                  {({ field }) => (
                                    <MDBInput
                                      {...field}
                                      wrapperClass='mb-4'
                                      label='Confirmar contraseña'
                                      id='form2'
                                      type={showPassword(checked)}
                                    />
                                  )}
                                </Field>
                                {touched.repeatPassword && errors.repeatPassword && <div className='alert alert-danger error'>{errors.repeatPassword}</div>}
                               <Row>
                                    <Col ls={12} md={6}>
                                        <MDBCheckbox
                                            id='controlledCheckbox'
                                            label='Mostrar contraseñas'
                                            checked={checked}
                                            onChange={() => {setChecked(!checked)}}
                                        />
                                    </Col>
                               </Row>

                              </div>
                              <Row>
                                <Col className="text-center">
                                <MDBBtn className="mt-2 w-100" type='submit' disabled={isSubmitting}>{isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : "Restaurar"}</MDBBtn>
                                </Col>
                              </Row> 
                            </Form>
                          )}
                    </Formik>
                </Col>
            </Row>
        </div>
    )
}