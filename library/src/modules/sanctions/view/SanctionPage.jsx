import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSanctions } from '../helpers/getSanctions.js';
import '../style/Sanction.css';
import moment from 'moment';

export const SanctionPage = () => {
    const [sanctions, setSanctions] = useState([]);

    useEffect(() => {
        const fetchSanctions = async () => {
            try {
                const result = await getSanctions();
                console.log('Sanciones obtenidas:', result); // Agrega este console.log
                setSanctions(result);
            } catch (error) {
                console.error('Error al obtener las sanciones:', error);
            }
        };

        fetchSanctions();
    }, []);

    return (
        <div style={{ marginLeft: '22vw', marginTop: '3vh', marginRight: '5vw' }}>
            <div className="rounded-5 header-table bg-info">
                <span> Sanciones </span>
            </div>
            <Table align="center" hover variant="dark" className="table-sanctions shadow-lg rounded-5 overflow-hidden">
                <thead>
                    <tr>
                        <th className="text-center"> # </th>
                        <th className="text-center"> ID Usuario </th>
                        <th className="text-center"> Descripción </th>
                        <th className="text-center"> Fecha de vencimiento </th>
                        <th className="text-center"> Días </th>
                        <th className="text-center"> Monto </th>
                        <th className="text-center"> Estado </th>
                    </tr>
                </thead>
                <tbody>
                    {sanctions.map && sanctions.map((sanction, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{sanction.idUser}</td>
                            <td>{sanction.description}</td>
                            <td>{moment(sanction.dueDate).format('YYYY-MM-DD')}</td>
                            <td>{sanction.days}</td>
                            <td>{sanction.amount}</td>
                            <td className={`text-center ${sanction.status ? 'paid' : 'unpaid'}`}>
                                <div className="status-box">
                                    {sanction.status ? 'Pagado' : 'Sin pagar '}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
