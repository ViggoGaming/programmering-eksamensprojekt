import React, { useState, useEffect } from 'react'
import { Button, Form, Toast, ToastContainer, Card } from 'react-bootstrap';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import EditFood from './EditFoods'


function AddFoodForm() {
  const [hidden, setHidden] = useState(false);

  /*  const onFormSubmit = e => {
      e.preventDefault()
      const formData = new FormData(e.target),
        formDataObj = Object.fromEntries(formData.entries())
  
      const body = new FormData
      body.append("name", formDataObj.name)
      body.append("description", formDataObj.description)
      body.append("price", formDataObj.price)
      body.append("file", formDataObj.file)
  
      fetch("https://programmering-eksamensprojekt-production.up.railway.app/api/food", {
        body: body,
        headers: {
          "Accept": "application/json",
          //        "Content-Type": "multipart/form-data"
        },
        method: "POST"
      })
    }*/


  const onFormSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    fetch('https://programmering-eksamensprojekt-production.up.railway.app/api/food/upload', {
      method: 'POST',
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data"

      }
    })
      .then((response) => {
        console.log('Request sent.');
        console.log(response)
        // handle response
      })
      .catch((error) => {
        console.error(error);
        // handle error
      });
  };


  return (
    <div>
      <div className="info">
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Administrationspanel</Card.Title>
            <Card.Text>Dette er et administrationspanel for kantinemedarbejderne, så de kan tilføje nye mad retter til menuen😋
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className="form">
        <Form onSubmit={onFormSubmit}>
          <Form.Control name="name" type="text" placeholder="Navn på retten" />
          <br />
          <Form.Control name="description" type="text" placeholder="Beskrivelse af retten" />
          <br />
          <Form.Control name="price" type="text" placeholder="Pris i kr." />
          <br />
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Vælg billede</Form.Label>
            <Form.Control name="file" type="file" />
          </Form.Group>
          <br />
          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" onClick={() => setHidden(!hidden)}>Tilføj</Button>
          </div>
        </Form>
      </div>
      <div className="notification" hidden={!hidden}>
        <ToastContainer position="top-end">
          <Toast onClose={() => setHidden(!hidden)} bg={"success"}>
            <Toast.Header>
              <img src="holder.js/20x20" className="rounded me-2" alt="" />
              <strong className="me-auto">Succes!</strong>
            </Toast.Header>
            <Toast.Body>Retten er netop tilføjet</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
      <EditFood />
    </div>

  );
}

export default AddFoodForm;
