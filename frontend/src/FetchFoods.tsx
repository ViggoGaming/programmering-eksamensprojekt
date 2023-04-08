import React, { useState, useEffect } from 'react';
import FoodCard from './Food.component';
import { Container, Row } from 'react-bootstrap';
import './App.css';
import env from 'react-dotenv';
import axios from 'axios';

function Food() {
  const [foodResults, setFoodResults] = useState([]);

  async function fetchFoods() {
    try {
      const response = await axios.get(`${env.REACT_APP_BACKEND_URL}/api/food`);
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
    <Container>
      <Row>
        {foodResults.length > 0 ? (
          foodResults.map(
            food =>
              food['visible'] === true && (
                <FoodCard
                  key={food['id']}
                  foodID={food['id']}
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
      </Row>
    </Container>
  );
}

export default Food;
