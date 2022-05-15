import Wallet from './Wallet';
import { Flex } from '@chakra-ui/react';
const WalletList = () => {
  return (
    <Flex flexDirection='column' justifyContent="center" maxW='100%'>
        <Wallet />
        <Wallet />
        <Wallet />
    </Flex>
  );
};

export default WalletList;
