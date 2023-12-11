import React, { useState, useEffect } from 'react';
import '../style/Request.css'
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from '@material-ui/core';
const MySwal = withReactContent(Swal);
import { updateRequest, sanction } from '../helpers/updateRequest'
import { SanctionModal } from './SanctionModal';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
export const Request = ({ requests = [] }) => {

  const [filteredUsers, setFilteredUsers] = useState(requests);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [idRequest, setIdRequest] = useState("");
  useEffect(() => {
    // Filtrar solicitudes según el término de búsqueda
    const filtered = requests.filter(
      (req) =>
        req.device[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.user.toLowerCase().includes(searchTerm.toLowerCase())

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
        const response = await updateRequest(id, { status: 'Active' });
        if (response === 'ERROR') {
          onFail()
        } else {
          onSuccess();
        }
      } else if (result.isDenied) {
        const response = await updateRequest(id, { status: 'Finished' });
        if (response === 'ERROR') {
          onFail();
        } else {
          onSuccess();
        }
      }
    });
  }
  const onSanction = (id) => {
    setIdRequest(id);
    setOpen(true);
  }
  const onSuccess = () => {
    Swal.fire({
      title: '¡Éxito!',
      text: 'Los datos se han guardado correctamente.',
      icon: 'success'
    }).then(() => window.location.reload());
  }

  const onFail = () => {
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
                    <th>Sanction</th>
                    <th>-</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((req) => (
                    <tr key={req.uid}>
                      <td>{req.device[0]?.name}</td>
                      <td>{req.user}</td>
                      <td>{req.created_at}</td>
                      <td>{req.returns}</td>
                      <td>{req.status}</td>
                      <td>{req.sanction}</td>
                      <td>
                        <Button onClick={()=>onRequest(req.uid)} style={{fontSize:'10px', marginLeft:'10px', backgroundColor:'green', color:'white'}} variant="primary" className='actionButton' startIcon={<AssignmentTurnedInIcon />}>Resolver</Button>
                        <Button onClick={()=>onSanction(req.uid)} style={{fontSize:'10px', marginLeft:'10px', backgroundColor:'red', color:'white'}} variant="danger" className='actionButton' startIcon={<InfoOutlinedIcon />}>Sancionar</Button>
                      </td>
                    </tr>))
                  }
                </tbody>
              </Table>
            </CardBody>
          </Card>
          <SanctionModal open={open} onOpen={setOpen} idR={idRequest}></SanctionModal>
        </Col>
      </Row>
    </div>
  );
};