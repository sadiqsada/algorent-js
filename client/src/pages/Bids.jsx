import { useState, useEffect } from 'react';
import {
    Box,
    Divider,
    Flex,
    Grid,
    Text,
  } from '@chakra-ui/react';
import axios from 'axios';
import BidsCard from '../components/BidsCard';

const Bids = () => {
    const [houses, setHouses] = useState([]);
    const web_url = 'http://localhost:8000'; //https://algorent-proj.herokuapp.com
    
    useEffect(() => {
        const getBidHouses = async () => {
          const response = await axios.get(web_url + '/getBidHouses', {
            withCredentials: true,
            credentials: 'include',
          });
          setHouses(response.data);
          console.log(response.data)
        };
        getBidHouses();
    }, []);

    return (
        <Flex justifyContent="center" mt={8}>
            <Box w={{ base: '90%', xl: '70%' }}>
            <Text fontSize="2xl">Bids Sent</Text>
            <Divider />
                    <Grid
                        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
                        gap={4}
                        mt={4}
                    >
                        {houses.map((item, i) => {
                            return (
                            <BidsCard
                                key={item._id}
                                data={{
                                        id: item._id, 
                                        name: item.name,
                                        price: item.price,
                                        house: item.house
                                }}
                            />
                            );
                        })}
                    </Grid>
            </Box>
        </Flex>
    );
}

export default Bids;