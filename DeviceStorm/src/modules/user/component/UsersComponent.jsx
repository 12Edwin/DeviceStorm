import React, { useState, useEffect } from 'react';
import { Table, Button } from 'reactstrap';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import {CreateUser} from "../component/CreateUserComponent"
import Switch from "react-switch"
import "../../category/style/Category.css"
import {getAllUsers, userDisabled} from "../helpers/"
import { Header } from '../../../public/component/Header';
export const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [aux, setAux] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isOpenNew, setIsOpenNew] = useState(false);
  const onOpenModal = (data) => {
    setOpenModal(true);
    setUser(data);
  }

  const onClose = (value) => {
    if (value === 'reload') {
      fillUsers();
    }
    setOpenModal(false);
  }

  useEffect(() => {
    fillUsers();
  }, []);

  const fillUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result === 'ERROR') {
      resultFail();
    } else {
      setUsers(result);
      setAux(result);
    }
    setLoading(false);
  }

  async function handleSwitchChange(itemId) {
    console.log("id =>",itemId)
    if (await onConfirm(itemId)) {
      const updatedItems = users.map(item => {
        if (item.uid === itemId) {
          return { ...item, status: !item.status };
        }
        return item;
      });
      setUsers(updatedItems);
    }
  }

  const onConfirm = async (itemId) => {
    return await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Quieres cambiar el estado de este usuario',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        showLoaderOnConfirm: true,
        async preConfirm(inputValue) {
            return await onChangeStatus(itemId)
        }
    }).then((result) => {
        result.isConfirmed
    })
  }

  const onChangeStatus = async (id) =>{
    console.log("id =>",id)
    const result = await userDisabled(id)
    if (typeof (result) === 'string'){
        resultFail(result)
        return false
    }else {
        resultOk()
        return true
    }
  }

  const resultFail = (text) => {
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
        text: 'Usuario correctamente',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
    }).then(res => fillUsers())
  }

  return (
    <div style={{marginLeft: '22vw', marginTop:'3vh', marginRight: '5vw'}}>
      <Header title={'Usuarios'} showFilter={true} showInsert={true} data={users} setAux={setAux} onCreate={()=>setIsOpenNew(true)}/>
        <div className="rounded-5 header-table bg-primary">
          <span> Usuarios </span>
        </div>
        <Table align="center" hover variant="dark" className=" table-category shadow-lg rounded-5 overflow-hidden">
                <thead>
                <tr>
                    <th className="text-center"> # </th>
                    <th className="text-center">Nombre</th>
                    <th className="text-center">Apellido paterno</th>
                    <th className="text-center">Apellido materno</th>
                    <th className="text-center">Correo electrónico</th>
                    <th className="text-center">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {aux.map((item,ind) => (
                    <tr key={ind}>
                        <td>{ind + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.lastname}</td>
                        <td>{item.surname || 'S/A'}</td>
                        <td>{item.email}</td>
                        <td className="d-flex justify-content-around">
                            <Switch checked={item.status} onChange={()=> handleSwitchChange(item.uid)}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <CreateUser
              isOpen={isOpenNew}
              onClose={() => setIsOpenNew(false)}
            />
    </div>
  )

};