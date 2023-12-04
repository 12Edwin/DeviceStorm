import React, { useState, useEffect } from 'react';
import '../style/Request.css'
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from 'react-bootstrap';
const MySwal = withReactContent(Swal);
import {updateRequest}  from '../helpers/updateRequest'


export const Request = ({ requests = [] }) => {

  const [filteredUsers, setFilteredUsers] = useState(requests);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Filtrar usuarios según el término de búsqueda
    const filtered = requests.filter(
      (req) =>
        req.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email.toLowerCase().includes(searchTerm.toLowerCase())

    );
    setFilteredUsers(filtered);
  }, [searchTerm]);


  const onRequest = (id) => {
    MySwal.fire({
      title: '¿Qué decea realizar?, \nAutorizar solicitud o denegar solicitud',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Autorizar`,
      denyButtonText: `Denegar`,
      cancelButtonText: `Cancelar`,
    }).then(async (result) => {
      /* Manejar la respuesta del usuario */
      if (result.isConfirmed) {
        const response = await updateRequest(id,{status:'Active'});
        if(response === 'ERROR'){
          onFail()
        }else{
          onSuccess();
        }
      } else if (result.isDenied) {
        const response = await updateRequest(id,{status:'Finished'});
        if(response === 'ERROR'){
          onFail();
        }else{
          onSuccess();
        }
      }
    });
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
        <Col md="11" style={{ paddingLeft: "150px", paddingTop: "70px" }}>
          <Card>
            <CardHeader >
              <div className='coloration'>
                <h4 className="card-title">Solicitudes</h4>
              </div>
            </CardHeader>
            <CardBody>
            <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    className='form-control'
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              <Table className="tablesorter" responsive>
                
                <thead className="text-primary" style={{ color: 'black' }}>
                  
                  <tr >
                    <th>device</th>
                    <th>Email user</th>
                    <th>Created</th>
                    <th>Returns</th>
                    <th>Status</th>
                    <th>-</th>
                  </tr>
                </thead>
                <tbody>
                  { filteredUsers.map((req) => (
                    <tr key={req.uid}>
                      <td>{req.device}</td>
                      <td>{req.user}</td>
                      <td>{req.created_at}</td>
                      <td>{req.returns}</td>
                      <td>{req.status}</td>
                      <td><Button variant='primary' onClick={() => onRequest(req.uid)}>Resolver</Button></td>
                    </tr>))
                  }
                </tbody>
              </Table>

            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};