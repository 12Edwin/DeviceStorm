import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// import book1 from './book1.jpg';
// import book2 from './book2.jpg';
// import book3 from './book3.jpg';
import './BookStack.css';
import { SomeProblems } from '../../../auth/pages/SomeProblems';
import { LoadingComponent } from '../../../auth/components/loading/LoadingComponent';
import { getBooks } from '../../helpers/getBooks';
import { validateToken } from '../../../auth/helpers/validateToken';
import {AuthContext} from '../../../auth/context/AuthContext'
import { Button } from '@material-ui/core';
import Card from 'react-bootstrap/Card';
import { BookTwoTone, EditRounded, VisibilityRounded, Cancel, Restore } from '@material-ui/icons';
import { Col, Row } from 'react-bootstrap';
import image from '../../../assets/img/book.jpg';
import { getRequestGral } from '../../helpers/getRequestGral';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { removeBook } from '../../helpers/removeBook';
import { getAllSales } from '../../helpers/getAllSales';
import { BookEditModal } from '../modalEdit/BookEditModal';

export const BookStack = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(false);
  const {logout} = useContext(AuthContext)
  const [openBuy, setOpenBuy] = useState(false);
  const [data, setData] = useState({});
  const [requests, setRequests] = useState([]);
  const [sales, setSales] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  

  const fillBooks = async () => {
    setLoading(true);
    const resultToken = await validateToken();
    if(!(resultToken == true) ){
      logout();
    }
    const response = await getBooks();
    if(response == 'ERROR'){
      setApiError(true);
      
    }else{
      setBooks(response.books);
      setApiError(false);
    }
    setLoading(false);
  }

  const fillCategories = async () =>{
    const response = await getCategories();
    setCategories(response);
  }
  
  useEffect(() => {
    fillBooks();
    getRequests();
    getSalesGral();
  }, []);

  const openModalRemove = (id) =>{
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Deceas deshabilitar este libro!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      preConfirm:  async() => {const result = await removeBook(id);
        if(result !== 'ERROR'){
          Swal.fire(
            '¡Felicidades!',
            'La transacción se ha realizado con éxito.',
            'success'
          ).then(() => window.location.reload());
        }else{
          Swal.fire(
            '¡Error!',
            'Ocurrió un error al realizar la transacción.',
            'danger'
          );
        }
      }
    });
  }

  const openModalEdit = (datos) =>{
    setData(datos);
    setOpenModal(true);
  }

  const getRequests = async () =>{
    const response = await getRequestGral();
    if(response === 'ERROR'){
      setApiError(true)
    }else{
      setApiError(false)
      let data = [];
      response.requests.forEach(element => {
        if(element.status !== 'Finished')
        data.push(element.book);
      });
      setRequests(data);
    }
  }

  const getSalesGral = async () =>{
    const response = await getAllSales();
    if(response === 'ERROR'){
      setApiError(true)
    }else{
      setApiError(false)
      let data = [];
      response.forEach(element => {
        if(element.status === true)
        data.push(element.book);
      });
      setSales(data);
    }
  }

  return (
    <div className="bookshelf-section" style={{ paddingLeft: "300px" }}>
      
      { apiError ? <SomeProblems/> : loading ? <LoadingComponent/> :
      (<><div className="bookshelf-header">
        <h3>Best Sellers</h3>
        <div className="bookshelf-controls">
          {/* Controles de la sección */}
        </div>
      </div>
      <div className="bookshelf-books">
        {books.map(book => (
          <div key={book.uid}>{ (<>
          
          <Card style={{ width: '18rem', margin: '15px', display:'flex', alignItems:'center' }}>
            <Card.Header style={{height: '330px'}}>
            <Card.Img variant="top" style={{width:'200px'}} src={book.img ? book.img : image}/>
            </Card.Header>
            <Card.Body>
                <Card.Title>{book.name}</Card.Title>
                <Card.Text>
                <strong>Author:</strong> {book.author}
                </Card.Text>
            </Card.Body>
          </Card>
          <Card style={{ width: '18rem', margin: '1rem', padding:'0px' }}>
          <Card.Body>
              <Row>
                  <Col md ={5}>{ sales.includes(book.name) || requests.includes(book.name) ? 
                      <></>
                      :
                      <Button onClick={()=>openModalEdit(book)} style={{fontSize:'10px', marginRight:'10px'}} variant="contained" color="primary"startIcon={<EditRounded />}>Editar</Button>
                  }
                  </Col>
                  <Col md ={5}>{ sales.includes(book.name) || requests.includes(book.name) ? 
                      <Button onClick={()=>openModalRemove(book.uid)} disabled={true} style={{fontSize:'10px', marginLeft:'10px'}} variant="contained" color="secondary"startIcon={<Cancel />}>Agotado</Button>
                      : !book.status ?
                      <Button onClick={()=>openModalRemove(book.uid)} style={{fontSize:'10px', marginLeft:'10px', backgroundColor:'green', color:'white'}} variant="contained" startIcon={<Restore />}>Rehabilitar</Button>
                      :
                      <Button onClick={()=>openModalRemove(book.uid)} style={{fontSize:'10px', marginLeft:'10px'}} variant="contained" color="secondary"startIcon={<BookTwoTone />}>Deshabilitar</Button>
                       
                  }
                  </Col>
              </Row>    
          </Card.Body>
          </Card>
           <BookEditModal open={openModal} onOpen={setOpenModal} data={data}/>
          </>)}
          </div>
        )
        )}
      </div> </>)
      }
      
    </div>
  );
};