import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditFood from './EditFoods';
import env from 'react-dotenv';
import axios from 'axios';


function AddFoodForm() {
  const [hidden, setHidden] = useState(false);

  const onFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await axios.post(`${env.REACT_APP_BACKEND_URL}/api/food/`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Succes!',
        text: 'Retten er netop tilføjet'
      });
      // handle response
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Fejl',
        text: 'Der opstod en fejl ved tilføjelse af retten'
      });
      // handle error
    }
  };

  return (
    <div>
      <div className='info'>
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Administrationspanel</Card.Title>
            <Card.Text>
              Dette er et administrationspanel for kantinemedarbejderne, så de kan
              tilføje nye mad retter til menuen😋
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className='form'>
        <Form onSubmit={onFormSubmit}>
          <Form.Control name='name' type='text' placeholder='Navn på retten' />
          <br />
          <Form.Control
            name='description'
            type='text'
            placeholder='Beskrivelse af retten'
          />
          <br />
          <Form.Control name='price' type='text' placeholder='Pris i kr.' />
          <br />
          <Form.Group controlId='formFile' className='mb-3'>
            <Form.Label>Vælg billede</Form.Label>
            <Form.Control name='image' type='file' />
          </Form.Group>
          <br />
          <div className='d-grid gap-2'>
            <Button
              variant='primary'
              type='submit'
              onClick={() => setHidden(!hidden)}
            >
              Tilføj
            </Button>
          </div>
        </Form>
      </div>
      <EditFood />
    </div>
  );
}

export default AddFoodForm;
