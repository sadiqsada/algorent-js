import { ArrowRightIcon, Icon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Image,
  Text,
  Link,
  useColorModeValue,
  IconButton,
  Divider,
  Button,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

const ReceivedOfferCard = props => {
  const webUrl = 'http://localhost:8000'; //'http://localhost:8000';
  const cardBackground = useColorModeValue('gray.100', 'gray.900');

  const [house, setHouse] = useState({
    imgUrl: [
      'https://pixselo.com/wp-content/uploads/2018/03/dummy-placeholder-image-400x400.jpg',
    ],
    numBedrooms: 0,
    numBathrooms: 0,
    address: '',
    city: '',
    state: '',
    zipCode: '00000',
    price: 0,
  });
  useEffect(() => {
    axios
      .post(webUrl + '/getHouseByID', {
        houseID: props.data.house,
      })
      .then(response => {
        setHouse(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  const { isOpen: isOpenHouseDetails, onToggle: onToggleHouseDetails } =
    useDisclosure();

  // When accept button is clicked, this function is called with "true" boolean value, and "false" boolean value for decline button
  const handleOfferAnswer = async answer => {
    if (!answer) {
      await axios.post(
        `${webUrl}/offer/removeOffer`,
        {
          id: props.data.id,
        },
        { withCredentials: true, credentials: 'include' }
      );
      alert('Offer Deleted');
      window.location.reload();
    } else {
      await axios.post(
        `${webUrl}/transactions/sendTransaction`,
        {
          amount: props.data.price * 1000,
          offerId: props.data.id
        },
        { withCredentials: true, credentials: 'include' }
      );
      await axios.post(
        `${webUrl}/offer/removeOffer`,
        {
          id: props.data.id,
        },
        { withCredentials: true, credentials: 'include' }
      );
      alert('Transaction Processed Successfully');
      window.location.reload();
    }
  };

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
        // transform: 'scale(1.01)',
        filter: useColorModeValue(
          'drop-shadow(4px 4px 4px #777)',
          'drop-shadow(4px 4px 4px #333)'
        ),
      }}
      h={'min-content'}
    >
      <Flex direction={'column'} w={'100%'}>
        <Flex direction={'row'} justifyContent={'space-between'} w={'100%'}>
          <Flex direction={'column'} justifyContent={'space-between'} p={4}>
            <Text fontSize={'md'} fontWeight={'bold'}>
              Buyer: {props.data.name}
            </Text>
            <Divider />
            <Text fontSize={'md'} fontWeight={'bold'}>
              Offering Price: {props.data.price}K Algo
            </Text>
          </Flex>
          <Flex direction={'column'}>
            <IconButton
              aria-label={'Accept Offer'}
              colorScheme={'green'}
              icon={<AiOutlineCheck size={20} />}
              w={12}
              h={12}
              borderBottomRadius={'none'}
              onClick={() => {
                handleOfferAnswer(true);
              }}
            />
            <IconButton
              aria-label={'Accept Offer'}
              colorScheme={'red'}
              icon={<AiOutlineClose size={20} />}
              w={12}
              h={12}
              borderTopRadius={'none'}
              onClick={() => {
                handleOfferAnswer(false);
              }}
            />
          </Flex>
        </Flex>
        <Divider />
        <Button size={'sm'} onClick={onToggleHouseDetails}>
          {isOpenHouseDetails ? 'Close House Details' : 'Show House Details'}
        </Button>
        <Collapse mt={4} in={isOpenHouseDetails}>
          <Flex direction={{ base: 'column', lg: 'row' }} flexGrow={1}>
            <Image
              w={{ base: 'auto', lg: 140 }}
              h={{ base: 200, lg: 140 }}
              src={house.imgUrl[0]
                .toString()
                .slice(1, -1)
                .split(',')[0]
                .slice(1, -1)}
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
                    {house.numBedrooms} beds, {house.numBathrooms} baths
                  </Text>
                  <Text fontSize={'sm'}>{house.address}</Text>
                </Flex>
              </Flex>
              <Text fontSize={'md'} fontWeight={'bold'}>
                Original Price: {house.price}K Algo
              </Text>
            </Flex>
          </Flex>
        </Collapse>
      </Flex>
    </Flex>
  );
};

export default ReceivedOfferCard;
