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
  MenuItemOption,
  MenuOptionGroup,
  MenuList,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import HouseCard from '../components/HouseCard';
import listAmenities from '../utils/listAmenities';
import getTimeOfDay from '../utils/getTimeOfDay';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';
import axios from 'axios';
const Explore = () => {
  const [displayName, setDisplayName] = useState('');
  const [searchField, setSearchField] = useState('NY|Kew Gardens|11415');
  const [numBeds, setNumBeds] = useState('1');
  const [numBaths, setNumBaths] = useState('1');
  const [priceMax, setPriceMax] = useState('10000');
  const [priceMin, setPriceMin] = useState('0');
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
        filter: {
          minBeds: numBeds,
          minBaths: numBaths,
          minPrice: priceMin,
          maxPrice: priceMax,
        },
      })
      .then(response => {
        setHouses(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    const getDisplayName = async () => {
      const response = await axios.get('http://localhost:8000/getUser', {
        withCredentials: true,
        credentials: 'include',
      });
      const currentFirstname = capitalizeFirstLetter(response.data.name);
      setDisplayName(currentFirstname);
    };
    getDisplayName();
  }, []);
  const handleImages = (imgUrls) => {
    let imgUrlsArray = imgUrls.slice(1, -1).split(", ");
    let formattedImgUrls = [];
    imgUrlsArray.forEach(img => formattedImgUrls.push({url: img.slice(1, -1)}));
    return formattedImgUrls;
  }

  function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  }

  // const getTitle = (address) => {
  //   let title = address.split('-');
  //   title = (capitalize(title[title.length-4])+' '+capitalize(title[title.length-3]));
  //   return title;
  // };

  const formatAddress = (address) => {
    return address.split('-').map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  }

  return (
    <Flex justifyContent="center" mt={8}>
      <Box w="60%">
        <Text fontSize="2xl">{getTimeOfDay()}, {displayName}</Text>
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
        <Grid templateColumns={{base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)'}} gap={4} mb={5}>
          {houses.map((item, i) => (
            <HouseCard key={i}
              data={{
                imgUrl: handleImages(item[0]),
                address: formatAddress(item[1]),
                price: formatPrice(item[2]),
                numBaths: item[3],
                numBeds: item[4],
                mapUrl: [item[5],item[6]],
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
