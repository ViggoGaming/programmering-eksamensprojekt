import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import Menu_card from './Menu.component';
const { REACT_APP_BACKEND_URL } = process.env
import './App.css'

type MenuData = {
  id: number;
  dayofweek: string;
  weeknumber: number;
  food: {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    visible: boolean;
  };
};

function Menu() {
  const [weekNumber, setWeekNumber] = useState<number>(0);
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await fetch(`${REACT_APP_BACKEND_URL}/api/menu/${weekNumber}`);
        const data = await response.json();
        if (response.ok) {
          setMenuData(data.data);
        } else {
          setErrorMessage(data.error);
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching data');
      }
      setIsLoading(false);
    };

    if (weekNumber > 0) {
      fetchData();
    } else {
      setMenuData([]);
    }
  }, [weekNumber]);

  const handleWeekNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setWeekNumber(parseInt(event.target.value));
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Ugens menu</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <Form.Label htmlFor="week-number-select">Vælg hvilken uge du vil se</Form.Label>
            <Form.Select
              id="week-number-select"
              onChange={handleWeekNumberChange}
              className="w-auto"
            >
              <option value="0">Vælg uge</option>
              {[...Array(52)].map((_, index) => (
                <option key={index} value={index + 1}>
                  Week {index + 1}
                </option>
              ))}
            </Form.Select>
          </Form>
        </Col>
      </Row>
      {isLoading && (
        <Row>
          <Col>
            <p>Loading...</p>
          </Col>
        </Row>
      )}
      {errorMessage && (
        <Row>
          <Col>
            <Alert variant="danger">{errorMessage}</Alert>
          </Col>
        </Row>
      )}
      {!isLoading && !errorMessage && menuData.length === 0 && (
        <Row>
          <Col>
            <p>Ingen menu fundet denne uge</p>
          </Col>
        </Row>
      )}
      {!isLoading && !errorMessage && menuData.length > 0 && (
        <Row className="menu-container">
          {menuData.map((menu) => (
            <Col xs={12} sm={8} md={4} key={menu["food"]["id"]}>
              <Menu_card
                name={menu["food"]["name"]}
                day={menu["dayofweek"]}
                description={menu["food"]["description"]}
                image={menu["food"]["image"]}
                price={menu["food"]["price"]}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Menu;
