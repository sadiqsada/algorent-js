import { useState, useEffect, useRef } from 'react'
import {
    Avatar,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useColorModeValue,
    Text,
    Center
} from '@chakra-ui/react'
import axios from 'axios';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Formik, Form, Field } from 'formik';

const AccountSetting = () => {
  const [ currentUser, setCurrentUser ] = useState()
  const [ code, setCode ] = useState()
  const [ showPassword, setShowPassword] = useState(false);
  const [ avatar, setAvatar ] = useState()
  const [ img, setImg ] = useState()
  const ref = useRef(null);
  const { isOpen:nameIsOpen, onOpen:nameOnOpen, onClose:nameOnClose } = useDisclosure()
  const { isOpen:photoIsOpen, onOpen:photoOnOpen, onClose:photoOnClose } = useDisclosure()
  const { isOpen:emailIsOpen, onOpen:emailOnOpen, onClose:emailOnClose } = useDisclosure()
  const { isOpen:passwordIsOpen, onOpen:passwordOnOpen, onClose:passwordOnClose } = useDisclosure()

  const getCurrentUser = async () => {
    const response = await axios.get('http://localhost:8000/getCurrentUser', {
      withCredentials: true,
      credentials: 'include',
    });
    const user = response.data.user;
    setCurrentUser(user);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleChangeName = async(values) => {
    const response = await axios.post('http://localhost:8000/changeUsername', {
        withCredentials: true,
        credentials: 'include',
        user: currentUser,
        firstName: values.firstName,
        lastName: values.lastName
    });
    if (response.data.success){
      nameOnClose()
      getCurrentUser()
    }else{
      alert(response.data.message);
    }
  }

  const handleSendVerification = async() => {
      const response = await axios.post('http://localhost:8000/sendVerification', {
          withCredentials: true,
          credentials: 'include',
          user: currentUser,
          email: ref.current.values.email
      });
      if (response.data.success){
        setCode(response.data.code)
      }else{
        alert(response.data.message);
      }
  }

  const handleChangeEmail = async(values) => {
    if (code === ref.current.values.verification){
      const response = await axios.post('http://localhost:8000/changeEmail', {
          withCredentials: true,
          credentials: 'include',
          user: currentUser,
          email: values.email,
      });
      if (response.data.success){
        emailOnClose()
        getCurrentUser()
      }else{
        alert(response.data.message);
      }
    }else{
      alert("Please check your email for verification code");
    }
  }

  const validateEmail = value => {
    let error;
    if (!value) {
      error = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }
    return error;
  };

  const validatePassword = value => {
    let error;
    if (!value) {
      error = 'Required';
    } else if (value.length < 8) {
      error = 'Password must be at least 8 characters';
    }
    return error;
  };

  const validateConfirmPassword = value => {
    let pass = document.getElementById('newPass').value;
    let error = '';
    if (value) {
      if (pass !== value) {
        error = 'Password does not match';
      }
    } else {
      error = 'Required';
    }
    return error;
  };

  const handleChangePassword = async(values) => {
    const response = await axios.post('http://localhost:8000/changePassword', {
          withCredentials: true,
          credentials: 'include',
          user: currentUser,
          oldPass: values.oldPass,
          newPass: values.newPass
    });
    if (response.data.success){
      passwordOnClose()
      getCurrentUser()
    }else{
      alert(response.data.message);
    }
  }

  const handleAvatar = (e) => {
    setImg(URL.createObjectURL(e.target.files[0]));
    setAvatar(e.target.files[0])
  }

  const handleChangeAvatar = async() => {
    const formData = new FormData();
    formData.append('photo', avatar)
    formData.append('user', currentUser._id)
    const response = await axios.post('http://localhost:8000/uploadAvatar', formData);
    if (response.data.success){
      photoOnClose()
      getCurrentUser()
    }else{
      alert(response.data.message);
    }
  }

  const photoClose = () => {
    setAvatar(null)
    setImg(null)
    photoOnClose()
  }

  const nameModal =
      <Modal isOpen={nameIsOpen} onClose={nameOnClose} isCentered>
        <ModalOverlay />
        <Formik
          initialValues={{
            firstName: '',
            lastName: ''
          }}
          onSubmit={(values, actions) => {
            handleChangeName(values);
            actions.setSubmitting(false);
          }}
        >
        <Form>
        <ModalContent>
          <ModalHeader>Edit Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Field name="firstName">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.firstName && form.touched.firstName}
                isRequired
              >
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <Input
                  {...field}
                  id="firstName"
                  placeholder=""
                  type={'text'}
                />
                <FormErrorMessage>{form.errors.firstName}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="lastName">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.lastName && form.touched.lastName}
                isRequired
              >
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <Input
                  {...field}
                  id="lastName"
                  placeholder=""
                  type={'text'}
                />
                <FormErrorMessage>{form.errors.lastName}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} type="submit">
              Save
            </Button>
            <Button variant='ghost' onClick={nameOnClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
        </Form>
      </Formik>
      </Modal>

  let photo;
  if(avatar){
    photo = <Center marginBottom='5%'><Image boxSize='250px' borderRadius='full' src={img}/></Center>
  }
  const photoModal =
    <Modal isOpen={photoIsOpen} onClose={photoClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <form encType='multipart/form-data' onSubmit={handleChangeAvatar}>
          <ModalHeader>Edit Photo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              {photo}
              <input 
                  type="file" 
                  accept=".png, .jpg, .jpeg"
                  name="photo"
                  onChange={handleAvatar}
              />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} type='submit'>
              Save
            </Button>
            <Button variant='ghost' onClick={photoClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>

  const emailModal =
      <Modal isOpen={emailIsOpen} onClose={emailOnClose} isCentered>
        <ModalOverlay />
        <Formik
          innerRef={ref}
          initialValues={{
            email: ''
          }}
          onSubmit={(values, actions) => {
            handleChangeEmail(values);
            actions.setSubmitting(false);
          }}
        >
        <Form>
        <ModalContent>
          <ModalHeader>Edit Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Field name="email" validate={validateEmail}>
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.email && form.touched.email}
                isRequired
              >
                <FormLabel htmlFor="email">Email</FormLabel>
                <Flex>
                <Input
                  {...field}
                  id="email"
                  placeholder=""
                  type={'text'}
                />
                <Button marginLeft='3%' colorScheme='teal' onClick={handleSendVerification} disabled={form.errors.email && form.touched.email}>Send Email</Button>
                </Flex>
                <FormErrorMessage>{form.errors.email}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="verification">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.verification && form.touched.verification}
                isRequired
              >
                <FormLabel htmlFor="verification">Verification Code</FormLabel>
                <Input
                  {...field}
                  id="verification"
                  placeholder=""
                  type={'text'}
                />
                <FormErrorMessage>{form.errors.verification}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} type="submit">
              Save
            </Button>
            <Button variant='ghost' onClick={emailOnClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
        </Form>
      </Formik>
      </Modal>


  const passwordModal =
    <Modal isOpen={passwordIsOpen} onClose={passwordOnClose} isCentered>
      <ModalOverlay />
      <Formik
        innerRef = {ref}
        initialValues={{
          oldPass: '',
          newPass: '',
          comfirmPass:''
        }}
        onSubmit={(values, actions) => {
          handleChangePassword(values);
          actions.setSubmitting(false);
        }}
      >
      <Form>
      <ModalContent>
        <ModalHeader>Edit Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <Field name="oldPass" >
          {({ field, form }) => (
            <FormControl
              isInvalid={form.errors.oldPass && form.touched.oldPass}
              isRequired
            >
              <FormLabel htmlFor="oldPass">Old Password</FormLabel>
              <InputGroup>
                <Input
                  {...field}
                  id="oldPass"
                  placeholder=""
                  type={showPassword ? 'text' : 'password'}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword(showPassword => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{form.errors.oldPass}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
        <Field name="newPass" validate={validatePassword}>
          {({ field, form }) => (
            <FormControl
              isInvalid={form.errors.newPass && form.touched.newPass}
              isRequired
            >
              <FormLabel htmlFor="newPass">New Password</FormLabel>
              <InputGroup>
                <Input
                  {...field}
                  id="newPass"
                  placeholder=""
                  type={showPassword ? 'text' : 'password'}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword(showPassword => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{form.errors.newPass}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
        <Field name="comfirmPass" validate={validateConfirmPassword}>
          {({ field, form }) => (
            <FormControl
              isInvalid={form.errors.comfirmPass && form.touched.comfirmPass}
              isRequired
            >
              <FormLabel htmlFor="comfrimPass">Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  {...field}
                  id="confirmPass"
                  placeholder=""
                  type={showPassword ? 'text' : 'password'}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword(showPassword => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{form.errors.comfirmPass}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='teal' mr={3} type="submit">
            Save
          </Button>
          <Button variant='ghost' onClick={passwordOnClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
      </Form>
    </Formik>
    </Modal>

    return (
        <>
        <h style={{fontSize:'30pt',margin:'3%'}}><b>Profile</b></h>
        <Box
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            // outline={'1px solid #D3D3D3'}
            width='94%'
            p={5}
            marginLeft={'3%'}
        >
            <Box marginBottom='2%'>
                <h style={{fontSize:'20pt',margin:'3%'}}><b>Personal Info</b></h>
                <Box marginTop='1%'>
                <Button onClick={nameOnOpen} float='right' size='sm' colorScheme='teal'>Edit</Button>
                <Text float='right' marginRight='2%'>{currentUser && currentUser.firstName + " " + currentUser.lastName}</Text>
                <h style={{fontSize:'10pt',margin:'3%'}}><b>Name</b></h>
                <p style={{fontSize:'10pt',marginLeft:'3%'}}>Updates are reflected across all Algorent experiences.</p>
                {nameModal}
                </Box>
                <Box marginTop='1%'>
                <Button onClick={photoOnOpen} float='right' size='sm' colorScheme='teal'>Edit</Button>
                <Image float='right' marginRight='2%' boxSize ='50px' borderRadius='full' src={`data:image/png;base64,${currentUser&&currentUser.avatar.toString()}`}></Image>
                <h style={{fontSize:'10pt',margin:'3%'}}><b>Photo</b></h>
                <p style={{fontSize:'10pt',marginLeft:'3%'}}>Personalize your profile pic with a custom photo.</p>
                {photoModal}
                </Box>
            </Box>
            <Box marginBottom='2%'>
                <h style={{fontSize:'20pt',margin:'3%'}}><b>Sign in & Security</b></h>
                <Box marginTop='1%'>
                <Button onClick={emailOnOpen} float='right' size='sm' colorScheme='teal'>Edit</Button>
                <Text float='right' marginRight='2%'>{currentUser && currentUser.email}</Text>
                <h style={{fontSize:'10pt',margin:'3%'}}><b>Email</b></h>
                <p style={{fontSize:'10pt',marginLeft:'3%'}}>The email address associated with your account.</p>
                {emailModal}
                </Box>
                <Box marginTop='1%'>
                <Button onClick={passwordOnOpen} float='right' size='sm' colorScheme='teal'>Edit</Button>
                <h style={{fontSize:'10pt',margin:'3%'}}><b>Password</b></h>
                <p style={{fontSize:'10pt',marginLeft:'3%'}}>Set a unique password to protect your account.</p>
                {passwordModal}
                </Box>
            </Box>
        </Box>
        </>
    )
}

export default AccountSetting;
