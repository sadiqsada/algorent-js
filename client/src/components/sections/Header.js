import {
  Box,
  Flex,
  Avatar,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  HStack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Logo } from '../ui/Logo';

const Links = ['Explore'];
const Logged_In = false;

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
    href={children}>
    {children}
  </Link>
);

const Header = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // bg=useColorModeValue('gray.100', 'gray.900')}
  return (
    <>
      <Box bg={useColorModeValue('#2eca6a', '#176534')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />

          <Link href='/'>
            <Logo />
          </Link>

          <HStack spacing={8} alignItems={'center'}>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode} bg={useColorModeValue('#2eca6a', '#176534')} _hover={{bg: useColorModeValue('#61db8e', '#21944c')}}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              {Logged_In ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Avatar
                      size={'sm'}
                      src={'https://img.icons8.com/material/96/000000/user-male-circle--v1.png'}
                    />
                  </MenuButton>
                  <MenuList alignItems={'center'}>
                    <br />
                    <Center>
                      <Avatar
                        size={'2xl'}
                        src={'https://img.icons8.com/material/96/000000/user-male-circle--v1.png'}
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>Username</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <HStack>
                  <NavLink key={'Login'}>Login</NavLink>
                </HStack>
              )}
            </Stack>
          </Flex>
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

export default Header;