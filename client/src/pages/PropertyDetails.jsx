import React, { useEffect } from 'react';
import { Icon } from '@chakra-ui/icons';
import {
  Flex,
  Image,
  Text,
  Box,
  Spacer,
  useColorModeValue,
  Input,
  Center,
  Divider,
  Button,
  Stack,
  IconButton,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import SimpleImageSlider from 'react-simple-image-slider';
import { FaSwimmingPool, FaFan, FaFileContract, FaHeart } from 'react-icons/fa';
import { BiBuildingHouse } from 'react-icons/bi';
import {
  GiWoodBeam,
  GiWashingMachine,
  GiHomeGarage,
  GiPathDistance,
} from 'react-icons/gi';
import { MdBalcony, MdLocationOn } from 'react-icons/md';
import { CgGym, CgSmartHomeWashMachine } from 'react-icons/cg';
import { BsCartPlusFill } from 'react-icons/bs';
import { useRef, useState } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import axios from 'axios';

const PropertyDetails = () => {
  const location = useLocation();
  const { props } = location.state;
  const shortlistColor = useColorModeValue('red.500', 'red.200');

  const handleShortlist = async () => {
    const { address } = props.data;
    const stateZip = address.split(', ')[2];
    const zipCode = stateZip.split(' ')[1];
    try {
      const response = await axios.post(
        'http://localhost:8000/shortlist',
        { address, zipCode },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );
      alert(response.data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  useEffect(() => {
    const updateRecentlyViewed = async props => {
      const { address } = props.data;
      await axios.post(
        'http://localhost:8000/recentlyViewed',
        { address },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );
    };
    updateRecentlyViewed(props);
  }, []);
  const images = props.data.imgUrl;
  const mapColor = useColorModeValue(
    props.data.mapUrl[0],
    props.data.mapUrl[1]
  );

  const popupModal = useRef(null);
  const popupModalImg = useRef(null);
  function modalPopUp(idx) {
    if (popupModal.current && popupModalImg.current) {
      if (idx !== null) {
        popupModalImg.current.src = images[idx].url;
        popupModal.current.style.display = 'block';
      } else {
        popupModal.current.style.display = 'none';
      }
    }
  }

  const { isLoaded } = useJsApiLoader({
    //googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: 'AIzaSyD96V2GIJeJPJqp7wFky7Z6u53dBI_KCR4',
    libraries: ['places'],
  });

  const [routeText, setRouteText] = useState('');
  const destinationRef = useRef();
  const showDistanceRef = useRef();

  if (!isLoaded) {
    return <></>;
  }

  async function calculateRoute() {
    if (destinationRef.current.value === '') {
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: props.data.address,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    const distance = results.routes[0].legs[0].distance.text;
    const duration = results.routes[0].legs[0].duration.text;
    setRouteText(
      `Driving to ${destinationRef.current.value} takes ${duration} (${distance})`
    );
  }

  const calculateAptSize = () => {
    let size = 500;
    if (props.data.numBeds > 3) size = size * 2;
    else if (props.data.numBeds > 2) size = size * 1.5;
    else if (props.data.numBeds > 1) size = size * 1.25;
    if (props.data.numBaths > 2) size = size * 1.8;
    else if (props.data.numBaths > 1) size = size * 1.4;
    if (props.data.price > 800) size = size * 2;
    else if (props.data.price > 600) size = size * 1.8;
    else if (props.data.price > 400) size = size * 1.4;
    else if (props.data.price > 200) size = size * 1.2;
    return Math.round(size);
  };

  const getAmenities = amenity => {
    if (amenity === 'pool') {
      if (props.data.numBeds > 3) return 'green.500';
      else return 'red.500';
    } else if (amenity === 'balcony') {
      if (props.data.numBeds > 1) return 'green.500';
      else return 'red.500';
    } else if (amenity === 'gym') {
      if (props.data.numBeds > 3 && props.data.numBaths > 2) return 'green.500';
      else return 'red.500';
    } else if (amenity === 'on-site laundry') {
      if (props.data.numBeds > 2) return 'green.500';
      else return 'red.500';
    } else if (amenity === 'garage') {
      if (props.data.numBeds > 2) return 'green.500';
      else return 'red.500';
    }
  };

  return (
    <Flex direction={'row'} w={'100%'} h={'93vh'} overflow={'hidden'}>
      <Flex
        direction={'column'}
        maxW={500}
        boxShadow={'dark-lg'}
        zIndex={1}
        wrap={'nowrap'}
      >
        <Box>
          <SimpleImageSlider
            width={500}
            height={300}
            alt={'Images'}
            images={images}
            showBullets={true}
            showNavs={true}
            navStyle={1}
            navSize={60}
            navMargin={0}
            style={{ cursor: 'pointer' }}
            onClick={(idx, event) => {
              modalPopUp(idx);
            }}
          />
        </Box>
        <Flex
          direction={'column'}
          p={5}
          overflowY={'scroll'}
          overflowX={'hidden'}
          css={{ '&::-webkit-scrollbar': { display: 'none' } }}
        >
          <Flex direction={'row'} mb={5}>
            <Flex direction={'column'}>
              <Text fontSize={'xl'} fontWeight={600} alt={'Title'}>
                {props.data.title}
              </Text>
              <Text mt={5} fontSize={'lg'} fontWeight={500} alt={'Contact'}>
                (634)-777-****
              </Text>
            </Flex>
            <Spacer />
            <Flex direction={'column'}>
              <Text fontSize={'xl'} fontWeight={600} alt={'Price'}>
                {Math.round(props.data.price * 1000)} ALGO
              </Text>
              <Center mt={0}>
                <Text fontSize={'md'} fontWeight={300} alt={'USPrice'}>
                  {Math.round(props.data.price * 0.78 * 1000)} USD
                </Text>
              </Center>
            </Flex>
          </Flex>
          <Flex direction={'row'} m={2} ml={0}>
            <Icon as={MdLocationOn} w={8} h={8} mr={3} />
            <Text fontSize={'sm'} fontWeight={600} pt={1}>
              {props.data.address}
            </Text>
          </Flex>
          <Flex direction={'row'} m={2} ml={0}>
            <Icon as={BiBuildingHouse} w={7} h={7} mr={4} />
            <Text fontSize={'sm'} fontWeight={600} pt={1}>
              {props.data.numBeds} Bedroom(s) - {props.data.numBaths}{' '}
              Bathroom(s) - {calculateAptSize()} sqft
            </Text>
          </Flex>
          <Flex direction={'row'} m={2} ml={0}>
            <Icon as={GiPathDistance} w={8} h={8} mr={3} />
            <Flex direction={'column'}>
              <Flex direction={'row'}>
                <Text
                  ref={showDistanceRef}
                  fontSize={'sm'}
                  fontWeight={600}
                  pt={1}
                  mb={2}
                >
                  Find distance from an address
                </Text>
              </Flex>
              <Autocomplete>
                <Input
                  type={'text'}
                  placeholder={'Destination'}
                  ref={destinationRef}
                  fontSize={'sm'}
                  fontWeight={600}
                  size={'sm'}
                />
              </Autocomplete>
              <Button
                colorScheme={'purple'}
                type={'submit'}
                size={'xs'}
                fontSize={'sm'}
                fontWeight={600}
                onClick={calculateRoute}
              >
                Find distance
              </Button>
              <Text fontSize={'sm'} fontWeight={600} mt={2}>
                {routeText}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={'row'} m={2} ml={0}>
            <Icon as={FaFileContract} w={7} h={7} mr={4} />
            <Text fontSize={'sm'} fontWeight={600} pt={1}>
              Matching {props.data.numAmenities}/3 Amenities
            </Text>
          </Flex>

          <Divider borderWidth={1} mt={3} mb={3} />

          <Center>
            <Text fontSize={'lg'} fontWeight={600}>
              Amenities
            </Text>
          </Center>
          <Flex direction={'row'} wrap={'wrap'} mt={3}>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon
                  as={FaSwimmingPool}
                  color={getAmenities('pool')}
                  w={8}
                  h={8}
                />
              </Center>
              <Center>
                <Text
                  fontSize={'xs'}
                  color={getAmenities('pool')}
                  fontWeight={600}
                >
                  Pool
                </Text>
              </Center>
            </Flex>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon as={GiWoodBeam} color={'green.500'} w={8} h={8} />
              </Center>
              <Center>
                <Text fontSize={'xs'} color={'green.500'} fontWeight={600}>
                  Hardwood Floor
                </Text>
              </Center>
            </Flex>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon
                  as={CgSmartHomeWashMachine}
                  color={'green.500'}
                  w={8}
                  h={8}
                />
              </Center>
              <Center>
                <Text fontSize={'xs'} color={'green.500'} fontWeight={600}>
                  Dishwasher
                </Text>
              </Center>
            </Flex>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon as={FaFan} color={'green.500'} w={8} h={8} />
              </Center>
              <Center>
                <Text fontSize={'xs'} color={'green.500'} fontWeight={600}>
                  Air Conditioning
                </Text>
              </Center>
            </Flex>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon
                  as={MdBalcony}
                  color={getAmenities('balcony')}
                  w={8}
                  h={8}
                />
              </Center>
              <Center>
                <Text
                  fontSize={'xs'}
                  color={getAmenities('balcony')}
                  fontWeight={600}
                >
                  Balcony
                </Text>
              </Center>
            </Flex>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon as={CgGym} color={getAmenities('gym')} w={8} h={8} />
              </Center>
              <Center>
                <Text
                  fontSize={'xs'}
                  color={getAmenities('gym')}
                  fontWeight={600}
                >
                  Gym
                </Text>
              </Center>
            </Flex>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon
                  as={GiWashingMachine}
                  color={getAmenities('on-site laundry')}
                  w={8}
                  h={8}
                />
              </Center>
              <Center>
                <Text
                  fontSize={'xs'}
                  color={getAmenities('on-site laundry')}
                  fontWeight={600}
                >
                  On-Site Laundry
                </Text>
              </Center>
            </Flex>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon
                  as={GiHomeGarage}
                  color={getAmenities('garage')}
                  w={8}
                  h={8}
                />
              </Center>
              <Center>
                <Text
                  fontSize={'xs'}
                  color={getAmenities('garage')}
                  fontWeight={600}
                >
                  Garage
                </Text>
              </Center>
            </Flex>
          </Flex>

          <Divider borderWidth={1} mt={3} mb={6} />

          <Center>
            <Stack direction={'row'} spacing={20}>
              <Flex direction={'column'}>
                <IconButton
                  aria-label={'Favorite property'}
                  colorScheme={'red'}
                  icon={<FaHeart size={30} />}
                  w={16}
                  h={16}
                  isRound
                  onClick={handleShortlist}
                />
                <Center mt={1}>
                  <Text fontSize={'md'} color={shortlistColor} fontWeight={600}>
                    Fav
                  </Text>
                </Center>
              </Flex>
              <Flex direction={'column'}>
                <IconButton
                  aria-label={'Buy property'}
                  colorScheme={'purple'}
                  icon={<BsCartPlusFill size={30} />}
                  w={16}
                  h={16}
                  isRound
                  onClick={() => {
                    alert('BUY!');
                  }}
                />
                <Center mt={1}>
                  <Text fontSize={'md'} fontWeight={600}>
                    Cart
                  </Text>
                </Center>
              </Flex>
            </Stack>
          </Center>
        </Flex>
      </Flex>

      <Image
        w={'100%'}
        h={'100vh'}
        objectFit={'cover'}
        src={mapColor}
        alt={'GoogleMapsLocation'}
        borderRadius={'md'}
        zIndex={0}
      />

      <Box
        ref={popupModal}
        pos={'absolute'}
        w={'100%'}
        h={'94vh'}
        zIndex={10}
        display={'none'}
        overflow={'hidden'}
      >
        <Box
          pos={'absolute'}
          w={'100%'}
          h={'100%'}
          opacity={0.5}
          onClick={() => {
            modalPopUp(null);
          }}
          cursor={'pointer'}
          backgroundColor={'gray.900'}
        ></Box>
        <Center pos={'absolute'} w={'100%'} h={'100%'} pointerEvents={'none'}>
          <Image
            pointerEvents={'auto'}
            ref={popupModalImg}
            objectFit={'cover'}
            minW={600}
            minH={400}
            w={'60vw'}
            h={'auto'}
            maxW={'90vw'}
            maxH={'85vh'}
          />
        </Center>
      </Box>
    </Flex>
  );
};

export default PropertyDetails;
