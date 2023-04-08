import React, { useState, useEffect } from 'react';
import { Button, Form, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import env from "react-dotenv";
import { FaUser, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './App.css';

interface User {
  email: string;
  password: string;
}

function UserForm() {
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const checkLoggedInUser = async () => {
    try {
      const response = await axios.get(`${env.REACT_APP_BACKEND_URL}/api/user`, { withCredentials: true });
      if (response.status === 200) {
        setLoggedInUser(response.data.email);
        setIsAdmin(response.data.admin);
        //setUser({ email: '', password: '' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Call checkLoggedInUser in useEffect
  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSignInSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${env.REACT_APP_BACKEND_URL}/api/user/signin`, user, { withCredentials: true });
      if (response.status === 200) {
        setLoggedInUser(user.email);
        checkLoggedInUser();
      //  setUser({ email: '', password: '' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${env.REACT_APP_BACKEND_URL}/api/user/signup`, user, { withCredentials: true });
      if (response.status === 201) {

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Oprettelsen lykkedes',
          text: 'Du er nu oprettet.',
          confirmButtonText: 'OK'
        });
      }
    }
    catch (error) {

      // Check if the error response status is 409 (email already exists)
      if (error.response && error.response.status === 409) {
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Fejl under oprettelse',
          text: 'Emailen findes allerede i databasen.',
          confirmButtonText: 'OK'
        });
      } else {
        // Show a generic error message
        Swal.fire({
          icon: 'error',
          title: 'Fejl under oprettelse',
          text: 'Der opstod en fejl under oprettelsen.',
          confirmButtonText: 'OK'
        });
      }
    }
  };


  const handleSignOutSubmit = async () => {
    try {
      const response = await axios.post(`${env.REACT_APP_BACKEND_URL}/api/user/signout`, {}, { withCredentials: true });
      if (response.status === 200) {
        setLoggedInUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="user-form">
      {loggedInUser ? (
        <div>
          <h3>Email på bruger: {loggedInUser}</h3>
          <h3>Admin: {isAdmin ? "Ja" : "Nej"}</h3>
          <Button variant="primary" onClick={handleSignOutSubmit}>
            Log ud
          </Button>
        </div>
      ) : (
        <div className="form-container">
          <Tabs defaultActiveKey="login" className="mb-3">

            <Tab eventKey="login" title="Login">
              <h2 className="form-title">Login</h2>
              <Form onSubmit={handleSignInSubmit} className="login-form">
                <Form.Group controlId="formBasicEmail">
                  <Form.Label><FaUser /> Email adresse</Form.Label>
                  <Form.Control type="email" placeholder="Email adresse" name="email" value={user.email} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label><FaLock /> Kodeord</Form.Label>
                  <Form.Control type="password" placeholder="Kodeord" name="password" value={user.password} onChange={handleInputChange} />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 login-btn">Login</Button>
              </Form>
            </Tab>

            <Tab eventKey="signup" title="Tilmeld">
              <h2 className="form-title">Opret</h2>
              <Form onSubmit={handleSignUpSubmit} className="signup-form">
                <Form.Group controlId="formBasicEmail">
                  <Form.Label><FaUser /> Email adresse</Form.Label>
                  <Form.Control type="email" placeholder="Email adresse" name="email" value={user.email} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label><FaLock /> Kodeord</Form.Label>
                  <Form.Control type="password" placeholder="Kodeord" name="password" value={user.password} onChange={handleInputChange} />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 signup-btn">Opret</Button>
              </Form>
            </Tab>

          </Tabs>
        </div>
      )}
    </div>
  );
}

export default UserForm;