import { useState, useEffect } from "react";
import { Button, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import '../style/CreateProduct.css'
import { getCategories } from "../helpers/boundary.js";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { insertdevice } from '../helpers/boundary.js'
import Swal from 'sweetalert2';
import { insertImage } from "../helpers/boundary.js";

export const CreateDevice = () => {
  const [formStep, setFormStep] = useState(1);
  const [apiError, setApiError] = useState(false);
  const [categories, setCategories] = useState([]);

  const nextStep = () => {
    setFormStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setFormStep((prevStep) => prevStep - 1);
  };

  useEffect(() => {
    fillCategories();
  }, []);

  const fillCategories = async () => {
    const response = await getCategories();
    if (response === 'ERROR') {
      setApiError(true);
    } else {
      setApiError(false);
      setCategories(response);
    }
  }

const addDevice = async (device) => {
  const { img, category, ...data } = device;
  const categor = categories.find(c => c.uid === category);

  if (formStep === 2) {
    try {
      console.log("Data to be sent to insertDevice:", {
        ...data,
        category: categor.uid,
        code: device.code,
        place: device.place,
        supplier: device.supplier,
      });

      const response = await insertDevice({
        ...data,
        category: categor.uid,
        code: device.code,
        place: device.place,
        supplier: device.supplier,
      });

      console.log("Response from insertDevice:", response);

      if (response === 'ERROR') {
        setApiError(true);
        resultFail();
      } else {
        setApiError(false);
        console.log(response);
        await uploadImage(response, img);
      }
    } catch (error) {
      console.error("Error in addDevice:", error);
      setApiError(true);
      resultFail();
    }
  }
};

const uploadImage = async (id, img) => {
  const formData = new FormData();
  formData.append('img', img); 
  try {
    console.log("Data to be sent to insertImage:", formData);

    const response = await insertImage(id, formData);

    console.log("Response from insertImage:", response);

    if (response === 'ERROR') {
      setApiError(true);
      resultFail();
    } else {
      setApiError(false);
      resultOk();
    }
  } catch (error) {
    console.error("Error in uploadImage:", error);
    setApiError(true);
    resultFail();
  }
};

  const resultOk = () => {
    Swal.fire({
      title: 'Tarea completada!',
      text: 'Felicidades, has creado un nuevo dispositivo.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  }
  const resultFail = () => {
    Swal.fire({
      title: 'Error!',
      text: 'Ups, ha ocurrido un error con la transacción, checa que el nombre no sea identico a los que ya tienes.',
      icon: 'danger',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
    });
  }

  return (
    <Row>

      <div className="col-6" style={{ paddingLeft: "300px" }}>
        <div className="content" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div className="device" style={{ borderRadius: "0.75rem", height: '15rem', width: '15rem' }}>
            <img src="https://cdn-icons-png.flaticon.com/512/223/223127.png" style={{ width: '100%', height: '100%' }} alt="" />
            <span className="icon">
              <i className="fas"><FontAwesomeIcon icon={faUpload} /></i>
            </span>
          </div>
        </div>
      </div>
      <div className="formulario-container col-5 m-4">

        <Formik
          initialValues={{
            name: '',
            created_at: '',
            category: '',
            code: '',
            place: '',
            supplier: '',
            stock: '',
            img: null,
            available: true,
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Campo obligatorio"),
            created_at: Yup.date().max(new Date(), "La fecha debe ser menor a la de hoy").required('Debe ingresar una fecha válida'),
            category: Yup.string().required("Campo obligatorio"),
            code: Yup.string().required("Campo obligatorio"),
            place: Yup.string().required("Campo obligatorio"),
            supplier: Yup.string().required("Campo obligatorio"),
            
            img: Yup.mixed().test(
              'fileSize',
              'El archivo es demasiado grande',
              value => value && value.size <= 5000000
            ).test(
              'fileType',
              'Solo se permiten archivos de imagen',
              value => value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
            ),
          })}

          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            if (formStep === 1) {
              nextStep(); 
            } else if (formStep === 2) {
              await addDevice(values); 
              setSubmitting(false);
            }
          }}
        >

          {({ submitForm, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <h2 className="text-center">Crea un nuevo dispositivo</h2>
              {formStep === 1 && (
                <div className="form-step">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nombre del dispositivo
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="name"
                      name='name'
                      placeholder="Ingrese el nombre del dispositivo"
                    />
                    {errors.name && touched.name && <div style={{ color: 'red', fontSize: '12px' }}>{errors.name}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="publicacion" className="form-label">
                      Publicación
                    </label>
                    <Field
                      type="date"
                      className="form-control"
                      id="created_at"
                      name='created_at'
                      placeholder="Ingrese la fecha de publicación"
                    />
                    {errors.created_at && touched.created_at && <div style={{ color: 'red', fontSize: '12px' }}>{errors.created_at}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">
                      Código
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="code"
                      name='code'
                      placeholder="Ingrese el código del dispositivo"
                    />
                    {errors.code && touched.code && <div style={{ color: 'red', fontSize: '12px' }}>{errors.code}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      Categoría
                    </label>
                    <Field type='select' name="category" as="select" className={`form-control ${errors.category && touched.category ? 'is-invalid' : ''}`}>
                      {categories.map(category => (
                        <>
                          <option value="">Selecciona una opción</option>
                          <option key={category.uid} value={category.uid}>{category.name}</option>
                        </>
                      ))
                      }
                    </Field>
                    {errors.category && touched.category && <div style={{ color: 'red', fontSize: '12px' }}>{errors.category.name}</div>}
                  </div>
                  <Button className="btn-siguiente" onClick={nextStep}>
                    Siguiente
                  </Button>
                </div>
              )}
              {formStep === 2 && (
                <div className="form-step">
                  <div className="mb-3">
                    <label htmlFor="imagen" className="form-label">
                      Imagen del dispositivo
                    </label>
                    <div className="input-group">
                      <Field name="img">
                        {({ field, form }) => (
                          <div>
                            <input
                              type="file"
                              id="imagen"
                              onChange={event => {
                                form.setFieldValue('img', event.currentTarget.files[0]);
                              }}
                            />
                          </div>
                        )}
                      </Field>
                      <label className="input-group-text" htmlFor="imagen">
                        <FontAwesomeIcon icon={faUpload} />
                      </label>
                      {errors.img && touched.img && <div style={{ color: 'red', fontSize: '12px' }}>{errors.img}</div>}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="supplier" className="form-label">
                      Supplier
                    </label>
                    <Field type="text" className="form-control" id="supplier" name="supplier" />
                    <ErrorMessage name="supplier" component="div" className="error-message" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="stock" className="form-label">
                      Stock
                    </label>
                    <Field type="number" className="form-control" id="stock" name="stock" />
                    <ErrorMessage name="stock" component="div" className="error-message" />
                  </div>
                  
                  <div className="form-buttons">
                    {formStep === 1 && (
                      <Button className="btn-siguiente" onClick={submitForm}>
                        Siguiente
                      </Button>
                    )}
                    {formStep === 2 && (
                      <>
                        <Button className="btn-atras" disabled={isSubmitting} onClick={prevStep}>
                          Atrás
                        </Button>
                        <Button className="btn-enviar" disabled={isSubmitting} onClick={submitForm}>
                          {isSubmitting ? 'Cargando...' : 'Enviar'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

              )}
            </Form>)}
        </Formik>
      </div>

    </Row>
  );
}