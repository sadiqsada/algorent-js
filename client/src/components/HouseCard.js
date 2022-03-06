import { Box, Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';

const HouseCard = () => {
  const cardBackground = useColorModeValue('gray.100', 'gray.900');
  const amenitiesBackground = useColorModeValue('purple.200', 'purple.900');
  return (
    <Flex bg={cardBackground} borderRadius="md" cursor="pointer">
      <Box>
        <Image
          w="120px"
          h="120px"
          src="https://bit.ly/dan-abramov"
          alt="dan"
          borderRadius="md"
        />
      </Box>
      <Flex direction="column" mt={1} flexGrow={1}>
        <Flex justifyContent="space-between">
          <Flex direction="column" justifyContent="center" ml={2}>
            <Text fontWeight="bold">Heritage Park</Text>
            <Text fontSize="sm">555 Washington Avenue</Text>
          </Flex>
          <Text fontWeight="bold" mr={2}>
            275K Algo
          </Text>
        </Flex>
        <Box
          bg={amenitiesBackground}
          size="sm"
          borderRadius="md"
          mt={8}
          ml={2}
          w="70%"
        >
          <Text align="center">Matches 3 Amenities</Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default HouseCard;
