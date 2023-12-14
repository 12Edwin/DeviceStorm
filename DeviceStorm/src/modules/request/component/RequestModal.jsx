import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { useFormik } from "formik";
import Modal from "react-modal";
import * as Yup from 'yup';
import { getdevices } from "../../device/helpers";
import { CSSTransition } from "react-transition-group";
import '../style/ModalRequest.css'
import '../style/RequestModal.css';
import { createRequest } from "../helpers/createRequest";
import DeleteIcon from "@material-ui/icons/Delete"
import AddIcon from "@material-ui/icons/Add";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal)
export const RequestModal = ({ open, onOpen, email }) => {
    const [devices, setDevices] = useState([]);
    const [devicesFields, setDevicesFields] = useState([]);
    const [apiError, setApiError] = useState([]);
    useEffect(() => {
        fillDevices();
    }, [])

    const initialValues = {
        fecha: '',
        devices: ['']
    }
    const returnDate = () => {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 4);
        return currentDate;
    }
    const validationSchema = Yup.object({
        fecha: Yup.date().min(new Date(), "La fecha debe ser mayor a la actual").max(returnDate(),'El plazo máximo es de 4 díaz').required("La fecha es obligatoria"),
        devices: Yup.array().of(
            Yup.object({
                device: Yup.string().required('Campo obligatorio')
            }))
    })

    const confirm = (request) => {
        MySwal.fire({
            title: '¿Seguro de registrar la solicitud?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',            
        }).then( async (result)=> {
            if(result.isConfirmed) {
                addRequest(request) ;
            }
        })
        handleCloseModal();
    }


    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            console.log(values)
            const request = {
                returns: values.fecha,
                devices: values.devices.map(device => {
                    return device.device
                })
            }
            confirm(request);
        }
    })


    const fillDevices = async () => {
        const response = await getdevices();
        if (response === 'ERROR') {
            setApiError(true);
            console.log("Error");
        } else {
            setApiError(false);
            setDevices(response.devices);
        }
        console.log(devices);
    }

    const addRequest = async (request) => {
        try {
            const response = await createRequest(request).then(()=>{
                location.reload();
            });
        } catch (err) {
            console.log("Error al enviar datos :C");
        }
    }
    const handleCloseModal = () => {
        formik.resetForm();
        onOpen(false);
    }

    const addDevice = () => {
        try {
            if (formik.values.devices.length < 3)
            formik.setValues({ ...formik.values, devices: [...formik.values.devices, ''] });
        } catch (err) {

        }
    }

    const quitDevice = (id) => {
        try {
            let newDevices = [...formik.values.devices];
            newDevices.splice(id, 1)
            formik.setValues({ fecha: formik.values.fecha, devices: [...newDevices] })
        } catch (err) {

        }
    }
    const newDeviceField = (value, index) => {
        return (
            <select
                name={`devices[${index}].device`}
                id={`devices[${index}].device`}
                className={'form-control'}
                value={value.device}
                onChange={formik.handleChange}>
                <option value="" selected hidden>Selecciona una opción</option>
                {devices.map(dev => (
                    <option key={dev.uid} value={dev.uid}>
                        {dev.name}
                    </option>
                ))}
            </select>
        )
    }
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
                    contentLabel="Nueva Solicitud"
                    className="modal-content"
                    overlayClassName="modal-overlay"
                >
                    <div className="modal-header">
                        <h4 className="text-center">
                            Registra una nueva solicitud
                        </h4>
                        <button className="close-button" onClick={handleCloseModal}>X</button>
                    </div>
                    <div className="modal-body">
                        <div className="formulario-conatainer">
                            <form onSubmit={formik.handleSubmit}
                                style={{ padding: '0px', boxShadow: 'none', backgroundColor: 'white' }}
                            >
                                <div>
                                    <Button startIcon={<AddIcon />} onClick={addDevice}>Agregar dispositivo</Button>
                                </div>
                                <div className="form-step">
                                    {formik.values.devices.map((value, index) => (
                                        <div className="mb-3" key={index}>
                                            <div className="request-field">
                                                <label style={{ marginRight: '5px' }} htmlFor={`devices[${index}].device`} className="form-label">
                                                    {`Dispositivo ${index + 1}: `}
                                                </label>
                                                {newDeviceField(value, index)}
                                                <Button disabled={index == 0} onClick={() => quitDevice(index)}>
                                                    <DeleteIcon />
                                                </Button>
                                            </div>

                                            {formik.errors.devices?.[index]?.device && (
                                                <div style={{ fontSize: '12px', color: 'red' }}>{formik.errors.devices[index].device}</div>
                                            )}
                                        </div>

                                    ))}

                                    <div className="mb-3 request-field">
                                        <label style={{ marginRight: '5px' }} htmlFor="fecha" className="form-label">Fecha de Regreso: </label>
                                        <input
                                            type="date"
                                            onChange={formik.handleChange}
                                            className="form-control" id="fecha"
                                            name="fecha"
                                            value={formik.values.fecha}
                                            placeholder="Ingresa la fecha de devolución"
                                        />
                                    </div>
                                    {formik.touched.fecha && formik.errors.fecha && (
                                        <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.fecha}</div>
                                    )}
                                    <div className="form-buttons">
                                        <Button className="btn-enviar" type="submit">
                                            Enviar
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </CSSTransition>
        </div>
    )
}
