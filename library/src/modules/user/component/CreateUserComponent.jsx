import { useFormik } from "formik";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
import { Button, Col, Modal, Row, Form, FormSelect } from "react-bootstrap";

export const CreateUser = ({isOpen, onClose}) => {
    const form = useFormik({
        initialValues: {
            name: "",
            surname: "",
            lastname: "",
            email: "",
            password: ""
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Campo obligatorio"),
            surname: yup.string(),
            lastname: yup.string().required("Campo obligatorio"),
            password: yup.string().required("Campo obligatorio").min(6, "Mínimo 6 caracteres"),
            email: yup.string().email('Formato Incorrecto').required("Campo obligatorio"),
        })
    })
    const handleClose = () => {
        form.resetForm();
        onClose();
      };
    return (
        <Modal
            backdrop="static"
            keyboard={false}
            show={isOpen}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Crear nuevo usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={form.handleSubmit}>
                    <Row>
                        <Col >
                            <Form.Group className="mb-3">
                                <Form.Label> Nombre
                                    <Form.Control
                                        className={`border ${form.errors.name ? 'border-danger is-invalid' : 'border-secondary'}`}
                                        name="name"
                                        placeholder="Juan"
                                        value={form.values.name}
                                        onChange={form.handleChange}
                                    />
                                    {form.errors.name && (
                                    <span className="error-text">{form.errors.name}</span>
                                    )}
                                </Form.Label>
                            </Form.Group>
                        </Col>
                        <Col >
                            <Form.Group className="mb-3">
                                <Form.Label> Apellido Paterno
                                    <Form.Control
                                        className={`border ${form.errors.surname ? 'border-danger is-invalid' : 'border-secondary'}`}
                                        name="surname"
                                        placeholder="Dominguez"
                                        value={form.values.surname}
                                        onChange={form.handleChange}
                                    />
                                    {form.errors.surname && (
                                    <span className="error-text">{form.errors.surname}</span>
                                    )}
                                </Form.Label>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
