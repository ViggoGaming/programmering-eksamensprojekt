import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import './App.css';
import Swal from 'sweetalert2';
import env from "react-dotenv";
import { Link, Router } from "react-router-dom";
import Orders from './Orders'


function Food() {
  const [foodResults, setFoodResults] = useState([]);

  async function fetchFoods() {
    try {
      const url = `${env.REACT_APP_BACKEND_URL}/api/food`;
      const response = await fetch(url);
      const data = await response.json();
      const foods = data["data"]
      setFoodResults(foods)
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteFood(id: number) {
    const result = await Swal.fire({
      title: 'Er du sikker på, at du vil slette denne mad?',
      text: "Du kan ikke fortryde denne handling!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ja, slet den!',
      cancelButtonText: 'Annuller'
    });

    if (result.isConfirmed) {
      const response = await fetch(`${env.REACT_APP_BACKEND_URL}/api/food/${id}/`, {
        credentials: 'include',
        headers: {
          Accept: "application/json"
        },
        method: "DELETE"
      })

      if (response.ok) {
        setFoodResults(foodResults.filter(food => food["id"] !== id))
      }
    }
  }

  useEffect(() => {
    fetchFoods()
  }, [])


  return (
    <div className="edit-foods">
      {foodResults && foodResults.length > 0 ? (
        <Table bordered hover>
        <thead>
            <tr>
              <th>ID</th>
              <th>Navn</th>
              <th>Synlig</th>
              <th>Beskrivelse</th>
              <th>Pris</th>
              <th>Billede</th>
              <th>Handling</th>
            </tr>
          </thead>
          {foodResults.map((food, index) => (
            <tbody key={index}>
              <tr>
                <td>{food['id']}</td>
                <td>{food['name']}</td>
                <td>{food['visible'] ? 'Ja' : 'Nej'}</td>
                <td>{food['description'] ? food['description'] : 'Ikke opgivet'}</td>
                <td>{food['price']}</td>
                <td>{food['image']}</td>
                <td>
                  <Button onClick={() => deleteFood(food['id'])} variant="danger">Slet</Button>
                  <Link to={`/food/edit/${food['id']}`}>
                    <Button variant="primary">Rediger</Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      ) : (
        <p>Der er ingen mad retter i databasen</p>
      )}

      <Orders />

    </div>
  );
}

export default Food;
