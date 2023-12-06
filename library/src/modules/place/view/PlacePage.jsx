import React, {useEffect, useState} from "react";
import {Card, CardBody, CardTitle, CardText, CardFooter, Button} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding, faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import '../style/place.css'
import Switch from "react-switch";
import Swal from "sweetalert2";
import {getPlaces} from "../helpers/getPlaces.js";
import {changeStatusPlace} from "../helpers/changeStatusPlace.js";
import {EditModalPlace} from "../component/EditModalPlace.jsx";

export const PlacePage = ()=>{

    const [places, setPlaces] = useState([]);
    const [place, setPlace] = useState({})
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false);

    const fillPlaces = async () =>{
        setLoading(true)
        const result = await getPlaces();
        if(result === "ERROR"){
            resultFail()
        }else{
            setPlaces(result)
        }

        setLoading(false);
    }

    useEffect(() => {
        fillPlaces()
    }, []);

    const onOpenModal = (place) =>{
        setPlace(place)
        setShowModal(true)
    }

    const onCloseModal = (value) =>{
        if(value === 'reload'){
            fillPlaces();
        }
        setShowModal(false)
    }

    async function handleSwitchChange(itemId) {
        if ( await onConfirm(itemId)) {
            const updatedItems = places.map(item => {
                if (item.uid === itemId) {
                    return {...item, status: !item.status};
                }
                return item;
            });
            setPlaces(updatedItems);
        }
    }

    const onConfirm = async (id) =>{
        return await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Quieres cambiar el estado de esta área',
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
        const result = await changeStatusPlace(id)
        if (result === 'ERROR'){
            resultFail('Ups, ha ocurrido un error al actualizar la área')
            return false
        }else {
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
            text: 'Área actualizada correctamente',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        }).then(res => fillPlaces())
    }

    return(
        <div style={{marginTop: '3vh' ,marginLeft: '22vw', marginRight: '5vw'}} className="d-flex flex-row flex-wrap">
            {places.map((card, ind) => (
                <Card key={ind} className="card-place m-3" style={{width: "18rem"}}>

                    <div className="d-flex justify-content-center p-4 bg-light">
                        <FontAwesomeIcon icon={faBuilding} size="6x" />
                    </div>

                    <CardBody>
                        <CardTitle className="text-center" style={{fontWeight: 600}}>
                            {card.name}
                        </CardTitle>
                        <CardText className="text-center small">
                            {card.direction}
                        </CardText>
                        <CardText className="text-center small">
                            Capacidad: {card.capacity}
                        </CardText>
                    </CardBody>

                    <CardFooter className="d-flex justify-content-between">
                        <Button color="primary" onClick={()=> onOpenModal(card)}> Editar <FontAwesomeIcon icon={faPencilAlt}/></Button>
                        <Switch checked={card.status} onChange={()=> handleSwitchChange(card.uid)}/>
                    </CardFooter>

                </Card>
            ))}
            <EditModalPlace place={place} show={showModal} onHide={(value)=> onCloseModal(value)}/>
        </div>
    )
}