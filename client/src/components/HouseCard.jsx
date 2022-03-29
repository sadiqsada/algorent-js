import { Box, Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';

const HouseCard = props => {
  const cardBackground = useColorModeValue('gray.100', 'gray.900');
  const amenitiesBackground = useColorModeValue('purple.200', 'purple.900');
  return (
    <Flex bg={cardBackground} borderRadius="md" cursor="pointer">
      <Box>
        <Image
          w="120px"
          h="120px"
          src={props.data.imgUrl}
          alt="imgUrl"
          borderRadius="md"
        />
      </Box>
      <Flex direction="column" mt={1} flexGrow={1}>
        <Flex justifyContent="space-between">
          <Flex direction="column" justifyContent="center" ml={2}>
            <Text fontWeight="bold">{props.data.title}</Text>
            <Text fontSize="sm">{props.data.address.split(',')[0].slice(0, 25)}</Text>
          </Flex>
          <Text fontWeight="bold" mr={2}>
            {props.data.price}K Algo
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
          <Text align="center">
            Matches {props.data.numAmenities} Amenities
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default HouseCard;
