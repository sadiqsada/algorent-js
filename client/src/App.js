import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/sections/Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Explore from './pages/Explore';
import CreateListing from './pages/CreateListing';
import Shortlist from './pages/Shortlist';
import RecentlyViewed from './pages/RecentlyViewed';
import PropertyDetails from './pages/PropertyDetails';
import Wallet from './pages/Wallet';
import AccountSetting from './pages/AccountSetting'
import Axios from 'axios';
import Cookies from 'js-cookie';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const web_url = 'https://algorent-proj.herokuapp.com' //'http://localhost:8000'; //
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      const tokenRes = await Axios.post(
        web_url + '/tokenIsValid',
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
          <Route path="/PropertyDetails" element={<PropertyDetails />} />
          <Route
            path="/CreateListing"
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="/AccountSetting"
            element={
              <ProtectedRoute>
                <AccountSetting />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;
