import React, { useState, useEffect } from 'react'
import Menu_card from './Menu.component';
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
  foodid: number;
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
        const response = await fetch(`http://localhost:8080/api/menu/${weekNumber}`);
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
    <>
      <h1>WEEKLY MENUS</h1>
      <div>
        <label htmlFor="week-number-select">Select week number:</label>
        <select id="week-number-select" onChange={handleWeekNumberChange}>
          <option value="0">Choose a week</option>
          {[...Array(52)].map((_, index) => (
            <option key={index} value={index + 1}>
              Week {index + 1}
            </option>
          ))}
        </select>
      </div>
      {isLoading && <p>Loading...</p>}
      {errorMessage && <p>{errorMessage}</p>}
      {!isLoading && !errorMessage && menuData.length === 0 && <p>No weekly menu was found</p>}
      {!isLoading && !errorMessage && menuData.length > 0 && (
        <div className="menu-container">
          {menuData.map((menu) => (
            <Menu_card name={menu["food"]["name"]} day={menu["dayofweek"]} description={menu["food"]["description"]} image={menu["food"]["image"]} price={menu["food"]["price"]}/>
          ))}
        </div>
      )}
    </>
  );
}

export default Menu;
