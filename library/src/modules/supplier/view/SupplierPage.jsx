import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import {Button, Card, CardBody, CardFooter, CardText, CardTitle} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPencilAlt, faStore} from "@fortawesome/free-solid-svg-icons";
import Switch from "react-switch";
import {getSuppliers} from "../helpers/getSuppliers.js";
import {changeStatusSupplier} from "../helpers/changeStatusSupplier.js";
import '../style/Supplier.css'
import {EditModalSupplier} from "../component/EditModalSupplier.jsx";
import {Header} from "../../../public/component/Header.jsx";

export const SupplierPage = () =>{

    const [suppliers, setSuppliers] = useState([]);
    const [aux, setAux] = useState([])
    const [supplier, setSupplier] = useState({})
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false);

    const fillSuppliers = async () =>{
        setLoading(true)
        const result = await getSuppliers();
        if(result === "ERROR"){
            resultFail()
        }else{
            setSuppliers(result)
            setAux(result)
        }

        setLoading(false);
    }

    useEffect(() => {
        fillSuppliers()
    }, []);

    const onOpenModal = (supplier) =>{
        setSupplier(supplier)
        setShowModal(true)
    }

    const onCloseModal = (value) =>{
        if(value === 'reload'){
            fillSuppliers();
        }
        setShowModal(false)
    }

    async function handleSwitchChange(itemId) {
        if ( await onConfirm(itemId)) {
            const updatedItems = suppliers.map(item => {
                if (item.uid === itemId) {
                    return {...item, status: !item.status};
                }
                return item;
            });
            setSuppliers(updatedItems);
        }
    }

    const onConfirm = async (id) =>{
        return await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Quieres cambiar el estado de este proveedor',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            async preConfirm(inputValue) {
                return await onChangeStatus(id)
            }
        }).then(result => result.isConfirmed)
    }

    const onChangeStatus = async (id) =>{
        const result = await changeStatusSupplier(id)
        if (result === 'ERROR'){
            resultFail('Ups, ha ocurrido un error al actualizar el proveedor')
            return false
        }else {
            resultOk()
            return true
        }
    }

    const resultFail = (text = 'Ups, ha ocurrido un error al obtener los proveedores') => {
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
            text: 'Proveedor actualizado correctamente',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then(res => fillSuppliers())
    }

    return(
        <div style={{marginTop: '3vh' ,marginLeft: '22vw', marginRight: '5vw'}}>
            <Header title={'Proveedores'} showFilter={false} showInsert={false} data={suppliers} setAux={setAux} onCreate={()=> onOpenModal(null)}/>
            <div className="d-flex flex-row flex-wrap">
                {aux.map((card, ind) => (
                    <Card key={ind} className="card-supplier m-3" style={{width: "18rem"}}>

                        <div className="d-flex justify-content-center p-4 bg-light">
                            <FontAwesomeIcon icon={faStore} size="6x" />
                        </div>

                        <CardBody>
                            <CardTitle className="text-center" style={{fontWeight: 600}}>
                                {card.name}
                            </CardTitle>
                            <CardText className="text-center small">
                                {card.direction}
                            </CardText>
                            <CardText className="text-center small">
                                Teléfono: {card.contact}
                            </CardText>
                        </CardBody>

                        <CardFooter className="d-flex justify-content-between">
                            <Button color="primary" onClick={()=> onOpenModal(card)}> Editar <FontAwesomeIcon icon={faPencilAlt}/></Button>
                            <Switch checked={card.status} onChange={()=> handleSwitchChange(card.uid)}/>
                        </CardFooter>

                    </Card>
                ))}
                <EditModalSupplier supplier={supplier} show={showModal} onHide={(value)=> onCloseModal(value)}/>
            </div>
        </div>
    )
}