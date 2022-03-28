import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/sections/Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Explore from './pages/Explore';
import Shortlist from './pages/Shortlist';
import RecentlyViewed from './pages/RecentlyViewed';
import Wallet from './pages/Wallet';
import Axios from 'axios';
import Cookies from 'js-cookie';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      
      const tokenRes = await Axios.post(
        'http://localhost:8000/tokenIsValid',
        null,
        {
          headers: { 'x-auth-token': token },
        }
      );

      setIsLoggedIn(tokenRes.data);
      setIsLoading(false);
    };
    checkLoggedIn();
  }, []);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isLoggedIn, isLoading, setIsLoggedIn }}>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/Explore" element={<Explore />} />
          <Route
            path="/Shortlist"
            element={
              <ProtectedRoute>
                <Shortlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RecentlyViewed"
            element={
              <ProtectedRoute>
                <RecentlyViewed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;
