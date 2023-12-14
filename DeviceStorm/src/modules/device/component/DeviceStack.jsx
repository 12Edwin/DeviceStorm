import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// import device1 from './device1.jpg';
// import device2 from './device2.jpg';
// import device3 from './device3.jpg';
import '../style/DeviceStack.css';
import { SomeProblems } from '../../../auth/pages/SomeProblems.jsx';
import { LoadingComponent } from '../../../auth/components/loading/LoadingComponent.jsx';
import { getCategories, getdevices } from '../helpers/boundary.js';
import { AuthContext } from '../../../auth/context/AuthContext.jsx'
import { Button } from '@material-ui/core';
import Card from 'react-bootstrap/Card';
//import { deviceTwoTone, EditRounded, Cancel, Restore } from '@material-ui/icons';
import { Col, Row } from 'react-bootstrap';
import image from '../../../assets/img/device.jpg';
import { getRequestGral } from '../helpers/boundary.js';
import Swal from 'sweetalert2';
import { removedevice } from '../helpers/boundary.js';
import { DeviceEditModal } from './DeviceEditModal.jsx';
import { EditRounded } from '@material-ui/icons';
import { Restore } from '@material-ui/icons';
import {CardDevice} from "./CardDevice.jsx";
export const DeviceStack = () => {
  const [devices, setdevices] = useState([]);
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(false);
  const [data, setData] = useState({});
  const [requests, setRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');


  const fillDevices = async () => {
    setLoading(true);

    const response = await getdevices();
    if (response === 'ERROR') {
      setApiError(true);

    } else {
      setdevices(response.devices);
      setApiError(false);
    }
    setLoading(false);
  }

  const fillCategories = async () => {
    const response = await getCategories();
  }

  useEffect(() => {
    fillDevices();
    getRequests();
  }, []);

  const sortDevices = () => {
    const sortedDevices = [...devices].sort((a, b) => {
      const valueA = sortCriteria === 'name' ? a.name : a.code;
      const valueB = sortCriteria === 'name' ? b.name : b.code;

      console.log('ValueA:', valueA);
      console.log('ValueB:', valueB);

      const compareResult = valueA.localeCompare(valueB);
      return sortDirection === 'asc' ? compareResult : -compareResult;
    })
  }


    useEffect(() => {
      sortDevices();
    }, [sortCriteria, sortDirection]);

    const searchDevices = () => {
      if (searchTerm.trim() === '') {
        fillDevices();
      } else {
        const filteredDevices = devices.filter((device) =>
            device.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setdevices(filteredDevices);
      }
    }


    const openModalRemove = (id) => {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¡Deceas deshabilitar este despositivo!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar',
        preConfirm: async () => {
          const result = await removedevice(id);
          if (result !== 'ERROR') {
            Swal.fire(
                '¡Felicidades!',
                'La transacción se ha realizado con éxito.',
                'success'
            ).then(() => window.location.reload());
          } else {
            Swal.fire(
                '¡Error!',
                'Ocurrió un error al realizar la transacción.',
                'error'
            );
          }
        }
      });
    }

    const openModalEdit = (datos) => {
      setData(datos);
      setOpenModal(true);
    }

    const getRequests = async () => {
      const response = await getRequestGral();
      if (response === 'ERROR') {
        setApiError(true)
      } else {
        setApiError(false)
        setRequests(response.filter(element => element.status !== 'Finished'))
      }
    }


    return (
        <div className="deviceshelf-section" style={{paddingLeft: "300px"}}>

          {apiError ? <SomeProblems/> : loading ? <LoadingComponent/> :
              (<>
                <div className="deviceshelf-header">
                  <h3>Best Sellers</h3>
                  <div className="deviceshelf-controls">
                    <label htmlFor="sortCriteria">Ordenar por:</label>
                    <select
                        id="sortCriteria"
                        value={sortCriteria}
                        onChange={(e) => setSortCriteria(e.target.value)}
                    >
                      <option value="name">Nombre</option>
                      <option value="code">Codigo</option>
                    </select>

                    <label htmlFor="sortDirection">Dirección:</label>
                    <select
                        id="sortDirection"
                        value={sortDirection}
                        onChange={(e) => setSortDirection(e.target.value)}
                    >
                      <option value="asc">Ascendente</option>
                      <option value="desc">Descendente</option>
                    </select>

                    <label htmlFor="searchTerm">Buscar por nombre:</label>
                    <input
                        type="text"
                        id="searchTerm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button className="action-button" onClick={sortDevices}>
                      Ordenar
                    </button>
                    <button className="action-button" onClick={searchDevices}>
                      Buscar
                    </button>
                  </div>

                </div>
                <div className="deviceshelf-devices">
                  <CardDevice devices={devices}/>
                </div>
              </>)
          }
        </div>
    )
  }
