import React from 'react';
import {Table} from "reactstrap";

export const CategoryPage = () => {

    const data = [
        {name: 'Juan', age: 25},
        {name: 'Maria', age: 30},
        {name: 'Pedro', age: 28}
    ];

        return (
            <div style={{marginLeft: '22vw', marginRight: '5vw'}}>
            <Table striped bordered hover variant="dark" className="shadow-lg rounded-2 overflow-hidden m-4">
                <thead>
                <tr>
                    <th> - </th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {data.map(item => (
                    <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.age}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            </div>
        );
}
