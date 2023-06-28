import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './Components/Login'
import Signup from './Components/Signup'
import Home from './Components/Home'
import Orders from './Components/Orders';
import Stock from './Components/Stock';
import Dashboard from './Components/Dashboard';
import { useState } from 'react';

function App() {
  const [name, setName] = useState('')
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' element = {<Login/>}/>
          <Route exact path='/signup' element = {<Signup/>}/>
          <Route exact path='/home' element = {<Home name = {name} setName={setName}/>}/>
          <Route exact path='/orders' element = {<Orders name = {name}/>}/>
          <Route exact path='/stock' element = {<Stock name = {name}/>}/>
          <Route exact path='/dashboard' element = {<Dashboard name = {name}/>}/>
        </Routes>
      </Router>

    </div>
  );
}

export default App;
