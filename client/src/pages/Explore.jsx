import { useState, useEffect } from 'react';
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
  MenuList,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import HouseCard from '../components/HouseCard';
import getTimeOfDay from '../utils/getTimeOfDay';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import axios from 'axios';
import handleImages from '../utils/handleImages';

const Explore = () => {
  const [displayName, setDisplayName] = useState('');
  const [searchField, setSearchField] = useState('Jamaica 11432');
  const [numBeds, setNumBeds] = useState('1');
  const [numBaths, setNumBaths] = useState('1');
  const [priceMax, setPriceMax] = useState('10000');
  const [priceMin, setPriceMin] = useState('0');
  const [houses, setHouses] = useState([]);

  const handleSearchField = event => setSearchField(event.target.value);
  const handleNumBeds = event => setNumBeds(event.target.value);
  const handleNumBaths = event => setNumBaths(event.target.value);
  const handlePriceMin = event => setPriceMin(event.target.value);
  const handlePriceMax = event => setPriceMax(event.target.value);
  const web_url = 'http://localhost:8000'; //http://localhost:8000
  const handleSubmit = () => {
    axios
      .post(web_url+'/explore', {
        address: searchField,
        filter: {
          minBeds: numBeds,
          minBaths: numBaths,
          minPrice: priceMin,
          maxPrice: priceMax,
        },
      })
      .then(response => {
        console.log('response.data');
        console.log(response.data);
        setHouses(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    const getDisplayName = async () => {
      const response = await axios.get(web_url + '/getUser', {
        withCredentials: true,
        credentials: 'include',
      });
      const currentFirstname = capitalizeFirstLetter(response.data.firstName);
      setDisplayName(currentFirstname);
    };
    getDisplayName();
  }, []);

  return (
    <Flex justifyContent="center" mt={8}>
      <Box w={{ base: '90%', xl: '70%' }}>
        <Text fontSize="2xl">{getTimeOfDay()}{displayName ? `, ${displayName}` : null}</Text>
        <Divider />
        <Flex mt={4} mb={4}>
          <Input
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
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
          </Select>
          <Select
            value={numBaths}
            onChange={handleNumBaths}
            w="15%"
            size="xs"
            ml={2}
          >
            <option value="1">1 Bath</option>
            <option value="2">2 Baths</option>
            <option value="3">3 Baths</option>
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
          <IconButton
            ml={4}
            mt={0.5}
            size="xs"
            width='10%'
            colorScheme="purple"
            aria-label="Search database"
            onClick={handleSubmit}
            icon={<SearchIcon />}
          />
        </Flex>
        <Grid templateColumns={{base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)'}} gap={4} mb={5}>
          {houses.map((item, i) => (
            <HouseCard key={i}
              data={{
                imgUrl: handleImages(item[0]),
                address: (item[1]),
                price: (item[2]),
                numBathrooms: item[3],
                numBedrooms: item[4],
                mapUrls: [item[5],item[6]],
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
