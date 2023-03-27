import React, { useState, useEffect } from 'react'
import Food_card from './Food.component';
import './App.css'

function Food() {

  const [foodResults, setFoodResults] = useState([]);

  async function fetchFoods() {
    const url = "https://programmering-eksamensprojekt-production.up.railway.app/api/food";
    const response = await fetch(url);
    const data = await response.json();
    const foods = data["data"]
    console.log(data)
    setFoodResults(foods)
  }

  useEffect(() => {
    fetchFoods()
  }, [])

  return (
    <div className="cards">
      {foodResults.map(food => (
        food['visible'] === true && <Food_card name={food['name']} description={food['description']} image={food['image']} price={food['price']} />
      ))}
    </div>

  );
}

export default Food;
