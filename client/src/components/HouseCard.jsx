import { ArrowRightIcon, Icon } from '@chakra-ui/icons';
import { Box, Flex, Image, Text, Link, useColorModeValue } from '@chakra-ui/react';

const HouseCard = props => {
  const cardBackground = useColorModeValue('gray.100', 'gray.900');
  const amenitiesBackground = useColorModeValue('purple.200', 'purple.900');
  const arrowColor = useColorModeValue('purple.200', 'purple.900'); // useColorModeValue('#61db8e', '#21944c');
  return (
    <Flex bg={cardBackground} borderRadius="md" minW={'450px'} maxW={'500px'}>
      <Box>
        <Image
          w="140px"
          h="140px"
          src={props.data.imgUrl}
          objectFit={'cover'}
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
        <Flex justify={'right'} mb={2} mt={2} mr={2}>
          <Link rounded={'md'} p={1} href='PropertyDetails'><Icon as={ArrowRightIcon} w={8} h={8} color={arrowColor} /></Link>
        </Flex>
        <Box
          bg={amenitiesBackground}
          size="sm"
          borderRadius="md"
          mt={0}
          ml={5}
          mr={20}
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
