import React, { useState, useEffect } from 'react';
import '../style/Request.css'
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import { Button } from '@material-ui/core';
import { RequestModal } from './RequestModal';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import moment from 'moment';
export const UserRequest = ({ requests = [] }) => {
  const [filteredUsers, setFilteredUsers] = useState(requests);
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  }

  const noSanction = () => {
    return (
      <span style={{ fontStyle: 'italic' }}>No aplica</span>
    )
  }

  const getDeviceNames = (devices) => {
    let devicesNames = [];
    let ids = [];
    devices.forEach(element => {
      const info = element.deviceInfo[0];
      if(devicesNames.some(device => device.id === info._id) ) {
        devicesNames[devicesNames.findIndex(device=> device.id === info._id)].cantidad+=1;
                
      }else {
        ids.push(info._id);
        devicesNames.push({
          id: info._id,
          name:info.name,
          cantidad: 1
        })
      }
    });
    let name = '';
    devicesNames.forEach((device)=> {
      name+= device.name+'x'+device.cantidad+' '
    })
    return name
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
                    <th>Dispositivos</th>
                    <th>Correo</th>
                    <th>Fecha de petición</th>
                    <th>Fecha de retorno</th>
                    <th>Estatus</th>
                    <th>Sanción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((req) => (
                    <tr key={req.uid}>
                      <td>{getDeviceNames(req.devices)}</td>
                      <td>{req.user}</td>
                      <td>{moment(req.created_at).format('YYYY-MM-DD')}</td>
                      <td>{moment(req.returns).format('YYYY-MM-DD')}</td>
                      <td>{req.status}</td>
                      <td>{req.sanction ? req.sanction : noSanction()}</td>
                    </tr>))
                  }
                </tbody>
              </Table>
              <Button color="primary" onClick={openModal}>
                <AddCircleOutlineOutlinedIcon />
              </Button>
            </CardBody>
          </Card>
          <RequestModal open={open} onOpen={setOpen} />
        </Col>
      </Row>
    </div>
  );
};
