import {useFormik} from 'formik';
import {useEffect, useState} from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import * as Yup from 'yup';
import {getCategories, getPlaces, getSuppliers, insertdevice, updatedevice} from '../helpers/boundary.js';
import {insertImage} from '../helpers/boundary.js'
import Swal from 'sweetalert2';

import '../style/ModalEdit.css';
import {MDBFile, MDBInput} from "mdb-react-ui-kit";

export const DeviceEditModal = ({show, setShow, data}) => {

    const [formStep, setFormStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([])
    const [places, setPlaces] = useState([])
    const [apiError, setApiError] = useState(false);
    const [class1, setClass1] = useState("form-steps display-steps");
    const [class2, setClass2] = useState("form-steps");

    const nextStep = () => {
        setClass1(prev => prev.replace(' display-steps', ''))
        setClass2(prev => prev + ' display-steps')
    };

    const prevStep = () => {
        setClass2(prev => prev.replace(' display-steps', ''))
        setClass1(prev => prev + ' display-steps')
    };

    const resetForm = (value = '')=>{
        formik.values.name = ''
        formik.values.total = 0
        formik.values.supplier = ''
        formik.values.category = ''
        formik.values.place = ''
        formik.values.img = ''
        formik.resetForm()
        formik.handleReset()
        setShow(value)
    }

    useEffect(() => {
        formik.handleReset()
        if (show) {
            fillCategories();
            fillSuppliers();
            fillPlaces();
        }

        if (data && show) {
            formik.values.name = data.name
            formik.values.total = data.total
            formik.values.supplier = data.supplier
            formik.values.category = data.category
            formik.values.place = data.place
            formik.values.img = data.img
        } else {
            formik.values.name = ''
            formik.values.total = 0
            formik.values.supplier = ''
            formik.values.category = ''
            formik.values.place = ''
            formik.values.img = ''
        }
    }, [show]);

    const fillCategories = async () => {
        const response = await getCategories();
        if (typeof (response) === 'string') {
            resultFail(response)
        } else {
            setCategories(response);
        }
    }

    const fillSuppliers = async () => {
        const response = await getSuppliers();
        if (typeof (response) === 'string') {
            resultFail(response)
        } else {
            setSuppliers(response);
        }
    }

    const fillPlaces = async () => {
        const response = await getPlaces();
        if (typeof (response) === 'string') {
            resultFail(response)
        } else {
            setPlaces(response);
        }
    }

    const onUpdate = async (device) => {
        const {img, ...fields} = device;
        const response = await updatedevice(data.uid, fields);
        if (typeof (response) === 'string') {
            resultFail(response);
        } else {
            await uploadImage(data.uid, img);
        }
    }

    const onRegister = async (device) => {
        const {img, ...fields} = device;
        console.log(fields)
        const response = await insertdevice(fields);
        if (typeof (response) === 'string') {
            resultFail(response);
        } else {
            await uploadImage(response.uid, img);
        }
    }

    const uploadImage = async (id, img) => {
        const response = await insertImage(id, img);
        if (typeof (response) === 'string') {
            resultFail(response);
        } else {
            setApiError(false);
            resultOk("Dispositivo guardado correctamente");
        }
    }

    const resultOk = (text) => {
        Swal.fire({
            title: 'Tarea completada!',
            text: text,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then(() => resetForm('reload'));
    }
    const resultFail = (text) => {
        Swal.fire({
            title: 'Error!',
            text: text,
            icon: 'danger',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK',
        });
    }

    const onConfirm = (val) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: data ? 'Quieres actualizar este dispositivo' : 'Quieres registrar un nuevo dispositivo',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            async preConfirm(inputValue) {
                if (data) {
                    await onUpdate(val)
                } else {
                    await onRegister(val)
                }

            }
        })
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            total: 0,
            supplier: '',
            category: '',
            place: '',
            img: '',
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("El nombre es requerido"),
            total: Yup.number().required('La cantidad de unidades es requerida'),
            supplier: Yup.string().required("El proveedor es requerido"),
            category: Yup.string().required("La categoría es requerida"),
            place: Yup.string().required("El almacen es requerido"),
            img: Yup.mixed().test(
                'fileSize',
                'El archivo es demasiado grande',
                value => value && value.size <= 5000000 // 5MB
            ).test(
                'fileType',
                'Solo se permiten archivos de imagen',
                value => value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
            )
        }),
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            await onConfirm(values)
            setSubmitting(false)
        },
    });

    return (
        <Modal show={show} onHide={resetForm} centered>
            <Form onSubmit={(event) => formik.handleSubmit(event)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Editar Dispositivo
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="formulario-container">
                        {formStep === 1 && (
                            <div className={class1}>
                                    <Form.Group className="mb-3">
                                        <MDBInput label='Nombre' id='name' type='text'
                                                  className="form-control"
                                                  placeholder="Ingrese el nombre del dispositivo"
                                                  onChange={formik.handleChange}
                                                  onBlur={formik.handleBlur}
                                                  value={formik.values.name}
                                        />
                                        {formik.errors.name && formik.touched.name &&
                                            <div style={{color: 'red', fontSize: '12px'}}>{formik.errors.name}</div>}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <MDBInput label='Número de unidades' id='total' type='number'
                                                  className="form-control"
                                                  placeholder="Ingrese el número de unidades"
                                                  onChange={formik.handleChange}
                                                  onBlur={formik.handleBlur}
                                                  value={formik.values.total}
                                        />
                                        {formik.errors.total && formik.touched.total && <div
                                            style={{color: 'red', fontSize: '12px'}}>{formik.errors.total}</div>}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <select className="form-control" id='supplier'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.supplier}>
                                            <option value="">Seleccione un proveedor</option>
                                            {suppliers.map((item, ind) => (
                                                <option value={item.uid} key={ind}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.errors.supplier && formik.touched.supplier &&
                                            <div
                                                style={{color: 'red', fontSize: '12px'}}>{formik.errors.supplier}</div>}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <select name="category" id="category" className="form-control"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.category}>
                                            <option value="">Selecciona una categoría</option>
                                            {categories.map(category => (
                                                <option key={category.uid}
                                                        value={category.uid}>{category.name}</option>
                                            ))}
                                        </select>
                                        {formik.errors.category && formik.touched.category && <div style={{
                                            color: 'red',
                                            fontSize: '12px'
                                        }}>{formik.errors.category}</div>}
                                    </Form.Group>
                                <Button className="btn-siguiente" onClick={nextStep}>
                                    Siguiente
                                </Button>
                            </div>
                        )}
                        {(
                            <div className={class2}>
                                    <Form.Group className="mb-3">
                                        <MDBFile label='Imagen del dispositivo' id='image' onChange={event => {
                                            formik.setFieldValue('img', event.currentTarget.files[0])
                                        }}/>
                                        {formik.errors.img && formik.touched.img && <div
                                            style={{color: 'red', fontSize: '12px'}}>{formik.errors.img}</div>}
                                    </Form.Group>
                                <div className="mb-3">
                                    <Form.Group className="mb-3">
                                        <select name="place" id="place" className="form-control"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.place}>
                                            <option value="">Selecciona un almacen</option>
                                            {places.map(place => (
                                                <option key={place.uid}
                                                        value={place.uid}>{place.name}</option>
                                            ))}
                                        </select>
                                        {formik.errors.place && formik.touched.place && <div style={{
                                            color: 'red',
                                            fontSize: '12px'
                                        }}>{formik.errors.place}</div>}
                                    </Form.Group>
                                </div>
                                <div className="form-buttons">
                                    <Button className="btn-atras" disabled={formik.isSubmitting}
                                            onClick={prevStep}>
                                        Atrás
                                    </Button>
                                    <Button className="btn-enviar" disabled={formik.isSubmitting} type="submit">
                                        {data ? 'Guardar': 'Registrar'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
            </Form>
        </Modal>
    );
};