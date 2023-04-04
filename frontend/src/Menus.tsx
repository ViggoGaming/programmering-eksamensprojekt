import React from 'react';
//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";

import Menu from './FetchMenus'
import Header from './Header'

function App() {
  return (
    <div>
        <Header />
        <Menu />
    </div>
  );
}

export default App;
