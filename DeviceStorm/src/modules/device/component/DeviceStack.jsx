import React, {useState, useEffect} from 'react';
import '../style/DeviceStack.css';
import {SomeProblems} from '../../../auth/pages/SomeProblems.jsx';
import {LoadingComponent} from '../../../auth/components/loading/LoadingComponent.jsx';
import {getdevices} from '../helpers/boundary.js';
import {CardDevice} from "./CardDevice.jsx";
import {Header} from "../../../public/component/Header.jsx";
import {Button} from "reactstrap";
import {DeviceEditModal} from "./DeviceEditModal.jsx";

export const DeviceStack = () => {
    const [devices, setDevices] = useState([]);
    const [aux, setAux] = useState([])
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [showOrder, setShowOrder] = useState(false);


    const fillDevices = async () => {
        setLoading(true);

        const response = await getdevices();
        if (response === 'ERROR') {
            setApiError(true);

        } else {
            setDevices(response.devices);
            setAux(response.devices)
            setApiError(false);
        }
        setLoading(false);
    }

    useEffect(() => {
        fillDevices();
    }, []);

    const sortDevices = () => {
        const sortedDevices = [...devices].sort((a, b) => {
            let valueA = '';
            let valueB = ''
            switch (sortCriteria) {
                case 'name':
                    valueA = a.name
                    valueB = b.name
                    break;
                case 'code':
                    valueA = a.code
                    valueB = b.code
                    break;
                case 'created_at':
                    valueA = a.created_at
                    valueB = b.created_at
                    break;
                case 'stock':
                    valueA = a.stock
                    valueB = b.stock
                    break;
            }
            let compareResult = 0
            if (typeof (valueA) === "string") {
                compareResult = valueA.localeCompare(valueB);
            }else{
                compareResult = valueA - valueB
            }
            return sortDirection === 'asc' ? compareResult : -compareResult;
        })
        console.log('entra')
        setAux(sortedDevices)
    }

    const openModalEdit = () => {
        setOpenModal(true);
    }


    return (
        <div className="mt-4" style={{paddingLeft: "300px"}}>

            {apiError ? <SomeProblems/> : loading ? <LoadingComponent/> :
                (<>
                    <div className="pe-5">
                        <Header data={devices} setAux={setAux} showInsert={true} title={'Inventario'} showFilter={true}
                                showSort={true} onCreate={openModalEdit}
                                chevron={showOrder} setChevron={() => setShowOrder(prev => !prev)}/>
                        <div className={(showOrder ? 'display-bar-order ' : '') + "deviceshelf-controls"}>
                            <select
                                className="form-control me-4"
                                id="sortCriteria"
                                value={sortCriteria}
                                onChange={(e) => setSortCriteria(e.target.value)}>
                                <option value="">Ordenar por...</option>
                                <option value="name">Nombre</option>
                                <option value="code">Codigo</option>
                                <option value="created_at">Fecha de creación</option>
                                <option value="stock">Stock</option>
                            </select>

                            <select
                                className="form-control me-4"
                                id="sortDirection"
                                value={sortDirection}
                                onChange={(e) => setSortDirection(e.target.value)}
                            >
                                <option value="">Dirección...</option>
                                <option value="asc">Ascendente</option>
                                <option value="desc">Descendente</option>
                            </select>

                            <Button className="action-button"
                                    disabled={!(sortCriteria.length > 0 && sortDirection.length > 0)}
                                    onClick={sortDevices}>
                                Ordenar
                            </Button>
                        </div>
                        <div className="deviceshelf-devices">
                            <CardDevice devices={aux}/>
                        </div>
                    </div>
                    <DeviceEditModal show={openModal} setShow={setOpenModal} data={null}/>
                </>)
            }
        </div>
    )
}
