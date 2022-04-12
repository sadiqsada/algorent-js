import { Icon } from '@chakra-ui/icons';
import { Flex, Image, Text, Box, Spacer, useColorModeValue, Input, Center, Divider, Button, Stack, IconButton } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import SimpleImageSlider from "react-simple-image-slider";
import { FaSwimmingPool, FaFan, FaFileContract, FaHeart } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { GiWoodBeam, GiWashingMachine, GiHomeGarage, GiPathDistance } from "react-icons/gi";
import { MdBalcony, MdLocationOn } from "react-icons/md";
import { CgGym, CgSmartHomeWashMachine } from "react-icons/cg";
import { BsCartPlusFill } from "react-icons/bs";
import { useRef, useState } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'

const PropertyDetails = () => {   
    const location = useLocation();
    const { props } = location.state
    const images = [
        { url: props.data.imgUrl },
        { url: 'https://s3.amazonaws.com/rets-images-matrix-hgar/fc15f037229a6ca45d06845f5c728b2131c6777d-1-large.jpeg' },
        { url: 'https://s3.amazonaws.com/rets-images-matrix-hgar/f3da7f5e5404cc1328c3f1e3e8c6bab69f94b1bf-1-large.jpeg' },
        { url: 'https://s3.amazonaws.com/rets-images-matrix-hgar/e46a08206acfd864f7cfdc45d885c122cc523198-1-large.jpeg' },
    ];

    const popupModal = useRef(null);
    const popupModalImg = useRef(null);
    function modalPopUp(idx) {
        if (popupModal.current && popupModalImg.current) {
            if (idx !== null) {
                popupModalImg.current.src = images[idx].url;
                popupModal.current.style.display = 'block';
            }
            else {
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
        return (<></>);
    }

    async function calculateRoute() {
        if (destinationRef.current.value === '') {
          return
        }
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
          origin: props.data.address,
          destination: destinationRef.current.value,
          travelMode: google.maps.TravelMode.DRIVING,
        });
        const distance = results.routes[0].legs[0].distance.text;
        const duration = results.routes[0].legs[0].duration.text;
        setRouteText(`Driving to ${destinationRef.current.value} takes ${duration} (${distance})`);
    }

    return (
        <Flex direction={'row'} w={'100%'} h={'93vh'} overflow={'hidden'}>            
            <Flex direction={'column'} maxW={500} boxShadow={'dark-lg'} zIndex={1} wrap={'nowrap'}>
                <Box><SimpleImageSlider
                    width={500}
                    height={300}
                    alt={'Images'}
                    images={images}
                    showBullets={true}
                    showNavs={true}
                    navStyle={1}
                    navSize={60}
                    navMargin={0}
                    style={{cursor: 'pointer'}}
                    onClick={(idx, event) => {
                        modalPopUp(idx);
                    }}
                /></Box>
                <Flex direction={'column'} p={5} overflowY={'scroll'} overflowX={'hidden'} css={{'&::-webkit-scrollbar': {display: 'none'}}}>
                    <Flex direction={'row'} mb={5}>
                        <Flex direction={'column'}>
                            <Text fontSize={'xl'} fontWeight={600} alt={'Title'}>{props.data.title}</Text>
                            <Text mt={5} fontSize={'lg'} fontWeight={500} textColor={useColorModeValue('#2eca6a', '#176534')} alt={'Contact'} >(634)-777-****</Text>
                        </Flex>
                        <Spacer/>
                        <Flex direction={'column'}>
                            <Text fontSize={'xl'} fontWeight={600} alt={'Price'}>{props.data.price}000 ALGO</Text>
                            <Center mt={0}><Text fontSize={'md'} fontWeight={300} alt={'USPrice'}>{props.data.price * 0.78 * 1000} USD</Text></Center>
                        </Flex>
                    </Flex>
                    <Flex direction={'row'} m={2} ml={0}>
                        <Icon as={MdLocationOn} w={8} h={8} mr={3}/>
                        <Text fontSize={'sm'} fontWeight={600} pt={1}>{props.data.address}</Text>
                    </Flex>
                    <Flex direction={'row'} m={2} ml={0}>
                        <Icon as={BiBuildingHouse} w={7} h={7} mr={4}/>
                        <Text fontSize={'sm'} fontWeight={600} pt={1}>6 Bedroom(s) - 9 Bathroom(s) - 727 sqft</Text>
                    </Flex>
                    <Flex direction={'row'} m={2} ml={0}>
                        <Icon as={GiPathDistance} w={8} h={8} mr={3}/>                        
                        <Flex direction={'column'}>
                            <Flex direction={'row'}>
                                <Text ref={showDistanceRef} fontSize={'sm'} fontWeight={600} pt={1} mb={2}>Find distance from an address</Text>
                            </Flex>
                            <Autocomplete>
                                <Input type={'text'} placeholder={'Destination'} ref={destinationRef} fontSize={'sm'} fontWeight={600} size={'sm'}/>
                            </Autocomplete>
                            <Button colorScheme={'purple'} type={'submit'} size={'xs'} fontSize={'sm'} fontWeight={600} onClick={calculateRoute}>
                                Find distance
                            </Button>
                            <Text fontSize={'sm'} fontWeight={600} mt={2}>{routeText}</Text>
                        </Flex>
                    </Flex>
                    <Flex direction={'row'} m={2} ml={0}>
                        <Icon as={FaFileContract} w={7} h={7} mr={4}/>
                        <Text fontSize={'sm'} fontWeight={600} pt={1}>Matching {props.data.numAmenities}/3 Amenities</Text>
                    </Flex>
                    
                    <Divider borderWidth={1} mt={3} mb={3}/>
                    
                    <Center><Text fontSize={'lg'} fontWeight={600}>Amenities</Text></Center>
                    <Flex direction={'row'} wrap={'wrap'} mt={3}>
                        <Flex direction={'column'} m={3}>
                            <Center><Icon as={FaSwimmingPool} color={'red.500'} w={8} h={8} /></Center>
                            <Center><Text fontSize={'xs'} color={'red.500'} fontWeight={600}>Pool</Text></Center>
                        </Flex>
                        <Flex direction={'column'} m={3}>
                            <Center><Icon as={GiWoodBeam} color={'green.500'} w={8} h={8} /></Center>
                            <Center><Text fontSize={'xs'} color={'green.500'} fontWeight={600}>Hardwood Floor</Text></Center>
                        </Flex>
                        <Flex direction={'column'} m={3}>
                            <Center><Icon as={CgSmartHomeWashMachine} color={'green.500'} w={8} h={8} /></Center>
                            <Center><Text fontSize={'xs'} color={'green.500'} fontWeight={600}>Dishwasher</Text></Center>
                        </Flex>
                        <Flex direction={'column'} m={3}>
                            <Center><Icon as={FaFan} color={'green.500'} w={8} h={8} /></Center>
                            <Center><Text fontSize={'xs'} color={'green.500'} fontWeight={600}>Air Conditioning</Text></Center>
                        </Flex>
                        <Flex direction={'column'} m={3}>
                            <Center><Icon as={MdBalcony} color={'red.500'} w={8} h={8} /></Center>
                            <Center><Text fontSize={'xs'} color={'red.500'} fontWeight={600}>Balcony</Text></Center>
                        </Flex>
                        <Flex direction={'column'} m={3}>
                            <Center><Icon as={CgGym} color={'red.500'} w={8} h={8} /></Center>
                            <Center><Text fontSize={'xs'} color={'red.500'} fontWeight={600}>Gym</Text></Center>
                        </Flex>
                        <Flex direction={'column'} m={3}>
                            <Center><Icon as={GiWashingMachine} color={'green.500'} w={8} h={8} /></Center>
                            <Center><Text fontSize={'xs'} color={'green.500'} fontWeight={600}>On-Site Laundry</Text></Center>
                        </Flex>
                        <Flex direction={'column'} m={3}>
                            <Center><Icon as={GiHomeGarage} color={'red.500'} w={8} h={8} /></Center>
                            <Center><Text fontSize={'xs'} color={'red.500'} fontWeight={600}>Garage</Text></Center>
                        </Flex>
                    </Flex>

                    <Divider borderWidth={1} mt={3} mb={6}/>

                    <Center>
                        <Stack direction={'row'} spacing={20}>
                            <Flex direction={'column'}>
                            <IconButton
                                aria-label={'Favorite property'}
                                colorScheme={'red'}
                                icon={<FaHeart size={30}/>}
                                w={16} h={16}
                                isRound
                                onClick={() => {alert("FAVORITE!");}}
                            />
                            <Center mt={1}><Text fontSize={'md'} color={useColorModeValue('red.500', 'red.200')} fontWeight={600}>Fav</Text></Center>
                            </Flex>
                            <Flex direction={'column'}>
                            <IconButton
                                aria-label={'Buy property'}
                                colorScheme={'purple'}
                                icon={<BsCartPlusFill size={30}/>}
                                w={16} h={16}
                                isRound
                                onClick={() => {alert("BUY!");}}
                            />
                            <Center mt={1}><Text fontSize={'md'} color={useColorModeValue('purple.500', 'purple.200')} fontWeight={600}>Cart</Text></Center>
                            </Flex>
                        </Stack>
                    </Center>

                </Flex>
            </Flex>

            <Image
                w={'100%'}
                h={'100vh'}
                src={useColorModeValue('https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/w_2240,c_limit/GoogleMapTA.jpg', 'https://pakistantime.net/wp-content/uploads/2021/02/b49g8bxadrs21.png')}
                objectFit={'cover'}
                alt={'GoogleMapsLocation'}
                borderRadius={'md'}
                zIndex={0}
            />

            <Box ref={popupModal} pos={'absolute'} w={'100%'} h={'94vh'} zIndex={10} display={'none'} overflow={'hidden'}>
                <Box pos={'absolute'} w={'100%'} h={'100%'} opacity={0.5} backgroundColor={useColorModeValue('gray.900', 'gray.400')}
                onClick={() => {modalPopUp(null)}} cursor={'pointer'}></Box>
                <Center pos={'absolute'} w={'100%'} h={'100%'} pointerEvents={'none'}>
                    <Image pointerEvents={'auto'} ref={popupModalImg} objectFit={'cover'} minW={600} minH={400} w={'60vw'} h={'auto'} maxW={'90vw'} maxH={'85vh'}/>
                </Center>
            </Box>
        </Flex>
    );
};

export default PropertyDetails;