import React from 'react';
import axios from 'axios';
import env from 'react-dotenv';
import { Card, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './App.css';

const FoodCard = (props) => {
  const handleOrder = async () => {
    try {
      // get email of logged in user
      const userResponse = await axios.get(`${env.REACT_APP_BACKEND_URL}/api/user`, { withCredentials: true });

      if (userResponse.status === 200) {
        const orderResponse = await axios.post(`${env.REACT_APP_BACKEND_URL}/api/order`, {
          email: userResponse.data.email,
          foodid: props.foodID,
        });

        if (orderResponse.status === 201) {
          Swal.fire({
            title: 'Ordre oprettet',
            text: 'Din ordre er oprettet og sendt til køkkenet.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Fejl',
            text: 'Der opstod en fejl under oprettelse af din ordre. Prøv igen senere.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          title: 'Ikke logget ind',
          text: 'Du skal være logget ind for at lægge en ordre.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      } else {
        console.error(error);
      }
    }
  };


  return (
    <Col md={4}>
      <Card className="card"> 
        <Card.Img variant="top" src={props.image} alt="" style={{ height: "100%", objectFit: "cover" }} />
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Card.Text>{props.description}</Card.Text>
          <Card.Text>{props.price} kr.</Card.Text>
          <button className="btn btn-primary" onClick={handleOrder}>Bestil</button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default FoodCard;
