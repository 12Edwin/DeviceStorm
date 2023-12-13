import React, { useState, useEffect } from 'react';
import '../style/Request.css'
import { Card, CardHeader, CardBody, Table, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from '@material-ui/core';
const MySwal = withReactContent(Swal);
import { updateRequest, sanction } from '../helpers/updateRequest'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Moment from 'moment';
import 'moment/locale/es';
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
        req.device[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.user[0]?.email.toLowerCase().includes(searchTerm.toLowerCase()) && req.user.length > 0)
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

  async function handlerSanction(idUser, emailUser, returns) {
    console.log("Llegaron los datos: ", idUser, emailUser, returns);
    const newSanction = {idUser, emailUser, returns};
    //asignamos los valores
    if(await onConfirm(idUser, emailUser, returns)){
    setSanctions(newSanction);
    console.log("Datos setiados: ", idUser, emailUser, returns);
  }
  }
  async function onConfirm(idUser, emailUser, returns) {
    if (idUser !== undefined && idUser !== null) {
      return await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se creará una sanción al usuario',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        showLoaderOnConfirm: true,
        async preConfirm(inputValue) {
          return await onSanction(idUser, emailUser, returns);
        }
      }).then(result => result.isConfirmed)
    } else {
      console.error('ID no válido');
      return false;
    }
  }

  const onSanction = async (idUser, emailUser, returns) => {
    const description = "Sanción por no devolver el dispositivo a tiempo";
    //console.log("Datos que se enviarán a createSanction:", {idUser,emailUser,description,returns});
    const result = await createSanction(idUser, emailUser, description, returns);
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
                placeholder="Search..."
                value={searchTerm}
                className='form-control'
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Table className="tablesorter" responsive>

                <thead className="text-primary" style={{ color: 'black' }}>

                  <tr >
                    <th>Dispositivo</th>
                    <th>Correo Usuario</th>
                    <th>Fecha Pedido</th>
                    <th>Fecha Regreso</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((req) => (
                    <tr key={req.uid}>
                      <td>{req.device[0]?.name}</td>
                      <td>{req.user && req.user[0] && req.user[0].email}</td>
                      <td>{Moment(req.created_at).format('LLL')}</td>
                      <td>{Moment(req.returns).format('LLL')}</td>
                      <td>{req.status}</td>
                      <td>
                        <Button
                          onClick={() => onRequest(req.uid)}
                          style={{
                            fontSize: '10px',
                            marginLeft: '10px',
                            backgroundColor: 'green',
                            color: 'white',
                          }}
                          variant="contained"
                          className='actionButton'
                        >
                          <AssignmentTurnedInIcon style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                        </Button>
                        <Button
                          onClick={() => {
                            console.log('userId:', req.user[0]?._id);
                            console.log('userEmail:', req.user[0]?.email);
                            console.log('returns:', req.returns);
                            handlerSanction(req.user[0]?._id, req.user[0]?.email, req.returns);
                          }}
                          style={{
                            fontSize: '10px',
                            marginLeft: '10px',
                            backgroundColor: 'red',
                            color: 'white',
                          }}
                          variant="contained"
                          className='actionButton'
                        >
                          <InfoOutlinedIcon style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                        </Button>

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