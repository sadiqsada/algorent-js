import { Box, Flex, Text, Button, Link } from '@chakra-ui/react';
const Wallet = props => {
  return (
    <Flex maxW="100%" justifyContent="space-between" mb={4}>
      <Flex ml={10}>
        <Text>{props.wallet.id}</Text>
      </Flex>
      <Flex>
        <Link href="https://dispenser.testnet.aws.algodev.network/" isExternal>
          <Button>Add Funds</Button>
        </Link>
        <Button ml={2}>Select Wallet</Button>
      </Flex>
    </Flex>
  );
};

export default Wallet;
