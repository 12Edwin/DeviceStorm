import {
  MDBTabs, MDBTabsItem, MDBTabsLink, MDBTabsContent, MDBTabsPane, MDBBtn, MDBIcon, MDBInput, MDBCheckbox, MDBCardImage
} from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as Yup from 'yup';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './Login.css'
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {ModalRecoveryPassword} from '../../../modules/user/component/ModalRecoveryPassword';
import {useFormik} from "formik";
import * as yup from "yup";

export const LoginComponent = ({ onData, onRegister }) => {
  const [justifyActive, setJustifyActive] = useState('tab1');;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [errRegister, setErrRegister] = useState("");
  const [show, setShow] = useState(false);

  const onAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    await onData({ email, password, setLoading, setErrors });
    setShow(false);
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
        setShow(true);
        onRegister({ ...values, setErrRegister, setSubmitting })
        setSubmitting(false);
    }
})


  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  const onChange = (event) => {
    
  }

  return (

    <div className="p-3 my-2 d-flex flex-column w-50 main">
      <Row>
          <Col>
            <div>
              <div className='d-flex justify-content-center'>
                <MDBCardImage
                  src='/src/assets/img/compt.png'
                  className='img-fluid'
                  style={{ width: '32%', height: '32%' }}
                  alt='login'
                >
                </MDBCardImage>
              </div>
            </div>
          </Col>
        </Row>
      <MDBTabs pills justify className='mb-2 d-flex flex-row justify-content-between'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            Iniciar sesión
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            Registrar
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={justifyActive === 'tab1'} >
          {errors && <div className="alert alert-danger" style={{ textAlign: "center" }}>{errors}</div>}

          <form onSubmit={event => onAuth(event)} style={{boxShadow:'none' }}>

            <MDBInput wrapperClass='mb-4' label='Correo electrónico' id='form1' type='email'
              value={email} onChange={text => setEmail(text.target.value)} />
            <MDBInput wrapperClass='mb-4' label='Contraseña' id='form2' type='password'
              value={password} onChange={text => setPassword(text.target.value)} />

            <div className="d-flex justify-content-center mx-4 mb-4">
              <Button variant='link'onClick={() => setOpen(true)}>Olvide mi contraseña</Button>
              <ModalRecoveryPassword
                open={open}
                onOpen={() => setOpen(false)}
              />
            </div>
            
            <MDBBtn className="mb-4 w-100" type='submit'> {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Iniciar sesión"}</MDBBtn>
          </form>
        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab2'}>
            <Form onSubmit={(event)=> form.handleSubmit(event)}>
                {errRegister && <div className="alert alert-danger" style={{ textAlign: "center" }}>{errRegister}</div>}
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
                  <Button className="mt-4 w-100" type='submit' variant='primary' disabled={show}> {show ? <FontAwesomeIcon icon={faSpinner} spin /> : "Registrarte"}</Button>
                </Modal.Footer>
            </Form>
        </MDBTabsPane>

      </MDBTabsContent>

    </div>
  );
}


LoginComponent.propTypes = {
  title: PropTypes.string.isRequired
}

LoginComponent.defaultProps = {
  title: "Hola mundo"
}