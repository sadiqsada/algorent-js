import { useState, useEffect } from 'react';
import { Box, Flex, Grid, Text, Divider } from '@chakra-ui/react';
import HouseCard from '../components/HouseCard';
import axios from 'axios';
import handleImages from '../utils/handleImages';
const Shortlist = () => {
  const [houses, setHouses] = useState([]);
  const web_url = 'https://algorent-proj.herokuapp.com' //'http://localhost:8000'; //
  useEffect(() => {
    axios
      .get(web_url + '/getShortlist', {
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
      <Box w={{ base: '90%', xl: '70%' }}>
        <Text fontSize="2xl">Shortlist</Text>
        <Divider />
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
          gap={4}
          mt={4}
        >
          {houses.map((item, i) => (
            <HouseCard
              key={i}
              data={{
                imgUrl: handleImages(item.imgUrl),
                address: item.address,
                numBedrooms: item.numBedrooms,
                numBathrooms: item.numBathrooms,
                price: item.price,
                mapUrls: item.mapUrls,
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
