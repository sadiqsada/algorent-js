import {
  Box,
  Divider,
  Flex,
  Input,
  Select,
  Text,
  Menu,
  MenuButton,
  Button,
  MenuList,
  Center,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
const Explore = () => {
  return (
    <Flex justifyContent="center" mt={8}>
      <Box w="60%">
        <Text fontSize="2xl">Good Evening, Sadiq</Text>
        <Divider />
        <Flex mt={4}>
          <Input placeholder="Mountain View, CA" size="xs" w="20%" mt={0.5} />
          <Select w="15%" size="xs" ml={2}>
            <option value="Studio">Studio</option>
            <option value="1 Bed">1 Bed</option>
            <option value="2 Beds">2 Beds</option>
            <option value="3 Beds+">3 Beds+</option>
          </Select>
          <Select w="15%" size="xs" ml={2}>
            <option value="1 Bath">1 Bath</option>
            <option value="2 Baths">2 Baths</option>
            <option value="3 Baths+">3 Baths+</option>
          </Select>
          <Menu>
            <MenuButton>
              <Box borderWidth="1px" ml={2}>
                Price
              </Box>
            </MenuButton>
            <MenuList alignItems={'center'}>
              <Flex direction="column" justifyContent="center">
                <Input placeholder="Min" size="xs" w="50%" mt={0.5} />
                <Input placeholder="Max" size="xs" w="50%" mt={0.5} />
              </Flex>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Explore;
