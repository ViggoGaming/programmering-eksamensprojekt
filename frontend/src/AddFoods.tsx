import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddFoodForm from './AddFoodForm';
import Header from './Header';
const { REACT_APP_BACKEND_URL } = process.env

function AddFoods() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${REACT_APP_BACKEND_URL}/api/user/`, { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        if (data.admin) {
          setIsAdmin(true);
        } else {
          navigate('/user');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [navigate]);

  return (
    <div>
      <Header />
      {isAdmin ? (
        <div>
          <AddFoodForm />
        </div>
      ) : null}
    </div>
  );
}

export default AddFoods;
