import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Input, Alert } from 'reactstrap';  // Importa Input desde 'reactstrap'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSanctions } from '../helpers/getSanctions.js';
import { changeStatusSanction } from '../helpers/changeStatusSanction.js';
import '../style/Sanction.css';
import Swal from "sweetalert2";
import moment from 'moment';

export const SanctionPage = () => {
    const [sanctions, setSanctions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNoSancionesAlert, setShowNoSancionesAlert] = useState(false);

    useEffect(() => {
        const fetchSanctions = async () => {
            try {
                const result = await getSanctions();
                console.log('Sanciones obtenidas:', result);
                setSanctions(result);
            } catch (error) {
                console.error('Error al obtener las sanciones:', error);
            }
        };
        fetchSanctions();
    }, []);


    const filteredSanctions = sanctions.filter((sanction) => {
        const isStatusMatch = filter === 'all' || (sanction.status === (filter === 'paid'));

        const isUserMatch = searchTerm.trim() === '' ||
            sanction.emailUser.toString().includes(searchTerm.trim());

        return isStatusMatch && isUserMatch;
    });

    useEffect(() => {
        setShowNoSancionesAlert(filteredSanctions.length === 0);
    }, [filteredSanctions]);

    async function handlePagar(itemId) {
        console.log('ID antes de onConfirm:', itemId);

        if (await onConfirm(itemId)) {
            console.log('Pago confirmado. Actualizando sanciones...');
            const updatedItems = sanctions.map(item => {
                if (item.uid === itemId) {
                    return { ...item, status: !item.status };
                }
                return item;
            });
            setSanctions(updatedItems);
        }
    }

    async function onConfirm(id) {
        if (id !== undefined && id !== null) {
            return await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Confirma el pago de sancion',
                icon: 'question',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                showLoaderOnConfirm: true,
                async preConfirm(inputValue) {
                    return await onChangeStatus(id)
                }
            }).then(result => result.isConfirmed)
        } else {
            console.error('ID no válido');
            return false;
        }
    }

    const onChangeStatus = async (id) => {
        const result = await changeStatusSanction(id)
        if (typeof (result) === 'string') {
            resultFail(result)
            return false
        } else {
            resultOk()
            return true
        }
    }

    const resultFail = (text = 'Ups, ha ocurrido un error al obtener las áreas') => {
        Swal.fire({
            title: 'Error!',
            text,
            icon: 'danger',
            confirmButtonText: 'OK',
        });
    }

    const resultOk = () => {
        Swal.fire({
            title: 'Tarea completada!',
            text: 'Área actualizada correctamente',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then(res => fillPlaces())
    }

    return (
        <div style={{ marginLeft: '22vw', marginTop: '3vh', marginRight: '5vw' }}>
            {showNoSancionesAlert && (
                <Alert color="danger" className="text-center p-4 rounded">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                    <span> No hay sanciones que mostrar.</span> 
                </Alert>
            )}
            <div className="rounded-5 header-table bg-info">
                <span> Sanciones </span>
            </div>
            <div style={{ marginLeft: '5vw', marginTop: '3vh', marginRight: '5vw', marginBottom: '3vh', display: 'flex' }}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                    <Input
                        type="text"
                        placeholder="Buscar por correo de usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '500px' }}
                    />
                </div>
                <div className="botonesFiltro">
                    <Button color="primary" onClick={() => setFilter('all')}>Todos</Button>
                    <Button color="success" onClick={() => setFilter('paid')}>Pagados</Button>
                    <Button color="danger" onClick={() => setFilter('unpaid')}>Sin pagar</Button>
                </div>
            </div>
            <Table align="center" hover variant="dark" className="table-sanctions shadow-lg rounded-5 overflow-hidden">
                <thead>
                    <tr>
                        <th className="text-center"> # </th>
                        <th className="text-center"> Correo Usuario  </th>
                        <th className="text-center"> Descripción </th>
                        <th className="text-center"> Fecha de vencimiento </th>
                        <th className="text-center"> Días </th>
                        <th className="text-center"> Monto </th>
                        <th className="text-center"> Estado </th>
                        <th className="text-center"> Acciones </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSanctions.map && filteredSanctions.map((sanction, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{sanction.emailUser}</td>
                            <td>{sanction.description}</td>
                            <td>{moment(sanction.dueDate).format('YYYY-MM-DD')}</td>
                            <td>{sanction.days}</td>
                            <td>{sanction.amount}</td>
                            <td className={`text-center ${sanction.status ? 'paid' : 'unpaid'}`}>
                                <div className="status-box">
                                    {sanction.status ? 'Pagado' : 'Sin pagar '}
                                </div>
                            </td>
                            <td>
                                {!sanction.status && (
                                    <Button className="pagar-button" onClick={() => handlePagar(sanction.uid)}>
                                        Pagar
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
