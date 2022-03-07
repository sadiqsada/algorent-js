import React from 'react';
import { Image, keyframes, usePrefersReducedMotion } from '@chakra-ui/react';
import logo from './logo.svg';


export const Logo = props => {
  return <Image boxSize='50px' objectFit='fit' src={logo} {...props} />;
};
