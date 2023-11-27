import { useState, useEffect } from "react";
import { Button, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faUpload, fadeviceReader } from "@fortawesome/free-solid-svg-icons";
import './CreateProduct.css'
import { getCategories } from "../../../helpers/getCategories";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { insertdevice } from '../../../helpers/insertdevice'
import Swal from 'sweetalert2';
import { insertImage } from "../../../helpers/insertImage";

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

  const adddevice = async (device) => {
    const { img, category, ...data } = device;
    const categor = categories.find(c => c.uid === category);
    const response = await insertdevice({...data, category: categor});
    if (response === 'ERROR') {
      setApiError(true);
      resultFail();
    } else {
      setApiError(false);
      console.log(response);
      await uploadImage(response,img);
    }
  }

  const uploadImage = async (id,img) =>{
    const response = await insertImage(id,img);
    if (response === 'ERROR') {
      setApiError(true);
      resultFail();
    } else {
      setApiError(false);
      resultOk();
    }
  }

  const resultOk = () => {
    Swal.fire({
      title: 'Tarea completada!',
      text: 'Felicidades, has creado un nuevo libro.',
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
              <i className="fas"><FontAwesomeIcon icon={fadeviceReader} /></i>
            </span>
          </div>
        </div>
      </div>
      <div className="formulario-container col-5 m-4">

        <Formik
          initialValues={{ name: '', author: '', publication: '', resume: '', editorial: '', price: 0, category: '' }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Campo obligatorio"),
            author: Yup.string().required("Campo obligatorio"),
            publication: Yup.date().max(new Date(), "La fecha debe ser menor a la de hoy").required('Debe ingresar una fecha válida'),
            resume: Yup.string().required("Campo obligatorio"),
            editorial: Yup.string().required("Campo obligatorio"),
            price: Yup.number().required("Campo obligatorio"),
            category: Yup.string().required("Campo obligatorio"),

            img: Yup.mixed().test(
              'fileSize',
              'El archivo es demasiado grande',
              value => value && value.size <= 5000000 // 5MB
            ).test(
              'fileType',
              'Solo se permiten archivos de imagen',
              value => value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
            )

          })
          }

          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await adddevice(values);
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <h2 className="text-center">Crea un nuevo libro</h2>
              {formStep === 1 && (
                <div className="form-step">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                      Título del libro
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="nombre"
                      name='name'
                      placeholder="Ingrese el nombre del producto"
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
                      id="publicacion"
                      name='publication'
                      placeholder="Ingrese la fecha de publicación"
                    />
                    {errors.publication && touched.publication && <div style={{ color: 'red', fontSize: '12px' }}>{errors.publication}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">
                      Reseña
                    </label>
                    <Field name="resume">
                      {({ field, form }) => (
                        <div>
                          <textarea className="form-control form"
                            {...field}
                            placeholder="Escribe una breve reseña"
                          />
                          <ErrorMessage name="message" />
                        </div>
                      )}
                    </Field>
                    {errors.resume && touched.resume && <div style={{ color: 'red', fontSize: '12px' }}>{errors.resume}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="categoria" className="form-label">
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
                      Imagen del libro
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
                    <label htmlFor="precio" className="form-label">
                      Precio
                    </label>
                    <Field
                      type="number"
                      className="form-control"
                      id="precio"
                      name='price'
                      placeholder="Ingrese el precio del producto"
                    />
                    {errors.price && touched.price && <div style={{ color: 'red', fontSize: '12px' }}>{errors.price}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="author" className="form-label">
                      Autor
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="author"
                      name='author'
                      placeholder="Ingrese el autor"
                    />
                    {errors.author && touched.author && <div style={{ color: 'red', fontSize: '12px' }}>{errors.author}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editorial" className="form-label">
                      Editorial
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="editorial"
                      name='editorial'
                      placeholder="Ingrese la editorial"
                    />
                    {errors.editorial && touched.editorial && <div style={{ color: 'red', fontSize: '12px' }}>{errors.editorial}</div>}
                  </div>
                  <div className="form-buttons">
                    <Button className="btn-atras" disabled={isSubmitting} onClick={prevStep}>
                      Atrás
                    </Button>
                    <Button className="btn-enviar" disabled={isSubmitting} type="submit">
                      {isSubmitting ? 'Cargando...' : 'Enviar'}
                    </Button>
                  </div>
                </div>

              )}
            </Form>)}
        </Formik>
      </div>

    </Row>
  );
}

