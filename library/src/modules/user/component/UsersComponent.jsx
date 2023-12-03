import React, { useState, useEffect } from 'react';
import '../style/UserTable.css';
import {userDisabled} from '../helpers';
import Swal from 'sweetalert2';

export const UsersComponent = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');

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
          <div className="user-table-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr style={{textAlign:'center'}}>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Career</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.uid}
                onClick={() => handleSelectUser(user)}
                className={selectedUser === user ? 'selected' : ''}
              >
                <td>{user.name}</td>
                <td>{user.surname || '-'}</td>
                <td>{user.email}</td>
                <td>{user.career}</td>
                <td>
                  <div className={`status ${!user.status ? 'active' : 'inactive'}`} style={{ cursor: 'pointer' }}
                    onClick={()=>handleStatus(user.uid)}
                  >
                    {!user.status ? 'Habilitar' : 'Deshabilitar'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};