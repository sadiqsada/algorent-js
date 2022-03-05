import {
  Box,
  Divider,
  Flex,
  Input,
  Select,
  Text,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuOptionGroup,
  MenuList,
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
              <Box w="100px" borderWidth="1px" ml={2} mt={0.5}>
                <Text fontSize="sm">Price</Text>
              </Box>
            </MenuButton>
            <MenuList>
              <Input placeholder="Min" size="xs" w="40%" mt={0.5} ml={4} />
              <Input placeholder="Max" size="xs" w="40%" mt={0.5} ml={4} />
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Box w="100px" borderWidth="1px" ml={2} mt={0.5}>
                <Text fontSize="sm">Amenities</Text>
              </Box>
            </MenuButton>
            <MenuList>
              <MenuOptionGroup type="checkbox">
                <MenuItemOption value="hardwoodFloor" closeOnSelect={false}>
                  Hardwood Floor
                </MenuItemOption>
                <MenuItemOption value="airConditioning" closeOnSelect={false}>
                  Air Conditioning
                </MenuItemOption>
                <MenuItemOption value="inUnitLaundry" closeOnSelect={false}>
                  In-Unit Laundry
                </MenuItemOption>
                <MenuItemOption value="gym" closeOnSelect={false}>
                  Gym
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Explore;
