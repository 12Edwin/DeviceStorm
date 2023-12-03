import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useSpring, animated } from 'react-spring';
import image from '../../../assets/img/device.jpg'
import "./ModalRequest.css"
import { createRequest } from '../../../user/helpers/createRequest';

export const DeviceRequestModal = ({ data, open }) => {
  const [inputValue, setInputValue] = useState('');
  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    handleModalOpen(data)
  }, []);

  const handleTransaction = async (returns) => {

    open(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    console.log(inputValue);
  };

  const handleModalOpen = (device) => {
    // Configurar el modal con SweetAlert2
    Swal.fire({
      title: 'Realizar transacción',
      width: 800,
      padding: 10,
      html:
        `
      <div style="padding:15px">
      <div class="row">
        <div class="col-6">
          <div style="" class="carta">
            <div  style="max-width: 100%; height:320px">
              <img  src="${device.img || image}" class="carta-image" style="width:200px"/>
            </div>
            <div>
                <h5 class="card-title">Special title treatment</h5>
              </div>
          </div>
        </div>
        <div class="col-6">
          <div class="carta">
            <div style="padding:20px">
              <h5 class="card-title">${device.name}</h5>
            </div>
          </div>
          <div class="carta">
            <div style="padding:20px; text-align:left">
              <h6>Author:       ${device.author}</h6>
              <h6>Publication:  ${device.publication}</h6>
              <h6>Category:     ${device.category.name}</h6>
              <h6>Price:        ${device.price}</h6>
            </div>
          </div>
          <div class="carta">
            <div style="padding:20px">
              <h5 class="card-title">Special title treatment</h5>
              <input type="date" value="${ new Date().toISOString().substr(0, 10) }" min="${ new Date().toISOString().substr(0, 10) }" placeholder="Monto" id="swal-input1" class="form-control swal-input" onchange="event => window.handleInputChange(event)">
            </div>
          </div>
        </div>
      </div>
      </div>
      `,
      focusConfirm: false,
      preConfirm: async() => {
        // Obtener los valores de los inputs al hacer clic en "Aceptar"
        const value = document.getElementById('swal-input1').value;
          if (!value) {
            Swal.showValidationMessage('Por favor, introduce un valor.');
          }
          
          const body = {
            device: data.name,
            returns : value,
            created: currentDate,
            status: 'Pending'
          };
          console.log(body);
      
          const response = await createRequest(body);
          
          if(response !== 'ERROR'){
            // Mostrar mensaje de éxito
            Swal.fire({
              icon: 'success',
              title: '¡Transacción exitosa!',
              timer: 1500,
              showConfirmButton: false,
            }).then(()=> window.location.reload());
          }else{
            // Mostrar mensaje de error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al realizar la transacción',
            })
          }
          open(false);
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel',
      },
      didClose: () => open(false) ,
      didOpen: () => {
        // Añadir animación de entrada con react-spring
        const modal = document.querySelector('.swal2-modal');
        const overlay = document.querySelector('.swal2-overlay');
        const modalProps = useSpring({
          from: { transform: 'translate3d(0,-50px,0)', opacity: 0 },
          to: { transform: 'translate3d(0,0,0)', opacity: 1 },
        });
        const overlayProps = useSpring({
          from: { opacity: 0 },
          to: { opacity: 1 },
        });
        modal.style.setProperty('animation', 'none');
        overlay.style.setProperty('animation', 'none');
        modalProps.start({}).then(() => {
          modal.style.removeProperty('animation');
        });
        overlayProps.start({}).then(() => {
          overlay.style.removeProperty('animation');
        });
      },
    }).then(async(result) => {
      // Si el usuario hizo clic en "Aceptar", ejecutar la transacción
      if (result.isConfirmed) {
        
      }
    });
  };

  return (
    <></>
  );
};