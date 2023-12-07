import {Input, Card, CardBody, Button} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faComputer,
    faPlusSquare
} from '@fortawesome/free-solid-svg-icons';
import React from "react";

export const Header = ({title, onCreate, data = [], setAux}) => {

    const onFilter = (value) => {
        if (value !== '' && data.length > 0){
            const labels = Object.getOwnPropertyNames(data[0])
            const filter = data.filter(object => {
                for (let label of labels){
                    if (object[label].toString().toLowerCase().includes(value.toString().toLowerCase())){
                        return true
                    }
                }
                return false
            })
            setAux(filter)
        }else if (value === ''){
            setAux(data)
        }
    }

    return (
        <div className="ms-3 rounded-4 w-100 border-0 shadow mb-2">
            <CardBody className="bg-light rounded-bottom p-3 d-flex align-items-center">

                <div className="bg-primary rounded-circle p-2 me-3">
                    <FontAwesomeIcon
                        icon={faComputer}
                        className="text-white"
                        size="2x"
                    />
                </div>

                <div className="text-dark me-4">
                    <h2 className="fs-4 fw-bold mb-0">{title}</h2>
                </div>

                <Input
                    type="search"
                    className=" px-3 me-3 text-dark border-0 shadow-sm"
                    style={{ transition: 'width 0.3s ease' }}
                    onChange={(event) => onFilter(event.target.value)}
                    placeholder="Buscar..."
                />
                <Button color="primary" onClick={onCreate} className="d-flex align-items-center"> Agregar <FontAwesomeIcon className="ms-3" size="2x" icon={faPlusSquare}/></Button>

            </CardBody>
        </div>
    );

}