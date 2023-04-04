import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import env from "react-dotenv";

interface User {
  email: string;
  password: string;
}

function UserForm() {
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedInUser = async () => {
      try {
        const response = await axios.get(`${env.BACKEND_URL}/api/user`, { withCredentials: true });
        if (response.status === 200) {
          setLoggedInUser(response.data.email);
          setIsAdmin(response.data.admin);
        }
      } catch (error) {
        console.log(error);
      }
    };


    checkLoggedInUser();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSignInSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${env.BACKEND_URL}/api/user/signin`, user, { withCredentials: true });
      if (response.status === 200) {
        setLoggedInUser(user.email);
        setUser({ email: '', password: '' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOutSubmit = async () => {
    try {
      const response = await axios.post(`${env.BACKEND_URL}/api/user/signout`, { withCredentials: true });
      if (response.status === 200) {
        setLoggedInUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {loggedInUser ? (
        <div>
          <h3>Logged In User: {loggedInUser}</h3>
          <h3>Admin: {isAdmin ? "Ja" : "Nej"}</h3>
          <Button variant="primary" onClick={handleSignOutSubmit}>
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="form-container">
          <Form onSubmit={handleSignInSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email" value={user.email} onChange={handleInputChange} />
            </Form.Group>
  
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password" value={user.password} onChange={handleInputChange} />
            </Form.Group>
  
            <button className="btn btn-primary w-100" type="button">Login</button>
          </Form>
        </div>
      )}
    </div>
  );
  
}

export default UserForm;
