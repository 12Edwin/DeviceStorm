import {useState} from "react";
import { Modal, Form, Button } from 'react-bootstrap';


export const ModalEdit = (props) => {

     return (
            <Modal {...props} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Editar Categoría
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre de Categoría</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                label="Categoría Activa"
                                feedbackTooltip
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary">Cerrar</Button>
                    <Button variant="primary">Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
        );


}
