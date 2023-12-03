import {
  MDBTabs, MDBTabsItem, MDBTabsLink, MDBTabsContent, MDBTabsPane, MDBBtn, MDBIcon, MDBInput, MDBCheckbox
} from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './Login.css'
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

export const LoginComponent = ({ onData, onRegister }) => {
  const [justifyActive, setJustifyActive] = useState('tab1');;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [errRegister, setErrRegister] = useState("");

  const onAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    await onData({ email, password, setLoading, setErrors });
  }


  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  return (

    <div className="p-3 my-5 d-flex flex-column w-50 main">

      <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>

        <MDBTabsPane show={justifyActive === 'tab1'} >

          <div className="text-center mb-3" >
            <p>Sign in with:</p>

            <div className='d-flex justify-content-between mx-auto' style={{ width: '40%' }}>
              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='facedevice-f' size="sm" />
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='twitter' size="sm" />
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='google' size="sm" />
              </MDBBtn>

              <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                <MDBIcon fab icon='github' size="sm" />
              </MDBBtn>
            </div>

            <p className="text-center mt-3">or:</p>
          </div>
          {errors && <div className="alert alert-danger" style={{ textAlign: "center" }}>{errors}</div>}

          <form onSubmit={event => onAuth(event)} style={{boxShadow:'none' }}>

            <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email'
              value={email} onChange={text => setEmail(text.target.value)} />
            <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password'
              value={password} onChange={text => setPassword(text.target.value)} />

            <div className="d-flex justify-content-between mx-4 mb-4">
              <a href="!#">Forgot password?</a>
            </div>

            <MDBBtn className="mb-4 w-100" type='submit'> {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Sign in"}</MDBBtn>
          </form>

          <p className="text-center">Not a member? <a href="#!">Register</a></p>

        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab2'}>

          <Formik
            initialValues={{ name: '', lastname: '',surname: '', email: '', password: '', repeatPass: '' }}
            validationSchema={
              Yup.object().shape({
                name: Yup.string().required("Nombre requerido"),
                lastname: Yup.string().required("Apellido paterno es requerido"),
                surname: Yup.string(),
                email: Yup.string().email("Correo inválido").required("Correo requerido"),
                password: Yup.string().min(6, "El mínimo es de 6 caracteres").required("Contraseña requerdia"),
                repeatPass: Yup.string().oneOf([Yup.ref('password')], "Contraseñas desiguales").required("Contraseñas desiguales")
              })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                onRegister({ ...values, setErrRegister, setSubmitting })
              }, 400);
            }}
          >

            {({ isSubmitting, setFieldTouched, setFieldError, touched, errors }) =>
            (<Form style={{boxShadow:'none' }}>
              {errRegister && (<div className='alert alert-danger' style={{ textAlign: "center" }}>{errRegister}</div>)}

              <Row>
                <Col lg={6} md={6} sm={12}>
                  <div className="field-container">
                    <Field className='mt-4 form-control field' id='name' name='name' type='text' />
                    <label htmlFor='name' className="animated-label reqired-label">Nombre:</label>
                    {touched.name && errors.name && <div className="alert alert-danger error">{errors.name}</div>}
                  </div>
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <div className="field-container">
                    <Field className='mt-4 form-control field' id='lastname' name='lastname' type='text' />
                    <label htmlFor='lastname' className="animated-label reqired-label">Apellido paterno:</label>
                    {touched.lastname && errors.lastname && <div className="alert alert-danger error">{errors.lastname}</div>}
                  </div>
                </Col>
              </Row>
              <Row>
              <Col lg={6} md={6} sm={12}>
                  <div className="field-container">
                    <Field className='mt-4 form-control field' id='surname' name='surname' type='text' />
                    <label htmlFor='surname' className="animated-label">Apellido Materno:</label>
                    {touched.surname && errors.surname && <div className="alert alert-danger error">{errors.surname}</div>}
                  </div>
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <div className="field-container">
                    <Field className='mt-4 form-control field' id='email' name='email' type='email' />
                    <label htmlFor='email' className="animated-label reqired-label">Correo electronico: </label>
                    {touched.email && errors.email && <div className="alert alert-danger error">{errors.email}</div>}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={12}>
                  <div className="field-container">
                    <Field className='mt-4 form-control field' id='password' name='password' type='password' />
                    <label htmlFor='password' className="animated-label reqired-label">Contraseña: </label>
                    {touched.password && errors.password && <div className="alert alert-danger error">{errors.password}</div>}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="field-container">
                    <Field className='mt-4 form-control field' id='repeatPass' name='repeatPass' type='password' />
                    <label htmlFor='repeatPass' className="animated-label reqired-label">Repetir password:</label>
                    {touched.repeatPass && errors.repeatPass && <div className="alert alert-danger error">{errors.repeatPass}</div>}
                  </div>
                </Col>
              </Row>
              <MDBBtn className="mt-4 w-100" type='submit' disabled={isSubmitting}>{isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : "Sign up"}</MDBBtn>

            </Form>)}

          </Formik>

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