import React, {useEffect, useState} from 'react';
import {Table, Button} from "reactstrap";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../style/Category.css"
import {getCategories} from "../helpers/getCategories.js";
import Switch from "react-switch";
import {ModalEdit} from "../component/ModalEdit.jsx";
import Swal from "sweetalert2";
import {updateCategory} from "../helpers/updateCategory.js";
import {changeStatusCategory} from "../helpers/changeStatusCategory.js";
import {Header} from "../../../public/component/Header.jsx";
export const CategoryPage = () => {

    const [categories, setCategories] = useState([]);
    const [aux, setAux] = useState([])
    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(false) 
    const [openModal, setOpenModal] = useState(false);

    const onOpenModal = (data) =>{
        setOpenModal(true)
        setCategory(data);
    }

    const onClose = (value) =>{
        if (value === 'reload'){
            fillCategories()
        }
        setOpenModal(false)
    }

    useEffect(() => {
        fillCategories()
    }, []);

    const fillCategories = async () =>{
        setLoading(true)
        const result = await getCategories();
        if(result === "ERROR"){
            resultFail()
        }else{
            setCategories(result)
            setAux(result)
        }

        setLoading(false);
    }

    async function handleSwitchChange(itemId, status) {
        if ( await onConfirm(itemId, status)) {
            const updatedItems = categories.map(item => {
                if (item.uid === itemId) {
                    return {...item, status: !item.status};
                }
                return item;
            });
            setCategories(updatedItems);
        }
    }

    const onConfirm = async (id, status) =>{
        return await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Quieres cambiar el estado de esta categoría',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            async preConfirm(inputValue) {
                return await onChangeStatus(id, status)
            }
        }).then(result => result.isConfirmed)
    }

    const onChangeStatus = async (id, status) =>{
        const result = await changeStatusCategory(id, status)
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
            text: 'Categoría actualizada correctamente',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then(res => fillCategories())
    }

        return (
            <div style={{marginLeft: '22vw', marginTop: '3vh', marginRight: '5vw'}}>
                <Header title={'Categorías'} showFilter={true} showInsert={true} data={categories} setAux={setAux} onCreate={()=> onOpenModal(null)}/>
                <div className="rounded-5 header-table bg-info">
                    <span> Categorías </span>
                </div>
            <Table align="center"   hover variant="dark" className=" table-category shadow-lg rounded-5 overflow-hidden">
                <thead>
                <tr>
                    <th className="text-center"> - </th>
                    <th className="text-center">Nombre</th>
                    <th className="text-center">Descripción</th>
                    <th className="text-center">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {aux.map((item,ind) => (
                    <tr key={ind}>
                        <td>{ind + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td className="d-flex justify-content-around">
                            <Switch checked={item.status} onChange={()=> handleSwitchChange(item.uid, item.status)}/>
                            <Button color="primary" onClick={()=> onOpenModal(item)}><FontAwesomeIcon icon={faPencilAlt}/></Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
                <ModalEdit show={openModal} category={category} onHide={(value) => onClose(value)}/>
            </div>
        );
}
