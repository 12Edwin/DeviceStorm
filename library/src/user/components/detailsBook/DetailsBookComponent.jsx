import React, { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import images from '../../../assets/img/500.png' 
import { Button, Card, CardContent, CardHeader, CardMedia } from '@material-ui/core';
import { ShoppingCart,BookTwoTone, VisibilityRounded } from '@material-ui/icons';
import { Navigate, useParams } from 'react-router-dom';
import { getBook } from '../../helpers/getBook';
import image from '../../../assets/img/book.jpg'
import { SomeProblems } from '../../../auth/pages/SomeProblems';
import { LoadingComponent } from '../../../auth/components/loading/LoadingComponent';
import { validateToken } from '../../../auth/helpers/validateToken';
import { AuthContext } from '../../../auth/context/AuthContext';
import { BookStack } from '../inventory/BookStack';
import { CardText, CardTitle } from 'reactstrap';
import { BuyBookComponent } from '../buyBook/BuyBookComponent';
import { BookRequestModal } from '../modalRequest/BookRequestModal';


export const DetailsBookComponent = () => {

    const {id} = useParams();
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState(false);
    const [book, setBook] = useState({});
    const [openRequest, setOpenRequest] = useState(false);
    const [openBuy, setOpenBuy] = useState(false);
    const {logout} = useContext(AuthContext);
    const [reload, setReload] = useState(false);
    
    const fillBook = async () =>{
        setLoading(true);

        const resultToken = await validateToken();
        if(!(resultToken == true) ){
            logout();
        }

        const response = await getBook(id);
        if(response === 'ERROR'){
            setApiError(true);
        }else{
            setApiError(false);
            setBook(response.book);
        }
        setLoading(false);
    }

    useEffect(() =>{
        fillBook();
    },[]);

    const charge = () =>{
        setReload(false)
        window.location.reload();
    }

    const onBuy = () =>{
        setOpenBuy(true)
    }

    const onRequest = () =>{
        setOpenRequest(true);
    }

  return (
    <>
    <div className='mt-4' style={{marginLeft:'300px'}}>
        { loading ? <LoadingComponent/> : apiError ? <SomeProblems/> : book.status == false ? <Navigate to={'/user/stock'} /> :
            (<><div className='row'>
            <Col md = {5}>
                <div className='card' style={{ width: '100%', margin: '1rem' }}>
                    <div style={{height:'480px'}}>
                        <CardMedia component="img"  image={book.img ? book.img : image} />
                    </div>
                    <CardContent>
                        <CardTitle>{book.name}</CardTitle>
                    </CardContent>
                </div>
            </Col>
            <Col md = {5}>
                <div className='card' style={{ width: '18rem', margin: '1rem' }}>
                <CardContent>
                    <CardTitle>{book.publication}</CardTitle>
                    <CardText>
                    <strong>Author:</strong> {book.author}
                    </CardText>
                </CardContent>
                </div>
                <div className='card' style={{ width: '18rem', margin: '1rem' }}>
                <CardContent>
                    <CardTitle>Publicación: {book.publication}</CardTitle>
                    <CardText>
                    <strong>Reseña:</strong> {book.resume}
                    </CardText>
                </CardContent>
                </div>
                <div className='card' style={{ width: '18rem', margin: '1rem', padding:'0px' }}>
                <CardContent>
                    <CardTitle>Deceas pedirlo</CardTitle>
                    <Row className='mt-4'>
                        <Col md ={5}>
                            <Button onClick={onBuy} style={{fontSize:'10px', marginRight:'10px'}} variant="contained" color="primary"startIcon={<ShoppingCart />}>Comprar</Button>
                        </Col>
                        <Col md ={5}>
                            <Button onClick={onRequest} style={{fontSize:'10px', marginLeft:'10px'}} variant="contained" color="secondary"startIcon={<BookTwoTone />}>Prestamo</Button>
                        </Col>
                    </Row>
                    
                </CardContent>
                </div>
            </Col>
        </div>
        <Row>
            <div className='mt-4 mb-2' style={{marginLeft:'20px'}}> <h3>También te pueden gustar</h3> </div>
            
        </Row></>)
        }
    </div>
    { openBuy &&
    <BuyBookComponent open={setOpenBuy} data={book}/>
    }
    { openRequest &&
    <BookRequestModal open={setOpenRequest} data={book} />
    }
    <BookStack reload = {setReload}/>
    { reload &&
        charge()
    }
    </>
  );
  
};
