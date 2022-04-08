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
  MenuList,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import HouseCard from '../components/HouseCard';
import listAmenities from '../utils/listAmenities';
import getTimeOfDay from '../utils/getTimeOfDay';
import formatPrice from '../utils/formatPrice';
import axios from 'axios';
const Explore = () => {
  const [searchField, setSearchField] = useState('NY|Kew Gardens|11415');
  const [numBeds, setNumBeds] = useState('Studio');
  const [numBaths, setNumBaths] = useState('1 Bath');
  const [priceMax, setPriceMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [houses, setHouses] = useState([]);

  const handleSearchField = event => setSearchField(event.target.value);
  const handleNumBeds = event => setNumBeds(event.target.value);
  const handleNumBaths = event => setNumBaths(event.target.value);
  const handlePriceMin = event => setPriceMin(event.target.value);
  const handlePriceMax = event => setPriceMax(event.target.value);
  const handleAmenities = arrState => {
    let updatedAmenities = [false, false, false, false];
    for (let i = 0; i < arrState.length; i++) {
      updatedAmenities[arrState[i]] = true;
    }

    setAmenities(updatedAmenities);
  };
  const handleSubmit = () => {
    axios
      .post('http://localhost:8000/explore', {
        address: searchField,
      })
      .then(response => {
        setHouses(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Flex justifyContent="center" mt={8}>
      <Box w="60%">
        <Text fontSize="2xl">{getTimeOfDay()}, Sadiq</Text>
        <Divider />
        <Flex mt={4} mb={4}>
          <Input
            placeholder="NY, Kew Gardens, 11415"
            value={searchField}
            onChange={handleSearchField}
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
                placeholder="min"
                value={priceMin}
                onChange={handlePriceMin}
                size="xs"
                w="40%"
                mt={0.5}
                ml={4}
              />
              <Input
                placeholder="max"
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
              <MenuOptionGroup
                type="checkbox"
                onChange={event => handleAmenities(event)}
              >
                {listAmenities.map((name, index) => (
                  <MenuItemOption
                    value={index}
                    key={index}
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
            colorScheme="purple"
            aria-label="Search database"
            onClick={handleSubmit}
            icon={<SearchIcon />}
          />
        </Flex>
        <Grid templateColumns={{base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)'}} gap={4}>
          {houses.map(item => (
            <HouseCard
              data={{
                imgUrl: item[0],
                title: 'Heritage Park',
                address: item[1],
                price: formatPrice(item[2]),
                numAmenities: 3,
              }}
            />
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default Explore;
