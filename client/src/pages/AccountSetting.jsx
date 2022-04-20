import { useState } from 'react'
import {
    Box,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useColorModeValue
} from '@chakra-ui/react'


const AccountSetting = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const nameModal =
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Save
            </Button>
            <Button variant='ghost'>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    return (
        <>
        <h style={{fontSize:'30pt',margin:'3%'}}><b>Profile</b></h>
        <Box
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            width='94%'
            p={5}
            marginLeft={'3%'}
        >
            <Box marginBottom='2%'>
                <h style={{fontSize:'15pt',margin:'3%'}}><b>Personal Info</b></h>
                <div>
                <h style={{fontSize:'10pt',margin:'3%'}}><b>Name</b></h>
                <p style={{fontSize:'10pt',marginLeft:'3%'}}>Updates are reflected across all Algorent experiences.</p>
                </div>
                <div>
                <h style={{fontSize:'10pt',margin:'3%'}}><b>Photo</b></h>
                <p style={{fontSize:'10pt',marginLeft:'3%'}}>Personalize your profile pic with a custom photo.</p>
                </div>
            </Box>
            <Box marginBottom='2%'>
                <h style={{fontSize:'15pt',margin:'3%'}}><b>Sign in & Security</b></h>
                <div>
                <h style={{fontSize:'10pt',margin:'3%'}}><b>Email</b></h>
                <p style={{fontSize:'10pt',marginLeft:'3%'}}>The email address associated with your account.</p>
                </div>
                <div>
                <h style={{fontSize:'10pt',margin:'3%'}}><b>Password</b></h>
                <p style={{fontSize:'10pt',marginLeft:'3%'}}>Set a unique password to protect your account.</p>
                </div>
            </Box>
        </Box>
        </>
    )
}

export default AccountSetting;
