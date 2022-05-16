import React, { useEffect } from 'react';
import { Icon } from '@chakra-ui/icons';
import {
  Flex,
  AspectRatio,
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
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import SimpleImageSlider from 'react-simple-image-slider';
import {
  FaSwimmingPool,
  FaFan,
  FaFileContract,
  FaHeart,
  FaHandshake,
} from 'react-icons/fa';
import { BiBuildingHouse } from 'react-icons/bi';
import {
  GiWoodBeam,
  GiWashingMachine,
  GiHomeGarage,
  GiPathDistance,
} from 'react-icons/gi';
import { IoIosClose } from 'react-icons/io';
import { MdBalcony, MdLocationOn, MdLocalOffer } from 'react-icons/md';
import { CgGym, CgSmartHomeWashMachine } from 'react-icons/cg';
import { useRef, useState } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios'; 
//import img_s from './sharpened_image.png'
const PropertyDetails = () => {
  const location = useLocation();
  const { props } = location.state;
  const { address } = props.data;
  const iframe_style = useColorModeValue('invert(0%)', 'invert(90%)');
  const contactColor = useColorModeValue('#2eca6a', '#176534');
  const shortlistColor = useColorModeValue('red.500', 'red.200');
  const cartColor = useColorModeValue('purple.500', 'purple.200');
  const popupModalColor = useColorModeValue('gray.900', 'gray.400');
  const modalColor = useColorModeValue('white', 'gray.800');
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const [offerField, setOfferField] = useState(props.data.price * 1000);
  const handleOfferField = event => setOfferField(event.target.value);
  const handleOffer = async () => {
    const currentUser = await axios.get('https://algorent-proj.herokuapp.com/getUser', { withCredentials: true, credentials: 'include' });
    if (!currentUser.data.selectedWallet) {
      alert('Please add a wallet and add funds');
      offerModalPopup();
      return;
    }

    await axios.post(
      'https://algorent-proj.herokuapp.com/offer/addOffer',
      {
        price: parseInt(offerField) / 1000,
        address: props.data.address,
      },
      { withCredentials: true, credentials: 'include' }
    );
    alert('Offer Successfully Sent');
    offerModalPopup();
  };

  const web_url = 'https://algorent-proj.herokuapp.com'; // https://algorent-proj.herokuapp.com'; //

  // const handleSharpen = async () => {
  //   const
  // }
  const handleShortlist = async () => {
    const { address } = props.data;
    const stateZip = address.split(', ')[2];
    const zipCode = stateZip.split(' ')[1];
    try {
      const response = await axios.post(
        web_url + '/shortlist',
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
    const updateRecentlyViewed = async () => {
      await axios.post(
        web_url + '/recentlyViewed',
        { address },
        {
          withCredentials: true,
          credentials: 'include',
        }
      );
    };
    updateRecentlyViewed();
  }, [address]);
  const images = props.data.imgUrl;
  const mapColor = props.data.mapUrls[0]

  const popupModalImgContainer = useRef(null);

  const popupModal = useRef(null);
  const popupModalImg = useRef(null);
  const imgModalPopUp = idx => {
    if (popupModalImgContainer.current && popupModalImg.current) {
      if (idx !== null) {
        popupModalImg.current.src = images[idx].url;
        popupModalImgContainer.current.style.display = 'block';
      } else {
        popupModalImgContainer.current.style.display = 'none';
      }
    }
  };

  const popupModalOffer = useRef(null);
  const offerModalPopup = () => {
    if (popupModalOffer.current) {
      console.log(popupModalOffer.current.style.display);
      if (!popupModalOffer.current.style.display || popupModalOffer.current.style.display === 'none') {
        popupModalOffer.current.style.display = 'block';
      } else {
        popupModalOffer.current.style.display = 'none';
      }
    }
  };
  // const modalPopUp = async (idx) => {
  //   if (popupModal.current && popupModalImg.current) {
  //     if (idx !== null) {
  //       let image_url = images[idx].url
  //       console.log(image_url)
  //       let img = process.env.PUBLIC_URL + '/sharpened_image.png'
  //       await axios
  //       .post(web_url + '/sharpen', {
  //         url: image_url
  //       })
  //       .then(response => {
  //         console.log(process.env.PUBLIC_URL + '')
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });

  //       popupModalImg.current.src = require('./sharpened_image.png')//img_s;//images[idx].url;
  //       popupModal.current.style.display = 'flex';
  //     } else {
  //       popupModal.current.style.display = 'none';
  //     }
  //   }
  // }

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
    if (props.data.numBedrooms > 3) size = size * 2;
    else if (props.data.numBedrooms > 2) size = size * 1.5;
    else if (props.data.numBedrooms > 1) size = size * 1.25;
    if (props.data.numBathrooms > 2) size = size * 1.8;
    else if (props.data.numBathrooms > 1) size = size * 1.4;
    if (props.data.price > 800) size = size * 2;
    else if (props.data.price > 600) size = size * 1.8;
    else if (props.data.price > 400) size = size * 1.4;
    else if (props.data.price > 200) size = size * 1.2;
    return Math.round(size);
  };

  const getAmenities = amenity => {
    if (amenity === 'pool') {
      if (props.data.numBedrooms > 3) return 'green.500';
      else return 'red.500';
    } else if (amenity === 'balcony') {
      if (props.data.numBedrooms > 1) return 'green.500';
      else return 'red.500';
    } else if (amenity === 'gym') {
      if (props.data.numBedrooms > 3 && props.data.numBathrooms > 2)
        return 'green.500';
      else return 'red.500';
    } else if (amenity === 'on-site laundry') {
      if (props.data.numBedrooms > 2) return 'green.500';
      else return 'red.500';
    } else if (amenity === 'garage') {
      if (props.data.numBedrooms > 2) return 'green.500';
      else return 'red.500';
    }
  };

  const getConfirmationAmenities = amenity => {
    if (getAmenities(amenity) === 'green.500') {
      return `Has ` + amenity;
    } else {
      //return `Does not have `+amenity;
      return ``;
    }
  };

  function BasicUsage() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <Button onClick={onOpen}>Open Modal</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>This is the Modal Body</p>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
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
              imgModalPopUp(idx);
            }}
            // onClick={(idx, event) => {{
            //   modalPopUp(idx)
            // }}}
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
              <Text
                mt={5}
                fontSize={'lg'}
                textColor={contactColor}
                fontWeight={500}
                alt={'Contact'}
              >
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
              {props.data.numBedrooms} Bedroom(s) - {props.data.numBathrooms}{' '}
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
                mt={1}
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
          {isLoggedIn ? (
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
                    <Text
                      fontSize={'md'}
                      color={shortlistColor}
                      fontWeight={600}
                    >
                      Shortlist
                    </Text>
                  </Center>
                </Flex>
                <Flex direction={'column'}>
                  <IconButton
                    aria-label={'Buy property'}
                    colorScheme={'purple'}
                    icon={<MdLocalOffer size={35} />}
                    w={16}
                    h={16}
                    isRound
                    onClick={() => {
                      offerModalPopup();
                    }}
                  />
                  <Center mt={1}>
                    <Text color={cartColor} fontSize={'md'} fontWeight={600}>
                      Offer
                    </Text>
                  </Center>
                </Flex>
              </Stack>
            </Center>
          ) : null}
        </Flex>
      </Flex>


      <AspectRatio 
        w={'100%'}
        h={'100vh'}
        objectFit={'cover'}
        borderRadius={'md'}
        zIndex={0}
      >
      <iframe style={{filter: iframe_style}} src={mapColor} allowFullScreen />
      </AspectRatio>

      {/* <Image
        w={'100%'}
        h={'100vh'}
        objectFit={'cover'}
        src={mapColor}
        alt={'GoogleMapsLocation'}
        borderRadius={'md'}
        zIndex={0}
      /> */}

      <Box
        ref={popupModalImgContainer}
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
            imgModalPopUp(null);
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

      <Box
        ref={popupModalOffer}
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
          backgroundColor={'gray.900'}
        ></Box>
        <Center pos={'absolute'} w={'100%'} h={'100%'} pointerEvents={'none'}>
          <Flex
            direction={'column'}
            minW={500}
            minH={600}
            backgroundColor={modalColor}
            p={5}
            pointerEvents={'all'}
          >
            <Flex direction={'row'} w={'100%'} justifyContent={'right'}>
              <IconButton
                aria-label={'Close Offer'}
                icon={<IoIosClose size={55} />}
                w={12}
                h={12}
                isRound
                onClick={() => {
                  offerModalPopup();
                }}
              />
            </Flex>

            <Flex direction={'row'} w={'100%'} justifyContent={'center'}>
              <Text fontSize={'2xl'} fontWeight={600} alt={'Confirmation'}>
                Offer Confirmation
              </Text>
            </Flex>

            <Flex direction={'row'} w={'100%'} justifyContent={'center'}>
              <Text fontSize={'sm'} fontWeight={400}>
                Please confirm that the following details are correct
              </Text>
            </Flex>

            <Flex direction={'column'} w={'100%'} pt={10}>
              <Text fontSize={'md'} fontWeight={600}>
                Price: {props.data.price * 1000} ALGO /{' '}
                {props.data.price * 0.78 * 1000} USD
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                Location: {props.data.address}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                Bedrooms: {props.data.numBedrooms}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                Bathrooms: {props.data.numBathrooms}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                Apartment sq ft: {calculateAptSize()}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                {getConfirmationAmenities('pool')}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                {'Has hardwood floor'}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                {'Has dishwasher'}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                {'Has air conditioning'}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                {getConfirmationAmenities('balcony')}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                {getConfirmationAmenities('gym')}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                {getConfirmationAmenities('on-site laundry')}
              </Text>
              <Text fontSize={'md'} fontWeight={600}>
                {getConfirmationAmenities('garage')}
              </Text>
            </Flex>

            <Flex
              mt={5}
              direction={'row'}
              width={'100%'}
              justifyContent={'center'}
            >
              <Text mt={2} ml={2} fontSize={'md'} fontWeight={600}>
                Your Offer
              </Text>
            </Flex>
            <Flex
              mt={1}
              direction={'row'}
              width={'100%'}
              justifyContent={'center'}
            >
              <Input
                value={offerField}
                onChange={handleOfferField}
                fontSize={'md'}
                fontWeight={600}
                w={'50%'}
              />
              <Text mt={2} ml={2} fontSize={'md'} fontWeight={600}>
                ALGO
              </Text>
            </Flex>

            <Flex
              mt={4}
              direction={'row'}
              width={'100%'}
              justifyContent={'center'}
            >
              <Checkbox colorScheme="green">
                <Text fontSize={'sm'} fontWeight={600}>
                  By checking this box, I agree to sell my organs to AlgoRent
                  for the greater good
                </Text>
              </Checkbox>
            </Flex>

            <Flex
              mt={4}
              direction={'row'}
              width={'100%'}
              justifyContent={'center'}
            >
              <IconButton
                colorScheme={'purple'}
                aria-label="Offer Price"
                onClick={handleOffer}
                icon={<FaHandshake size={35} />}
                w={24}
                h={12}
              />
            </Flex>
          </Flex>
        </Center>
      </Box>
    </Flex>
  );
};

export default PropertyDetails;
