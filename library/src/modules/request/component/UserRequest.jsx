import React, { useState, useEffect } from 'react';
import '../style/Request.css'
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from 'react-bootstrap';
const MySwal = withReactContent(Swal);
import {updateRequest}  from '../helpers/updateRequest'
import Modal from 'react-modal';
import { RequestModal } from './RequestModal';
import { getUser } from '../../user/helpers';

export const UserRequest = ({ requests = [] }) => {

  const [filteredUsers, setFilteredUsers] = useState(requests);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // Filtrar usuarios según el término de búsqueda
    const filtered = requests.filter(
      (req) =>
        req.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email.toLowerCase().includes(searchTerm.toLowerCase())

    );
    setFilteredUsers(filtered);
  }, [searchTerm]);


  const openModal = () =>{
    setOpen(true);
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
                    </tr>))
                  }
                </tbody>
              </Table>
              <Button className="btn-siguiente" onClick={openModal} >
                          Nueva Solicitud
                        </Button>
            </CardBody>
          </Card>
          <RequestModal open = {open} onOpen={setOpen}/>
        </Col>
      </Row>
    </div>
  );
};