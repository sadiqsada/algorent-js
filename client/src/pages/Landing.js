import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

const Landing = () => {
    return (
        <Box>
        <Text p={'4'} fontSize={'2xl'} color={useColorModeValue('gray.800', 'gray.400')}>
            This is the landing page<br/>
            For now, you can visit the Login page and all its subpages
        </Text>
      </Box>
    );
}

export default Landing;