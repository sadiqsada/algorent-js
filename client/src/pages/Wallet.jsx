import { useState } from 'react';
import { Flex, Button, Box } from '@chakra-ui/react';
import axios from 'axios';

const Wallet = () => {
  const connectWallet = async () => {
    const account = await axios.get(
      'http://localhost:8000/transactions/createAccount'
    );
    console.log(account);
  };

  return (
    <Flex justifyContent="center" mt={4}>
      <Button onClick={connectWallet}> Connect Wallet</Button>
    </Flex>
  );
};

export default Wallet;
