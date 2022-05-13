import { ArrowRightIcon, Icon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Image,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';

const HouseCard = props => {
  const cardBackground = useColorModeValue('gray.100', 'gray.900');
  const arrowColor = useColorModeValue('purple.200', 'purple.900');
  const { address } = props.data;
  const streetCityStateZip = address.split(', ');
  const street = streetCityStateZip[0];
  const city = streetCityStateZip[1];
  const stateZip = streetCityStateZip[2];
  return (
    <Flex
      bg={cardBackground}
      borderRadius={'md'}
      filter={useColorModeValue(
        'drop-shadow(0px 0px 0px #777)',
        'drop-shadow(0px 0px 0px #333)'
      )}
      transition={'all 0.25s'}
      _hover={{
        transform: 'scale(1.05)',
        filter: useColorModeValue(
          'drop-shadow(4px 4px 4px #777)',
          'drop-shadow(4px 4px 4px #333)'
        ),
      }}
    >
      <Flex direction={{ base: 'column', lg: 'row' }} flexGrow={1}>
        <Image
          w={{ base: 'auto', lg: 140 }}
          h={{ base: 200, lg: 140 }}
          src={props.data.imgUrl[0].url}
          objectFit={'cover'}
          alt={'imgURL'}
          borderRadius={'md'}
        />
        <Flex
          direction={'column'}
          justifyContent={'space-between'}
          flexGrow={1}
          p={2}
        >
          <Flex direction={'row'} justifyContent={'space-between'}>
            <Flex direction={'column'}>
              <Text fontSize={'md'} fontWeight={'bold'}>
                {props.data.numBedrooms} beds, {props.data.numBathrooms} baths
              </Text>
              <Text fontSize={'sm'}>{street.slice(0, 23)}</Text>
              <Text fontSize={'sm'}>
                {city}, {stateZip}
              </Text>
            </Flex>
            <Text fontSize={'md'} fontWeight={'bold'}>
              {props.data.price}K Algo
            </Text>
          </Flex>
          <Flex direction={'row'} justifyContent={'space-between'}>
            <Box></Box>
            <Link
              to="/PropertyDetails"
              state={{ props }}
              as={ReactLink}
              display={'flex'}
              rounded={'md'}
              p={1}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Icon as={ArrowRightIcon} w={8} h={8} color={arrowColor} />
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HouseCard;
