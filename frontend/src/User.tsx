import React from 'react';
//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";

import UserForm from './UserForm';
import Header from './Header'

function User() {
  return (
    <div>
    <Header />
    <UserForm />
    </div>
  );
}

export default User;
