import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/sections/Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Explore from './pages/Explore';
import Axios from 'axios';
import Cookies from 'js-cookie';
import AuthContext from './context/AuthContext';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = Cookies.get('token');
      if (!token) return;

      const tokenRes = await Axios.post(
        'http://localhost:8000/tokenIsValid',
        null,
        {
          headers: { 'x-auth-token': token },
        }
      );

      if (tokenRes.data) setIsLoggedIn(true);
    };
    checkLoggedIn();
  }, []);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/Explore" element={<Explore />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;
