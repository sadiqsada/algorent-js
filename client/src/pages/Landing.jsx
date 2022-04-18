import React from 'react';
import { Flex, Center, Text, useColorModeValue, Link, Image } from '@chakra-ui/react';
import { ArrowForwardIcon } from "@chakra-ui/icons";

const Landing = () => {
  return (
    <Flex direction={'column'}>
      <Center
        w={'100%'} h={800}
        backgroundImage={{base: 'https://res.cloudinary.com/apartmentlist/image/upload/f_auto,q_auto/web/static/home/bg-hero-mobile_2x.jpg', md: 'https://res.cloudinary.com/apartmentlist/image/upload/f_auto,q_auto/web/static/home/bg-hero_2x.jpg'}}
        backgroundRepeat={'no-repeat'}
        backgroundSize={{base: 'cover', md: 'cover'}}
        backgroundPosition={'center'}
        filter={'auto'}
        brightness={useColorModeValue(1, 0.8)}
        // backgroundColor={useColorModeValue('purple.500','purple.900')}
      >
        <Flex direction={{base: 'column', md: 'row'}} ml={{base: 10, md: 0}} mr={{base: 10, md: 0}}>
          <Center>
            <Flex direction={'column'}>
              <Text fontSize={45} fontWeight={'bold'} textColor={'whitesmoke'} mb={20}>AlgoRent</Text>
              <Text fontSize={30} fontWeight={'bold'} textColor={'whitesmoke'} mb={0}>The Future Concierge</Text>
              <Text fontSize={20} fontWeight={'normal'} textColor={'whitesmoke'} mb={5}>Bringing you the best real estate for modern currency</Text>
              <Link
                h={'fit-content'}
                backgroundColor={useColorModeValue('#2eca6a', '#176534')}
                rounded={'md'}
                boxShadow={'lg'}
                _hover={{
                  backgroundColor: useColorModeValue('#61db8e', '#29b45c'),
                  transform: 'scale(1.1)'
                }}
                _active={{
                  backgroundColor: useColorModeValue('#29b45c', '#21944c')
                }}
                href={'/Explore'}
              >
                <Flex direction={'row'} p={1} justifyContent={'center'}>
                  <Text ml={10} fontSize={25} fontWeight={'bold'}>Start Exploring</Text>
                  <ArrowForwardIcon ml={5} mt={1} boxSize={8}/>
                </Flex>
              </Link>
            </Flex>
          </Center>
          <Image
            src={'https://res.cloudinary.com/apartmentlist/image/upload/f_auto,q_auto/v1622591365/web/static/home/home-phone_2x.png'}
            filter={useColorModeValue('drop-shadow(10px 10px 4px #dc143c)', 'drop-shadow(10px 10px 4px #9a0d2a)')}
            objectFit={'contain'}
            minH={400}
            h={{base: '40vh', md: '65vh'}}
            ml={{base: 0, md: 20}}
            mt={{base: 50, md: 0}}
            transition={'all 0.25s'}
            _hover={{
                transform: 'scale(1.05)'
            }}
          />
        </Flex>
      </Center>
      <Flex direction={{base: 'column', md: 'row'}} mt={20} mb={20} justifyContent={'space-evenly'} alignItems={'center'}>
            <Flex
              w={350}
              h={500}
              direction={'column'}
              backgroundColor={useColorModeValue('whitesmoke', 'gray.700')}
              boxShadow={'lg'}
              rounded={'3xl'}
              justifyContent={'space-between'}
              textAlign={'center'}
              transition={'all 0.25s'}
              _hover={{
                transform: 'scale(1.05)'
              }}
              mt={{base: 5, md: 0}}
              mb={{base: 5, md: 0}}
            >
                <Image src={'https://www.zillowstatic.com/s3/homepage/static/Buy_a_home.png'} roundedTop={'3xl'} mixBlendMode={useColorModeValue('multiply', 'none')}/>
                <Flex direction={'column'} pl={10} pr={10}>
                  <Text fontSize={25} fontWeight={'bold'} mb={5}>Buy a house</Text>
                  <Text fontSize={16} fontWeight={'normal'}>Find what suits you from our vast number of listings and purchase your dream house with a click of a button!</Text>
                </Flex>
                <Link
                  h={'fit-content'}
                  backgroundColor={useColorModeValue('#2eca6a', '#176534')}
                  rounded={'md'}
                  boxShadow={'lg'}
                  _hover={{
                    backgroundColor: useColorModeValue('#61db8e', '#29b45c'),
                  }}
                  _active={{
                    backgroundColor: useColorModeValue('#29b45c', '#21944c')
                  }}
                  href={'/Explore'}
                  fontSize={20} fontWeight={'bold'}
                  ml={16}
                  mr={16}
                  mb={10}
                  p={1}
                >
                  Search for Homes
                </Link>
            </Flex>
            <Flex
              w={350}
              h={500}
              direction={'column'}
              backgroundColor={useColorModeValue('whitesmoke', 'gray.700')}
              boxShadow={'lg'}
              rounded={'3xl'}
              justifyContent={'space-between'}
              textAlign={'center'}
              transition={'all 0.25s'}
              _hover={{
                transform: 'scale(1.05)'
              }}
              mt={{base: 5, md: 0}}
              mb={{base: 5, md: 0}}
            >
                <Image src={'https://www.zillowstatic.com/s3/homepage/static/Sell_a_home.png'} roundedTop={'3xl'} mixBlendMode={useColorModeValue('multiply', 'none')}/>
                <Flex direction={'column'} pl={10} pr={10}>
                  <Text fontSize={25} fontWeight={'bold'} mb={5}>Sell a house</Text>
                  <Text fontSize={16} fontWeight={'normal'}>Wanna sell your property with ease? List your house with us and get unimaginable returns!</Text>
                </Flex>
                <Link
                  h={'fit-content'}
                  backgroundColor={useColorModeValue('#2eca6a', '#176534')}
                  rounded={'md'}
                  boxShadow={'lg'}
                  _hover={{
                    backgroundColor: useColorModeValue('#61db8e', '#29b45c'),
                  }}
                  _active={{
                    backgroundColor: useColorModeValue('#29b45c', '#21944c')
                  }}
                  href={'/Explore'}
                  fontSize={20} fontWeight={'bold'}
                  p={1}
                  ml={16}
                  mr={16}
                  mb={10}
                >
                  Post a Listing
                </Link>
            </Flex>
            <Flex
              w={350}
              h={500}
              direction={'column'}
              backgroundColor={useColorModeValue('whitesmoke', 'gray.700')}
              boxShadow={'lg'}
              rounded={'3xl'}
              justifyContent={'space-between'}
              textAlign={'center'}
              transition={'all 0.25s'}
              _hover={{
                transform: 'scale(1.05)'
              }}
              mt={{base: 5, md: 0}}
              mb={{base: 5, md: 0}}
            >
                <Image src={'https://www.zillowstatic.com/s3/homepage/static/Rent_a_home.png'} roundedTop={'3xl'} mixBlendMode={useColorModeValue('multiply', 'none')}/>
                <Flex direction={'column'} pl={10} pr={10}>
                  <Text fontSize={25} fontWeight={'bold'} mb={5}>Want to invest?</Text>
                  <Text fontSize={16} fontWeight={'normal'}>Check out our up-coming project which allows for partial ownership through Cryptocurrency and Smart contracts.</Text>
                  <Text fontSize={16} fontWeight={'normal'}>For now, let's get you registered with us to stay up-to-date!</Text>
                </Flex>
                <Link
                  h={'fit-content'}
                  backgroundColor={useColorModeValue('#2eca6a', '#176534')}
                  rounded={'md'}
                  boxShadow={'lg'}
                  _hover={{
                    backgroundColor: useColorModeValue('#61db8e', '#29b45c'),
                  }}
                  _active={{
                    backgroundColor: useColorModeValue('#29b45c', '#21944c')
                  }}
                  href={'/Register'}
                  fontSize={20} fontWeight={'bold'}
                  p={1}
                  ml={16}
                  mr={16}
                  mb={10}
                >
                  Register
                </Link>
            </Flex>
      </Flex>

    </Flex>
  );
};

export default Landing;
