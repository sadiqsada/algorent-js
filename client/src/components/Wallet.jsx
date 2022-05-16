import { Box, Flex, Text, Button, Link } from '@chakra-ui/react';
import axios from 'axios';
const Wallet = props => {
  const handleSelectWallet = async () => {
    await axios.post('http://localhost:8000/transactions/selectWallet', {
      address: props.wallet.id
    }, { withCredentials: true, credentials: 'include' });
    alert(`Selected wallet with address: ${props.wallet.id}`);
  }
  return (
    <Flex maxW="100%" justifyContent="space-between" mb={4}>
      <Flex ml={10}>
        <Text>{props.wallet.id}</Text>
      </Flex>
      <Flex>
        <Link href="https://dispenser.testnet.aws.algodev.network/" isExternal>
          <Button>Add Funds</Button>
        </Link>
        <Button ml={2} onClick={handleSelectWallet}>Select Wallet</Button>
      </Flex>
    </Flex>
  );
};

export default Wallet;
