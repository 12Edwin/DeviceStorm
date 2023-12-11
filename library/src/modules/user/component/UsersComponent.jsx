import React, { useState, useEffect } from 'react';
import '../../request/style/Request.css';
import { Card, CardHeader, CardBody, Table, Row, Col, Button } from 'reactstrap';
import {userDisabled} from '../helpers';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn, faPlus } from '@fortawesome/free-solid-svg-icons';
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
      <div className="content">
        <Row>
          <Col md="12" style={{ paddingLeft: "50px", paddingTop:"20px", marginRight: "100%"}}>
            <Card>
              <CardHeader>
              <div className='coloration'>
                <h4 className="card-title">Usuarios</h4>
              </div>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg="12" className='align'>
                      <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        className='form-control'
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      
                  </Col>
                </Row>
                <Row>
                  <Col lg="12" className='align'>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'end'}}>
                      <Button onClick={() => setIsOpenNew(true)} style={{borderRadius: '50%', height: '45px', width: '45px', padding: '0px'}} >
                      <FontAwesomeIcon icon={faPlus} style={{ fontSize: '20px' }}/>
                      </Button>
                      <CreateUser
                        isOpen={isOpenNew}
                        onClose={() => setIsOpenNew(false)}
                      />
                    </div>
                  </Col>
                </Row>
                <Table class="tablesorter" responsive>
                  <thead class="text-primary" style={{ color: 'black' }}>
                    <tr >
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Correo</th>
                      <th>Acciones</th>
                      <th></th>
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
                </Table>
                </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
  );
};