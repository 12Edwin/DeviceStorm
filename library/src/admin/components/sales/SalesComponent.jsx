import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import './History.css';

export const SalesComponent = ({ sales = [] }) => {

  const [filteredUsers, setFilteredUsers] = useState(sales);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Filtrar usuarios según el término de búsqueda
    const filtered = sales.filter(
      (sale) =>
        sale.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.email.toLowerCase().includes(searchTerm.toLowerCase()) 

    );
    setFilteredUsers(filtered);
  }, [searchTerm]);


  return (
    <div className='col-11 mt-5' style={{ paddingLeft: "150px" }}>
      <div className='banner'><h1>Historial</h1></div>
      <div className='card'>
        <div className="tabla-container mt-5">
        <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          <div className="tabla-header">
            <div className="tabla-header-cell">Book</div>
            <div className="tabla-header-cell">Email</div>
            <div className="tabla-header-cell">Price</div>
            <div className="tabla-header-cell">Pay</div>
            <div className="tabla-header-cell">Created</div>
            <div className="tabla-header-cell">Status</div>
          </div>
          {filteredUsers.map((sale) => (
            <div key={sale.uid} className="tabla-fila">
              <div className="tabla-celda">{sale.book}</div>
              <div className="tabla-celda">{sale.email}</div>
              <div className="tabla-celda">{sale.price}</div>
              <div className="tabla-celda">{sale.pay}</div>
              <div className="tabla-celda">{sale.created}</div>
              <div className="tabla-celda">{sale.status ? <FontAwesomeIcon icon={faCheckCircle} color="green" size='2x' />:
                 <FontAwesomeIcon icon={faTimesCircle} size='2x' color="red" />
              }</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
