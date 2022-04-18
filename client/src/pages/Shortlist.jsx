import { useState, useEffect } from 'react';
import { Box, Flex, Grid, Text, Divider } from '@chakra-ui/react';
import HouseCard from '../components/HouseCard';
import axios from 'axios';

const Shortlist = () => {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/getShortlist', {
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
        <Text fontSize="2xl">Shortlist</Text>
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
                address: item.address,
                numBedrooms: item.numBedrooms,
                numBathrooms: item.numBathrooms,
                price: item.price,
                numAmenities: 3,
              }}
            />
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default Shortlist;
