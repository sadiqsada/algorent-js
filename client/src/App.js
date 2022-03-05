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
