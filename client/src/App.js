import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/sections/Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Explore from './pages/Explore';

export const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/Explore" element={<Explore />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
