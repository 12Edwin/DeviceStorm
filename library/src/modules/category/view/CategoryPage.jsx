import React, {useEffect, useState} from 'react';
import {Table, Button} from "reactstrap";
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "../style/Category.css"
import {getCategories} from "../helpers/getCategories.js";
import Switch from "react-switch";
export const CategoryPage = () => {

    const [categories, setCategories] = useState([]);
    const [toggleSwitch, setToggleSwitch] = useState(false);
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const onToggleSwitch = () =>{
        setToggleSwitch(prevState => !prevState)
    }
    useEffect(() => {
        fillCategories()
    }, []);

    const fillCategories = async () =>{
        setLoading(true)
        const result = await getCategories();
        if(result === "ERROR"){
            setApiError(true)
        }else{
            setCategories(result)
        }

        setLoading(false);
    }

    const data = [
        {name: 'Juan', description: 25},
    ];

        return (
            <div style={{marginLeft: '22vw', marginRight: '5vw'}}>
                <div className="rounded-5 header-table bg-info">
                    <span> Categorías </span>
                </div>
            <Table align="center" striped bordered hover variant="dark" className=" table-category shadow-lg rounded-5 overflow-hidden">
                <thead>
                <tr>
                    <th className="text-center"> - </th>
                    <th className="text-center">Nombre</th>
                    <th className="text-center">Descripción</th>
                    <th className="text-center">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((item,ind) => (
                    <tr key={ind}>
                        <td>{ind + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td className="d-flex justify-content-around">
                            <Switch checked={toggleSwitch} onChange={onToggleSwitch}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            </div>
        );
}
