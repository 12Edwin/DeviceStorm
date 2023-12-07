import {Input, Card, CardBody, Button} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faComputer, faPlusSquare} from '@fortawesome/free-solid-svg-icons';
import React from "react";
import '../style/Header.css'

export const Header = ({title, onCreate = ()=>{}, data = [], setAux = ()=>{}, showFilter = false, showInsert = false}) => {

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
                { showFilter ?
                <Input
                    type="search"
                    className=" px-3 me-3 text-dark border-0 shadow-sm"
                    style={{ transition: 'width 0.3s ease' }}
                    onChange={(event) => onFilter(event.target.value)}
                    placeholder="Buscar..."
                />:
                    <div className="blue-header">
                        <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="blues">
                            <defs>
                                <linearGradient id="blueGradient1">
                                    <stop offset="0%" stopColor="#4ab6ff" />
                                    <stop offset="50%" stopColor="#6dd5ed" />
                                    <stop offset="100%" stopColor="#a4e3f3" />
                                </linearGradient>
                                <linearGradient id="blueGradient2">
                                    <stop offset="0%" stopColor="#4ab6ff" />
                                    <stop offset="50%" stopColor="#6dd5ed" />
                                    <stop offset="100%" stopColor="#a4e3f3" />
                                </linearGradient>
                            </defs>

                            <path fill="url(#blueGradient1)" d="M0,80 C40,40 60,120 100,80 L100,200 L0,200 Z" />
                            <path fill="url(#blueGradient1)" d="M20,200 L20,160 C40,180 60,120 100,160 L100,200 Z" rx="10" />
                            <path fill="url(#blueGradient2)" d="M30,200 L30,160 C50,180 70,110 100,160 L100,200 Z" />
                            <path fill="url(#blueGradient2)" d="M0,200 C0,150 30,120 40,200 L40,200 L0,200 Z" />
                        </svg>
                        <div className="title-container">
                            <h1 className="header-title">REPADE</h1>
                        </div>
                    </div>
                }
                { showInsert &&
                <Button color="primary" onClick={onCreate} className="d-flex align-items-center"> Agregar <FontAwesomeIcon className="ms-3" size="2x" icon={faPlusSquare}/></Button>
                }
            </CardBody>
        </div>
    );

}