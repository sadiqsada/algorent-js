import React, { useEffect } from 'react';
import { Icon } from '@chakra-ui/icons';
import {
  Flex,
  Image,
  Text,
  Box,
  Spacer,
  useColorModeValue,
  Center,
  Divider,
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
import axios from 'axios';

const PropertyDetails = () => {
  const location = useLocation();
  const { props } = location.state;
  const images = [
    { url: props.data.imgUrl },
    {
      url: 'https://s3.amazonaws.com/rets-images-matrix-hgar/fc15f037229a6ca45d06845f5c728b2131c6777d-1-large.jpeg',
    },
    {
      url: 'https://s3.amazonaws.com/rets-images-matrix-hgar/f3da7f5e5404cc1328c3f1e3e8c6bab69f94b1bf-1-large.jpeg',
    },
    {
      url: 'https://s3.amazonaws.com/rets-images-matrix-hgar/e46a08206acfd864f7cfdc45d885c122cc523198-1-large.jpeg',
    },
  ];

  const handleShortlist = async () => {
    const { address } = props.data;
    // console.log(address);
    // const stateZip = address.split(', ')[2];
    // console.log(stateZip);
    // const zipCode = stateZip.split(' ')[1];
    // console.log(zipCode);
    try {
      const response = await axios.post(
        'http://localhost:8000/shortlist',
        { address },
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
    const updateRecentlyViewed = async (props) => {
    const { address } = props.data;
    await axios
      .post('http://localhost:8000/recentlyViewed', { address }, {
        withCredentials: true,
        credentials: 'include',
      });
    }
    updateRecentlyViewed(props);
  }, []);

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
                fontWeight={500}
                textColor={useColorModeValue('#2eca6a', '#176534')}
                alt={'Contact'}
              >
                (634)-777-****
              </Text>
            </Flex>
            <Spacer />
            <Flex direction={'column'}>
              <Text fontSize={'xl'} fontWeight={600} alt={'Price'}>
                {props.data.price}000 ALGO
              </Text>
              <Center mt={0}>
                <Text fontSize={'md'} fontWeight={300} alt={'USPrice'}>
                  {props.data.price * 0.78 * 1000} USD
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
              6 Bedroom(s) - 9 Bathroom(s) - 727 sqft
            </Text>
          </Flex>
          <Flex direction={'row'} m={2} ml={0}>
            <Icon as={GiPathDistance} w={8} h={8} mr={3} />
            <Text fontSize={'sm'} fontWeight={600} pt={1}>
              1 Hour, 51 Minutes Drive to Stony Brook University
            </Text>
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
                <Icon as={FaSwimmingPool} color={'red.500'} w={8} h={8} />
              </Center>
              <Center>
                <Text fontSize={'xs'} color={'red.500'} fontWeight={600}>
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
                <Icon as={MdBalcony} color={'red.500'} w={8} h={8} />
              </Center>
              <Center>
                <Text fontSize={'xs'} color={'red.500'} fontWeight={600}>
                  Balcony
                </Text>
              </Center>
            </Flex>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon as={CgGym} color={'red.500'} w={8} h={8} />
              </Center>
              <Center>
                <Text fontSize={'xs'} color={'red.500'} fontWeight={600}>
                  Gym
                </Text>
              </Center>
            </Flex>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon as={GiWashingMachine} color={'green.500'} w={8} h={8} />
              </Center>
              <Center>
                <Text fontSize={'xs'} color={'green.500'} fontWeight={600}>
                  On-Site Laundry
                </Text>
              </Center>
            </Flex>
            <Flex direction={'column'} m={3}>
              <Center>
                <Icon as={GiHomeGarage} color={'red.500'} w={8} h={8} />
              </Center>
              <Center>
                <Text fontSize={'xs'} color={'red.500'} fontWeight={600}>
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
                  <Text
                    fontSize={'md'}
                    color={useColorModeValue('red.500', 'red.200')}
                    fontWeight={600}
                  >
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
                  <Text
                    fontSize={'md'}
                    color={useColorModeValue('purple.500', 'purple.200')}
                    fontWeight={600}
                  >
                    Buy
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
        src={useColorModeValue(
          'https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/w_2240,c_limit/GoogleMapTA.jpg',
          'https://pakistantime.net/wp-content/uploads/2021/02/b49g8bxadrs21.png'
        )}
        objectFit={'cover'}
        alt={'GoogleMapsLocation'}
        borderRadius={'md'}
        zIndex={0}
      />
    </Flex>
  );
};

export default PropertyDetails;
