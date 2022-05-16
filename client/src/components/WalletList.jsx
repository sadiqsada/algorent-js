import Wallet from './Wallet';
import { Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
const WalletList = () => {
  const [wallets, setWallets] = useState([]);
  const [walletBalance, setWalletBalance] = useState([]);
  useEffect(() => {
    const getAllWallets = async () => {
      const walletResponse = await axios.get(
        'https://algorent-proj.herokuapp.com/transactions/getWallets',
        { withCredentials: true, credentials: 'include' }
      );
      setWallets(walletResponse.data);
    };
    getAllWallets();

  }, []);
  return (
    <Flex flexDirection="column" justifyContent="center" maxW="100%">
      {wallets.map((wallet, i) => 
        <Wallet key={i} wallet={wallet} />
      )}
    </Flex>
  );
};

export default WalletList;
