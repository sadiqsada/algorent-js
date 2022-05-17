import Wallet from './Wallet';
import { Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
const WalletList = () => {
  const [wallets, setWallets] = useState([]);
  const [walletBalance, setWalletBalance] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');
  useEffect(() => {
    const getAllWallets = async () => {
      const walletResponse = await axios.get(
        'http://localhost:8000/transactions/getWallets',
        { withCredentials: true, credentials: 'include' }
      );
      setWallets(walletResponse.data.wallets);
      setSelectedWallet(walletResponse.data.selectedWallet);
    };
    getAllWallets();

  }, []);
  return (
    <Flex flexDirection="column" justifyContent="center" maxW="100%">
      {wallets.map((wallet, i) => 
        <Wallet key={i} wallet={wallet} selectedWallet={selectedWallet} />
      )}
    </Flex>
  );
};

export default WalletList;
