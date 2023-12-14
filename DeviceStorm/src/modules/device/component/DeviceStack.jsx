import React, {useState, useEffect, useContext} from 'react';
import '../style/DeviceStack.css';
import {SomeProblems} from '../../../auth/pages/SomeProblems.jsx';
import {LoadingComponent} from '../../../auth/components/loading/LoadingComponent.jsx';
import {getCategories, getdevices} from '../helpers/boundary.js';
import {getRequestGral} from '../helpers/boundary.js';
import Swal from 'sweetalert2';
import {removedevice} from '../helpers/boundary.js';
import {CardDevice} from "./CardDevice.jsx";
import {Header} from "../../../public/component/Header.jsx";
import {Button} from "reactstrap";
import {DeviceEditModal} from "./DeviceEditModal.jsx";

export const DeviceStack = () => {
    const [devices, setDevices] = useState([]);
    const [aux, setAux] = useState([])
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState(false);
    const [data, setData] = useState({});
    const [requests, setRequests] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [showOrder, setShowOrder] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    const fillDevices = async () => {
        setLoading(true);

        const response = await getdevices();
        if (response === 'ERROR') {
            setApiError(true);

        } else {
            setDevices(response.devices);
            setAux(response.devices)
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
            let valueA = '';
            let valueB = ''
            switch (sortCriteria) {
                case 'name':
                    valueA = a.name
                    valueB = b.name
                    break;
                case 'code':
                    valueA = a.code
                    valueB = b.code
                    break;
                case 'created_at':
                    valueA = a.created_at
                    valueB = b.created_at
                    break;
                case 'stock':
                    valueA = a.stock
                    valueB = b.stock
                    break;
            }
            let compareResult = 0
            if (typeof (valueA) === "string") {
                compareResult = valueA.localeCompare(valueB);
            }else{
                compareResult = valueA - valueB
            }
            return sortDirection === 'asc' ? compareResult : -compareResult;
        })
        console.log('entra')
        setAux(sortedDevices)
    }

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

    const openModalEdit = (datos = {}) => {
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
        <div className="mt-4" style={{paddingLeft: "300px"}}>

            {apiError ? <SomeProblems/> : loading ? <LoadingComponent/> :
                (<>
                    <div className="pe-5">
                        <Header data={devices} setAux={setAux} showInsert={true} title={'Inventario'} showFilter={true}
                                showSort={true} onCreate={openModalEdit}
                                chevron={showOrder} setChevron={() => setShowOrder(prev => !prev)}/>
                        <div className={(showOrder ? 'display-bar-order ' : '') + "deviceshelf-controls"}>
                            <select
                                className="form-control me-4"
                                id="sortCriteria"
                                value={sortCriteria}
                                onChange={(e) => setSortCriteria(e.target.value)}>
                                <option value="">Ordenar por...</option>
                                <option value="name">Nombre</option>
                                <option value="code">Codigo</option>
                                <option value="created_at">Fecha de creación</option>
                                <option value="stock">Stock</option>
                            </select>

                            <select
                                className="form-control me-4"
                                id="sortDirection"
                                value={sortDirection}
                                onChange={(e) => setSortDirection(e.target.value)}
                            >
                                <option value="">Dirección...</option>
                                <option value="asc">Ascendente</option>
                                <option value="desc">Descendente</option>
                            </select>

                            <Button className="action-button"
                                    disabled={!(sortCriteria.length > 0 && sortDirection.length > 0)}
                                    onClick={sortDevices}>
                                Ordenar
                            </Button>
                        </div>
                        <div className="deviceshelf-devices">
                            <CardDevice devices={aux}/>
                        </div>
                    </div>
                    <DeviceEditModal show={openModal} setShow={setOpenModal} data={null}/>
                </>)
            }
        </div>
    )
}
