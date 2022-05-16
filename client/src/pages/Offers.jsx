import { useState, useEffect } from 'react';
import { Box, Flex, Grid, Text, Divider } from '@chakra-ui/react';
import ReceivedOfferCard from '../components/ReceivedOfferCard';
import axios from 'axios';

const Offers = () => {
	const [offers, setOffers] = useState([]);
	const webUrl = 'http://localhost:8000' //'http://localhost:8000'; //
	useEffect(() => {
		axios
			.get(webUrl + '/getReceivedOffers', {
				withCredentials: true,
				credentials: 'include',
			})
			.then(response => {
				setOffers(response.data);
			})
			.catch(error => {
				console.error(error);
			});
	}, []);

	return (
		<Flex justifyContent="center" mt={8}>
      <Box w={{ base: '90%', xl: '70%' }}>
        <Text fontSize="2xl">Offers Received</Text>
        <Divider />
				<Grid
					templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
					gap={4}
					mt={4}
				>
					{offers.map((item, i) => {
						return (
						<ReceivedOfferCard
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

export default Offers;