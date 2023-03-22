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
import { BookTwoTone, ShoppingCart, VisibilityRounded } from '@material-ui/icons';
import { Col, Row } from 'react-bootstrap';
import {BookRequestModal} from '../modalRequest/BookRequestModal';
import image from '../../../assets/img/book.jpg';
import { getRequestGral } from '../../helpers/getHistory';
import { useNavigate } from 'react-router-dom';
import { BuyBookComponent } from '../buyBook/BuyBookComponent';
import { getAllSales } from '../../../admin/helpers/getAllSales';
export const BookStack = ({reload}) => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(false);
  const {logout} = useContext(AuthContext)
  const [openRequest, setOpenRequest] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [data, setData] = useState({});
  const [requests, setRequests] = useState([]);
  const [sales, setSales] = useState([]);
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
  }, []);

  const openModal = (datos) =>{
    setOpenRequest(true)
    setData(datos)
  }
  const openModalBuy = (datos) =>{
    setOpenBuy(true)
    setData(datos)
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
          <div key={book.uid}>{!book.status || requests.includes(book.name) || sales.includes(book.name) ? <></>  :(<>
          
          <Card style={{ width: '18rem', margin: '15px', display:'flex', alignItems:'center' }}>
            <Card.Header style={{height: '330px'}}>
            <Card.Img variant="top" style={{width:'200px'}} src={book.img ? book.img : image}/>
            </Card.Header>
            <Card.Body>
                <Card.Title>{book.name}</Card.Title>
                <Card.Text>
                <strong>Author:</strong> {book.author}
                </Card.Text>
                <Button style={{fontSize:'10px', display: 'flex'}} variant="contained" color="default" onClick={()=>{navigate(`/user/details/${book.uid}`); reload(true)}} endIcon={<VisibilityRounded />}>Ver más</Button>
            </Card.Body>
          </Card>
          <Card style={{ width: '18rem', margin: '1rem', padding:'0px' }}>
          <Card.Body>
              <Row>
                  <Col md ={5}>
                      <Button onClick={()=>openModalBuy(book)} style={{fontSize:'10px', marginRight:'10px'}} variant="contained" color="primary"startIcon={<ShoppingCart />}>Comprar</Button>
                  </Col>
                  <Col md ={5}>
                      <Button onClick={()=>openModal(book)} style={{fontSize:'10px', marginLeft:'10px'}} variant="contained" color="secondary"startIcon={<BookTwoTone />}>Prestamo</Button>
                  </Col>
              </Row>    
          </Card.Body>
          </Card>{ openRequest &&
          <BookRequestModal data={data} open ={setOpenRequest}/>
          }
          { openBuy &&
          <BuyBookComponent isOpen={openBuy} open={setOpenBuy} data={data}/>
          }
          </>)}
          </div>
        )
        )}
      </div> </>)
      }
      
    </div>
  );
};