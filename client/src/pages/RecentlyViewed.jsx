import { useState, useEffect } from 'react';
import { Box, Flex, Grid, Text, Divider } from '@chakra-ui/react';
import HouseCard from '../components/HouseCard';
import axios from 'axios';

const RecentlyViewed = () => {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/getRecentlyViewed', {
        withCredentials: true,
        credentials: 'include',
      })
      .then(response => {
        setHouses(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <Flex justifyContent="center" mt={8}>
      <Box w="60%">
        <Text fontSize="2xl">Recently Viewed</Text>
        <Divider />
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
          gap={4}
          mt={4}
        >
          {houses.map(item => (
            <HouseCard
              key={item.address}
              data={{
                imgUrl: item.imgUrl,
                title: 'Heritage Park',
                address: item.address,
                price: item.price,
                numBedrooms: item.numBedrooms,
                numBathrooms: item.numBathrooms,
                numAmenities: 3,
              }}
            />
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default RecentlyViewed;
