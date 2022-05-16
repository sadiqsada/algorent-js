import {
  Box,
  Flex,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Center,
  Avatar,
  Image,
  MenuDivider,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Stack,
  HStack,
  useColorMode,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Logo } from '../ui/Logo';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import Axios from 'axios';

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    fontWeight={600}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('#61db8e', '#21944c'), // useColorModeValue('gray.200', 'gray.700')
    }}
    _active={{
      backgroundColor: useColorModeValue('#29b45c', '#21944c')
    }}
    href={children}
  >
    {children}
  </Link>
);

const Header = props => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showNavbarOptions = useBreakpointValue({ base: 'base', md: 'md' });
  const bgColor = useColorModeValue('#2eca6a', '#176534');
  const hoverColor = useColorModeValue('#61db8e', '#21944c');
  const { isLoggedIn, setIsLoggedIn, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // bg=useColorModeValue('gray.100', 'gray.900')}
  const webUrl = 'http://localhost:8000'; // 'https://algorent-proj.herokuapp.com'
  const handleLogout = async () => {
    try {
      await Axios.get(webUrl + '/logout', {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
  };

  let avatar = <Avatar size={'sm'} src={'https://avatars.dicebear.com/api/male/username.svg'}/>
  let enlargedAvatar = <Avatar size={'2xl'} src={ 'https://avatars.dicebear.com/api/male/username.svg' }/>

  if (currentUser){
    if (currentUser.avatar){
    avatar = <Image marginRight='2%' boxSize ='30px' borderRadius='full' src={`data:image/png;base64,${currentUser.avatar[1].toString()}`}/>
    enlargedAvatar = <Image marginRight='2%' boxSize ='120px' borderRadius='full' src={`data:image/png;base64,${currentUser.avatar[1].toString()}`}/>
    }
  }
  return (
    <>
      <Box bg={useColorModeValue('#2eca6a', '#176534')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Link ml={4} href="/">
            <Logo />
          </Link>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Flex>
                <Button
                  onClick={toggleColorMode}
                  bg={{ bgColor }}
                  _hover={{ bg: hoverColor }}
                >
                  {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                </Button>
                {showNavbarOptions !== 'base' ? (
                  <HStack>
                    <NavLink>Explore</NavLink>
                    {!isLoggedIn ? <NavLink>Login</NavLink> : null}
                    {!isLoggedIn ? <NavLink>Register</NavLink> : null}
                    {isLoggedIn ? <NavLink>CreateListing</NavLink> : null}
                    {isLoggedIn ? <NavLink>Shortlist</NavLink> : null}
                    {isLoggedIn ? <NavLink>RecentlyViewed</NavLink> : null}
                  </HStack>
                ) : null}
                {isLoggedIn ? (
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={'full'}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}
                      ml={2}
                    >
                      {avatar}
                    </MenuButton>
                    <MenuList alignItems={'center'}>
                      <br />
                      <Center>
                        {enlargedAvatar}
                      </Center>
                      <br />
                      <Center>
                        <p>Username</p>
                      </Center>
                      <br />
                      <MenuDivider />
                      <Link href='/Offers' style={{ textDecoration: 'none' }}>
                        <MenuItem>Offers</MenuItem>
                      </Link>
                      <Link href='/Bids' style={{ textDecoration: 'none' }}>
                        <MenuItem>Bids</MenuItem>
                      </Link>
                      <Link href='/AccountSetting' style={{ textDecoration: 'none' }}>
                        <MenuItem>Account Settings</MenuItem>
                      </Link>
                      <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                ) : null}
              </Flex>

              <IconButton
                size={'md'}
                icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                aria-label={'Open Menu'}
                display={{ md: 'none' }}
                onClick={isOpen ? onClose : onOpen}
              />
            </Stack>
          </Flex>
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <NavLink>Explore</NavLink>
              {!isLoggedIn ? <NavLink>Login</NavLink> : null}
              {!isLoggedIn ? <NavLink>Register</NavLink> : null}
              {isLoggedIn ? <NavLink>CreateListing</NavLink> : null}
              {isLoggedIn ? <NavLink>Shortlist</NavLink> : null}
              {isLoggedIn ? <NavLink>RecentlyViewed</NavLink> : null}
              {isLoggedIn ? <NavLink>Wallet</NavLink> : null}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Header;
