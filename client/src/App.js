import React from 'react';
import { BrowserRouter, Routes, Route, Link as RouteLink } from "react-router-dom";

import { Header } from './components/sections/Header';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { SignUp } from './pages/SignUp';
export default function App() {
    return (
        <BrowserRouter>
              <Header />
              <Routes>
                <Route path='/' element={<Landing/>} />
                <Route path='/login' element={<Login/>} />
                <Route path='/SignUp' element={<SignUp/>} />
                <Route path='/ForgotPassword' element={<ForgotPassword/>} />
              </Routes>
        </BrowserRouter>
    );
}

/* --- BELOW IS THE OLD App.js, I kept it for no particular reason ---
import React from 'react';
import {
  ChakraProvider,
  theme
} from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Explore from './pages/Explore';

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Explore />
    </ChakraProvider>
  );
}

export default App;
*/