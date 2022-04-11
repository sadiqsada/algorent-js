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
  MenuDivider,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Stack,
  HStack,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Logo } from '../ui/Logo';
import { useContext } from 'react';
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
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  // bg=useColorModeValue('gray.100', 'gray.900')}

  const handleLogout = async () => {
    try {
      await Axios.get('http://localhost:8000/logout', {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
  };

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
                    <NavLink key={'Explore'}>Explore</NavLink>
                    {!isLoggedIn ? (
                      <NavLink key={'Login'}>Login</NavLink>
                    ) : null}
                    {!isLoggedIn ? (
                      <NavLink key={'Register'}>Register</NavLink>
                    ) : null}
                    {isLoggedIn ? (
                      <NavLink key={'CreateListing'}>CreateListing</NavLink>
                    ) : null}
                    {isLoggedIn ? (
                      <NavLink key={'Shortlist'}>Shortlist</NavLink>
                    ) : null}
                    {isLoggedIn ? (
                      <NavLink key={'RecentlyViewed'}>RecentlyViewed</NavLink>
                    ) : null}
                    {isLoggedIn ? (
                      <NavLink key={'Wallet'}>Wallet</NavLink>
                    ) : null}
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
                      <Avatar
                        size={'sm'}
                        src={
                          'https://avatars.dicebear.com/api/male/username.svg'
                        }
                      />
                    </MenuButton>
                    <MenuList alignItems={'center'}>
                      <br />
                      <Center>
                        <Avatar
                          size={'2xl'}
                          src={
                            'https://avatars.dicebear.com/api/male/username.svg'
                          }
                        />
                      </Center>
                      <br />
                      <Center>
                        <p>Username</p>
                      </Center>
                      <br />
                      <MenuDivider />
                      <MenuItem>Account Settings</MenuItem>
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
              <NavLink key={'Explore'}>
                <Text align="center">Explore</Text>
              </NavLink>
              {!isLoggedIn ? (
                <NavLink key={'Login'}>
                  <Text align="center">Login</Text>
                </NavLink>
              ) : null}
              {!isLoggedIn ? (
                <NavLink key={'Register'}>
                  <Text align="center">Register</Text>
                </NavLink>
              ) : null}
              {isLoggedIn ? (
                <NavLink key={'CreateListing'}>
                  <Text align="center">CreateListing</Text>
                </NavLink>
              ) : null}
              {isLoggedIn ? (
                <NavLink key={'Shortlist'}>
                  <Text align="center">Shortlist</Text>
                </NavLink>
              ) : null}
              {isLoggedIn ? (
                <NavLink key={'RecentlyViewed'}>
                  <Text align="center">Recently Viewed</Text>
                </NavLink>
              ) : null}
              {isLoggedIn ? (
                <NavLink key={'Wallet'}>
                  <Text align="center">Wallet</Text>
                </NavLink>
              ) : null}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Header;
