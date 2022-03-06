import { useState } from 'react';
import {
  Box,
  Divider,
  Flex,
  Grid,
  IconButton,
  Input,
  Select,
  Text,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuOptionGroup,
  MenuList
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import HouseCard from '../components/HouseCard';
import listAmenities from '../utils/listAmenities';
const Explore = () => {
  const input = {
    title: 'Heritage Park',
    address: '555 Washington Avenue',
    price: 275,
    numAmenities: 3,
    imgUrl:
      'https://www.looper.com/img/gallery/komi-cant-communicate-release-date-cast-and-plot-what-we-know-so-far/l-intro-1620915743.jpg',
  };
  const [searchField, setSearchField] = useState('Mountain View, CA');
  const [numBeds, setNumBeds] = useState('Studio');
  const [numBaths, setNumBaths] = useState('1 Bath');
  const [priceMax, setPriceMax] = useState('Max');
  const [priceMin, setPriceMin] = useState('Min');
  const [amenities, setAmenities] = useState([false, false, false, false]);

  const handleSearch = event => setSearchField(event.target.value);
  const handleNumBeds = event => setNumBeds(event.target.value);
  const handleNumBaths = event => setNumBaths(event.target.value);
  const handlePriceMin = event => setPriceMin(event.target.value);
  const handlePriceMax = event => setPriceMax(event.target.value);
  const handleAmenities = position => {
    const updatedAmenities = amenities.map((item, index) =>
      index === position ? !item : item
    );

    setAmenities(updatedAmenities);
  };

  return (
    <Flex justifyContent="center" mt={8}>
      <Box w="60%">
        <Text fontSize="2xl">Good Evening, Sadiq</Text>
        <Divider />
        <Flex mt={4} mb={4}>
          <Input
            value={searchField}
            onChange={handleSearch}
            size="xs"
            w="20%"
            mt={0.5}
          />
          <Select
            value={numBeds}
            onChange={handleNumBeds}
            w="15%"
            size="xs"
            ml={2}
          >
            <option value="Studio">Studio</option>
            <option value="1 Bed">1 Bed</option>
            <option value="2 Beds">2 Beds</option>
            <option value="3 Beds+">3 Beds+</option>
          </Select>
          <Select
            value={numBaths}
            onChange={handleNumBaths}
            w="15%"
            size="xs"
            ml={2}
          >
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
              <Input
                value={priceMin}
                onChange={handlePriceMin}
                size="xs"
                w="40%"
                mt={0.5}
                ml={4}
              />
              <Input
                value={priceMax}
                onChange={handlePriceMax}
                size="xs"
                w="40%"
                mt={0.5}
                ml={4}
              />
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
                {listAmenities.map((name, index) => (
                  <MenuItemOption
                    value={name}
                    checked={amenities[index]}
                    key={index}
                    onChange={() => handleAmenities(index)}
                    closeOnSelect={false}
                  >
                    {name}
                  </MenuItemOption>
                ))}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <IconButton
            ml={2}
            mt={0.5}
            size="xs"
            colorScheme='purple'
            aria-label="Search database"
            icon={<SearchIcon />}
          />
        </Flex>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <HouseCard data={input} />
          <HouseCard data={input} />
          <HouseCard data={input} />
          <HouseCard data={input} />
        </Grid>
      </Box>
    </Flex>
  );
};

export default Explore;
