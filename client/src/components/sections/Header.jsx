import {
  Box,
  Flex,
  Link,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Stack,
  HStack,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Logo } from '../ui/Logo';

const Links = ['Explore', 'Login', 'Register'];

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
  // bg=useColorModeValue('gray.100', 'gray.900')}
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

export default Header;
