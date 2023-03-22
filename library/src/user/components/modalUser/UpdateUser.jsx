import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export const UpdateUser = ({ show, setShow, onConfirm, onLoading }) => {
  const handleClose = () => {setShow(false); onLoading(false)}

  const handleConfirm = () => {
    onConfirm();
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas realizar esta acción?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
