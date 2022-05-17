import {
  Box,
  Flex,
  Text,
  Button,
  Link,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
const Wallet = props => {
  const handleSelectWallet = async () => {
    await axios.post(
      'http://localhost:8000/transactions/selectWallet',
      {
        address: props.wallet.id,
      },
      { withCredentials: true, credentials: 'include' }
    );
    alert(`Selected wallet with address: ${props.wallet.id}`);
    window.location.reload();
  };

  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    axios
      .post('http://localhost:8000/transactions/checkBalance', {
        address: props.wallet.id,
      })
      .then(response => {
        setWalletBalance(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <Flex maxW="100%" justifyContent="space-between" mb={4}>
      <Flex ml={10} alignItems={'center'}>
        <Text>{props.wallet.id}</Text>
      </Flex>
      <Flex direction={'row'} alignItems={'center'}>
        <Stat mr={5}>
          <StatLabel>Balance</StatLabel>
          <StatNumber>{walletBalance} ALGO</StatNumber>
          <StatHelpText>{walletBalance * 0.49} USD</StatHelpText>
        </Stat>
        <Link href="https://dispenser.testnet.aws.algodev.network/" isExternal>
          <Button>Add Funds</Button>
        </Link>
        {props.selectedWallet.id !== props.wallet.id ? (
          <Button ml={2} onClick={handleSelectWallet}>
            Select Wallet
          </Button>
        ) : (
          <Button isActive='false' ml={2}>
            Selected
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Wallet;
