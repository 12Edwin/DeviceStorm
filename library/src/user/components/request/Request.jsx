import React from 'react';
import './Request.css'
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
} from 'reactstrap';

export const Request = () => {
  return (
    <div className="content">
      <Row>
        <Col md="11" style={{ paddingLeft: "300px", paddingTop:"50px" }}>
          <Card>
            <CardHeader >
                <div className='coloration'>
                    <h4 className="card-title">Solicitudes</h4>
                </div>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Nombre</th>
                    <th>País</th>
                    <th>Ciudad</th>
                    <th className="text-center">Salario</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>Estados Unidos</td>
                    <td>Los Ángeles</td>
                    <td className="text-center">$36,738</td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>Canadá</td>
                    <td>Toronto</td>
                    <td className="text-center">$23,789</td>
                  </tr>
                  <tr>
                    <td>Mike Williams</td>
                    <td>Australia</td>
                    <td>Sídney</td>
                    <td className="text-center">$56,142</td>
                  </tr>
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};