import { useRef, useState } from 'react';
import {
    Box,
    Button,
    useDisclosure,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    FormControl,
    FormLabel,
    Input,
    ModalCloseButton,
    useColorModeValue
} from '@chakra-ui/react'


const AccountSetting = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { isOpen: isOpenWalletConnectModal,
          onOpen: onOpenWalletConnectModal,
          onClose: onCloseWalletConnectModal } = useDisclosure();
  const walletIDRef = useRef();
  const walletMnemonicRef = useRef();
  const [walletIDField, setWalletIDField] = useState();
  const handleWalletIDField = event => setWalletIDField(event.target.value);
  const [walletMnemonicField, setWalletMnemonicField] = useState();
  const handleWalletMnemonicField = event => setWalletMnemonicField(event.target.value);
  const handleWalletConnection = () => {
    alert(`Calling Axios with wallet ID: ${walletIDField} and wallet mnemonic: ${walletMnemonicField}`);
    axios
      .post('http://localhost:8000/connectWallet', {
        walletID: walletIDField,
        walletMnemonic: walletMnemonicField
      })
      .then(response => {
        // Testing purposes
        console.log('response.data');
        console.log(response.data);
        // Tell user that their wallet has been connected?
        alert(response.data);
        // Close the wallet connection window
        onCloseWalletConnectModal();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const nameModal =
      <Modal isOpen={isOpenWalletConnectModal} onClose={onCloseWalletConnectModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onCloseWalletConnectModal}>
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

            <Button onClick={onOpenWalletConnectModal}>Connect your Wallet</Button>
            <Modal
            initialFocusRef={walletIDRef}
            isOpen={isOpenWalletConnectModal}
            onClose={onCloseWalletConnectModal}
            >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Enter Wallet Credentials</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Wallet ID</FormLabel>
                  <Input
                    value={walletIDField}
                    onChange={handleWalletIDField} 
                    ref={walletIDRef} placeholder='Wallet ID' />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Wallet Mnemonic</FormLabel>
                  <Input
                    value={walletMnemonicField}
                    onChange={handleWalletMnemonicField} 
                    ref={walletMnemonicRef} placeholder='Wallet Mnemonic' />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={handleWalletConnection} colorScheme='blue' mr={3}>
                  Connect
                </Button>
                <Button onClick={onCloseWalletConnectModal}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        </Box>
        </>
    )
}

export default AccountSetting;
