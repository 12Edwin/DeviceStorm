import React, { useState, useEffect } from 'react';
import '../style/UserTable.css';
import {userDisabled} from '../helpers';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Row, Col } from 'react-bootstrap';
import {CreateUser} from "../component/CreateUserComponent"
export const UsersComponent = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpenNew, setIsOpenNew] = useState(false);
  useEffect(() => {
    // Filtrar usuarios según el término de búsqueda
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleStatus = async (id) =>{
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de realizar esta acción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, realizar',
      cancelButtonText: 'Cancelar',
      preConfirm: async() =>{
        const result = await userDisabled(id);
        if(result === 'ERROR'){
          onFail();
        }else
          onSuccess();
      }      
    })
  }

  const onSuccess = () =>{
    Swal.fire({
      title: '¡Éxito!',
      text: 'Los datos se han guardado correctamente.',
      icon: 'success'
    }).then(() => window.location.reload());
  }

  const onFail = () =>{
    Swal.fire({
      title: '¡Error!',
      text: 'Ocurrión un error al realizar la transacción.',
      icon: 'danger'
    });
  }

  return (
      <div className="user-table">
        <div className="user-table-header">
          <h2>Usuarios</h2>
          <Row>
            <Col>
              <div className="user-table-search">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            <Col>
              <div lg={12} className='user-add '>
                <FontAwesomeIcon icon={faPlusCircle} style={{ color: '#006749' }} onClick={() => setIsOpenNew(true)}/>
              </div>
              <CreateUser
                isOpen={isOpenNew}
                onClose={() => setIsOpenNew(false)}
              />
            </Col>
          </Row>
          </div>
        <table>
          <thead>
            <tr style={{textAlign:'center'}}>
              <th className='header'>Nombre</th>
              <th className='header'>Apellido</th>
              <th className='header'>Correo</th>
              <th className='header'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.uid}
                onClick={() => handleSelectUser(user)}
                className={selectedUser === user ? 'selected' : ''}
              >
                <td >{user.name}</td>
                <td>{user.surname || '-'}</td>
                <td>{user.email}</td>
                <td>
                  <Row>
                    <Col>
                      <div className={`status ${user.status ? 'active' : 'inactive'}`} style={{ cursor: 'pointer' }}
                        onClick={() => handleStatus(user.uid)}
                      >
                        {user.status ? <FontAwesomeIcon icon={faToggleOn} /> : <FontAwesomeIcon icon={faToggleOff} />}
                      </div>
                    </Col>
                  </Row> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};