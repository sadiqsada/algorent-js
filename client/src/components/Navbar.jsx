import {
  Box,
  Flex,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Link,
  useColorModeValue,
  useDisclosure,
  useBreakpointValue,
  HStack,
  Stack,
  Text,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Logo } from './ui/Logo';
import axios from 'axios';

const Links = ['Explore', 'Shortlist', 'Wallet'];

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

const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showNavbarOptions = useBreakpointValue({ base: 'base', md: 'md' });
  const bgColor = useColorModeValue('#2eca6a', '#176534');
  const hoverColor = useColorModeValue('#61db8e', '#21944c');

  const handleLogout = async () => {
    await axios.get('http://localhost:8000/logout', { withCredentials: true });
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
                    {Links.map(link => (
                      <NavLink key={link}>{link}</NavLink>
                    ))}
                  </HStack>
                ) : null}
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
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
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
              {Links.map(link => (
                <NavLink key={link}>
                  <Text align="center">{link}</Text>
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Nav;
