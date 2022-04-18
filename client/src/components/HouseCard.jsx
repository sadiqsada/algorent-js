import { ArrowRightIcon, Icon } from '@chakra-ui/icons';
import { Box, Flex, Image, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { Link as ReactLink } from "react-router-dom";


const HouseCard = props => {
  const cardBackground = useColorModeValue('gray.100', 'gray.900');
  const amenitiesBackground = useColorModeValue('purple.200', 'purple.900');
  const arrowColor = useColorModeValue('purple.200', 'purple.900'); // useColorModeValue('#61db8e', '#21944c');
  return (
    <Flex bg={cardBackground} borderRadius={'md'}>
      <Flex direction={{base: 'column', lg: 'row'}} flexGrow={1}>
        <Image
            w={{base: 'auto', lg: 140}}
            h={{base: 200, lg: 140}}
            src={props.data.imgUrl[0].url}
            objectFit={'cover'}
            alt={'imgURL'}
            borderRadius={'md'}
          />
        <Flex direction={'column'} justifyContent={'space-between'} flexGrow={1} p={2}>
          <Flex direction={'row'} justifyContent={'space-between'}>
            <Flex direction={'column'}>
              <Text fontSize={'md'} fontWeight={'bold'}>{props.data.numBedrooms} beds, {props.data.numBathrooms} baths</Text>
              <Text fontSize={'sm'}>{props.data.address.slice(0, 15)}</Text>
            </Flex>
            <Text fontSize={'md'} fontWeight={'bold'}>{props.data.price}K Algo</Text>
          </Flex>
          <Box bg={amenitiesBackground} size="sm" borderRadius="md" mt={{base: 3, lg: 0}}>
            <Text align={'center'} fontSize={'sm'} fontWeight={'bold'}>Matches {props.data.numAmenities} Amenities</Text>  
          </Box>
        </Flex>
        <Link
          //href={`PropertyDetails?property=${JSON.stringify(props.data.address)}`}
          to="/PropertyDetails"
          state={{ props }}
          as={ReactLink}
          display={'flex'}
          rounded={'md'}
          p={1}
          alignItems={'center'}
          justifyContent={'center'}>
            <Icon as={ArrowRightIcon} w={8} h={8} color={arrowColor} /></Link>
      </Flex>
    </Flex>
  );
};

export default HouseCard;
