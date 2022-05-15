import { Box, Flex, Text, Button } from '@chakra-ui/react';
const Wallet = props => {
  return (
    <Flex maxW="100%" justifyContent="space-between" mb={4}>
      <Flex ml={10}>
        <Text>wallet address</Text>
      </Flex>
      <Flex>
        <Button>select wallet</Button>
      </Flex>
    </Flex>
  );
};

export default Wallet;
