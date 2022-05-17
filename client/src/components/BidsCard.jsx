import {
Flex,
Image,
Text,
useColorModeValue,
IconButton,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

const BidsCard = props => {
    const web_url = 'https://algorent-proj.herokuapp.com'
    const cardBackground = useColorModeValue('gray.100', 'gray.900');

    const [house, setHouse] = useState({
        imgUrl: ["https://pixselo.com/wp-content/uploads/2018/03/dummy-placeholder-image-400x400.jpg"],
        numBedrooms: 0,
        numBathrooms: 0,
        address: "",
        city: "",
        state: "",
        zipCode: "00000",
        price: 0,
    });

    useEffect(() => {
        axios
        .post(web_url + '/getHouseByID', {
            houseID: props.data.house
        })
        .then(response => {
            setHouse(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    const handleDeleteOffer = async() => {
        await axios.post(`${web_url}/offer/removeBid`, {
            id: props.data.id,
          }, { withCredentials: true, credentials: 'include' });
          alert('Offer Deleted');
          window.location.reload();
    }

return (
    <Flex
        bg={cardBackground}
        borderRadius={'md'}
        filter={useColorModeValue(
        'drop-shadow(0px 0px 0px #777)',
        'drop-shadow(0px 0px 0px #333)'
        )}
        transition={'all 0.25s'}
        _hover={{
        filter: useColorModeValue(
            'drop-shadow(4px 4px 4px #777)',
            'drop-shadow(4px 4px 4px #333)'
        ),
        }}
        h={'min-content'}
    >
        <Flex direction={'column'} w={'100%'}>
            <Flex direction={{ base: 'column', lg: 'row' }} flexGrow={1}>
            <Image
                w={{ base: 'auto', lg: 140 }}
                h={{ base: 200, lg: 140 }}
                src={house.imgUrl[0].toString().slice(1,-1).split(',')[0].slice(1,-1)}
                objectFit={'cover'}
                alt={'imgURL'}
                borderRadius={'md'}
            />
                <Flex
                    direction={'column'}
                    justifyContent={'space-between'}
                    flexGrow={1}
                    p={2}
                >
                    <Flex direction={'row'} justifyContent={'space-between'}>
                        <Flex direction={'column'} maxWidth='50%'>
                            <Text fontSize={'md'} fontWeight={'bold'}>
                                {house.numBedrooms} beds, {house.numBathrooms} baths
                            </Text>
                            <Text fontSize={'sm'}>{house.address}</Text>
                        </Flex>
                        <Text fontSize={'md'} fontWeight={'bold'}>
                            {props.data.price}K Algo
                        </Text>
                    </Flex>
                    <Flex direction={'row'} justifyContent={'space-between'}>
                        <Text fontSize={'md'} fontWeight={'bold'}>
                            Offered Price: {props.data.price}K Algo
                        </Text>
                        <IconButton
                            aria-label={'Accept Offer'}
                            colorScheme={'red'}
                            icon={<AiOutlineClose size={20} />}
                            w={12}
                            h={12}
                            onClick={() => { handleDeleteOffer() }}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    </Flex>
    );
};

export default BidsCard;