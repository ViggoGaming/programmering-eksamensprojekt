import React, { useState, useEffect } from 'react'
import { Table, Button } from 'react-bootstrap';
import EditFood_card from './EditFood.component';
import './App.css'

function Food() {

  const [foodResults, setFoodResults] = useState([0]);

  async function fetchFoods() {
    const url = "https://programmering-eksamensprojekt-production.up.railway.app/api/food";
    const response = await fetch(url);
    const data = await response.json();
    const foods = data["data"]
    setFoodResults(foods)

  }

  async function deleteFood(id: number) {
    const response = await fetch(`https://programmering-eksamensprojekt-production.up.railway.app/api/food/${id}/`, {
      headers: {
        Accept: "application/json"
      },
      method: "DELETE"
    })
    if (response.ok) {
      setFoodResults(foodResults.filter(food => food["id"] !== id))
    }
  }

  useEffect(() => {
    fetchFoods()
  }, [])

  return (
    <div className="edit-foods">

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Navn</th>
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
              <td>{food['description']}</td>
              <td>{food['price']}</td>
              <td>{food['image']}</td>
              <td><Button onClick={() => deleteFood(food['id'])} variant="danger">Slet</Button></td>
            </tr>
          </tbody>
        ))}
      </Table>
    </div>

  );
}

export default Food;
