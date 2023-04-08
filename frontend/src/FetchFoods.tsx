import React, { useState, useEffect } from 'react';
import Food_card from './Food.component';
import './App.css';
import env from 'react-dotenv';
import axios from 'axios';

function Food() {
  const [foodResults, setFoodResults] = useState([]);

  async function fetchFoods() {
    try {
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/api/food`);
      const foods = response.data.data;
      setFoodResults(foods);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div className="cards">
      {foodResults.length > 0 ? (
        foodResults.map(
          food =>
            food['visible'] === true && (
              <Food_card
                key={food['_id']}
                name={food['name']}
                description={food['description']}
                image={food['image']}
                price={food['price']}
              />
            ),
        )
      ) : (
        <p>Der er ingen mad retter i databasen</p>
      )}
    </div>
  );
}

export default Food;
