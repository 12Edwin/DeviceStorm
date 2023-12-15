import React, { useState, useEffect } from 'react';
import '../style/Request.css'
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button, Tooltip } from '@material-ui/core';
const MySwal = withReactContent(Swal);
import { updateRequest, sanction } from '../helpers/updateRequest'
import { SanctionModal } from './SanctionModal';
import moment from 'moment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InfoIcon from '@material-ui/icons/Info';
import Moment from 'moment';
Moment.locale('es');
import { setAppElement } from 'react-modal';
setAppElement(document.body);
import { createSanction } from '../../sanctions/helpers/createSanction';

export const Request = ({ requests = [] }) => {

  const [filteredUsers, setFilteredUsers] = useState(requests);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [idRequest, setIdRequest] = useState("");
  const [sanction, setSanctions] = useState(null);
  useEffect(() => {
    const filtered = requests.filter(
      (req) =>
        req.devices.some(device => {
          return device.deviceInfo.some(info => {
            return info.name.toLowerCase().includes(searchTerm.toLowerCase());
          });
        }
        ) ||
        (req.user[0]?.email.toLowerCase().includes(searchTerm.toLowerCase()) && req.user.length > 0)
    );

    setFilteredUsers(filtered);
  }, [searchTerm]);


  const onRequest = (id, currentStatus) => {
    MySwal.fire({
      title: 'Seleccione la operación a realizar',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `${currentStatus === 'Pendiente' ? 'Autorizar' : 'Reactivar'}`,
      denyButtonText: `${currentStatus === 'Pendiente' ? 'Denegar' : 'Finalizar'}`,
      cancelButtonText: `Cancelar`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await updateRequest(id, { status: 'Activa' });
        if (response === 'ERROR') {
          onFail()
        } else {
          onSuccess();
        }
      } else if (result.isDenied) {
        const response = await updateRequest(id, { status: 'Finalizada' });
        if (response === 'ERROR') {
          onFail();
        } else {
          onSuccess();
        }
      }
    });
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
  const getDeviceNames = (devices) => {
    let devicesNames = [];
    let ids = [];
    devices.forEach(element => {
      const info = element.deviceInfo[0];
      if (devicesNames.some(device => device.id === info._id)) {
        devicesNames[devicesNames.findIndex(device => device.id === info._id)].cantidad += 1;

      } else {
        ids.push(info._id);
        devicesNames.push({
          id: info._id,
          name: info.name,
          cantidad: 1
        })
      }
    });
    let name = '';
    devicesNames.forEach((device) => {
      name += device.name + 'x' + device.cantidad + ' '
    })
    return name


  }

  //Boton de sancion
  async function handlerSanction(emailUser, returns, idRequest) {
    console.log("Llegaron los datos: ", emailUser, returns, idRequest);
    const newSanction = { emailUser, returns, idRequest };
    if (await onConfirm(emailUser, returns, idRequest)) {
      setSanctions(newSanction);
      console.log("Datos setiados: ", emailUser, returns, idRequest);
    }
  }
  async function onConfirm(emailUser, returns, idRequest) {
    if (emailUser !== undefined && emailUser !== null) {
      return await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se creará una sanción al usuario',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        showLoaderOnConfirm: true,
        async preConfirm(inputValue) {
          return await onSanction(emailUser, returns, idRequest);
        }
      }).then(result => result.isConfirmed)
    } else {
      console.error('Correo no valido');
      return false;
    }
  }

  const onSanction = async (emailUser, returns, idRequest) => {
    const description = "Sanción por no devolver el dispositivo a tiempo";
    //console.log("Datos que se enviarán a createSanction:", {idUser,emailUser,description,returns});
    const result = await createSanction(emailUser, description, returns, idRequest);
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
      text: 'Se registró la sanción correctamente',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    }).then(res => fillPlaces())
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
                placeholder="Buscar por dispositivo/usuario..."
                value={searchTerm}
                className='form-control'
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Table className="tablesorter" responsive>

                <thead className="text-primary" style={{ color: 'black' }}>

                  <tr >
                    <th>Dispositivo</th>
                    <th>Correo</th>
                    <th>Fecha de petición</th>
                    <th>Fecha de retorno</th>
                    <th>Estatus</th>
                    <th>Acciones</th>
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
                      <td>
                        <Tooltip title="Cambiar Status" placement="top">
                          <Button onClick={() => onRequest(req._id, req.status)} variant="primary" className='actionButton' style={{ color: '#1a73e8' }}><AssignmentTurnedInIcon></AssignmentTurnedInIcon></Button>
                        </Tooltip>
                        {moment(req.returns).isBefore(moment()) && req.status == 'Activa' && (
                          <Tooltip title="Sansionar" placement='top'>
                            <Button onClick={() => handlerSanction(req.user, req.returns, req._id)} variant="danger" className='actionButton' style={{ color: 'red' }}>
                            <InfoOutlinedIcon></InfoOutlinedIcon>
                          </Button>
                          </Tooltip>
                        )}
                      </td>
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
