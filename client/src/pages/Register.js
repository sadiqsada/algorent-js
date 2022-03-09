import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    FormErrorMessage,
    Link,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import { Formik, Form, Field } from 'formik';
  import Axios from 'axios';
  
  const SignUp = () => {

    const handleSubmit = (values) => {
      Axios
        .post('http://localhost:8000/register', {
          firstName: values.firstname,
          lastName: values.lastname,
          email: values.email,
          password: values.password,
          passwordVerify: values.passwordVerify
        })
        .then(response => {
          alert(response.data.message);
        })
        .catch(error => {
          alert(error);
        });
    };

    function validateEmail(value) {
      let error;
      if (!value) {
          error = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
          error = 'Invalid email address';
      }
      return error;
    };

    function validatePassword(value) {
      let error;
      if (!value) {
          error = 'Required';
      } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
      }
      return error;
    };

    function validateConfirmPassword(value) {
      let pass = document.getElementById('password').value;
      let error = "";
      if (value) {
        if (pass !== value) {
          error = "Password does not match";
        }
      } else {
          error = 'Required';
      }
      return error;
    };

    const [showPassword, setShowPassword] = useState(false);
  
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              and search for your dream house today!
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>

            <Formik
                initialValues={{ firstname: '', lastname: '', email: '', password: '', passwordVerify: ''}}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        //alert(JSON.stringify(values, null, 2))
                        handleSubmit(values);
                        actions.setSubmitting(false)
                    }, 1000)
                }}
            >

            {(props) => (
              <Form>
                <HStack>
                  <Field name='firstname'>
                    {({ field, form }) => (
                    <FormControl isInvalid={form.errors.firstname && form.touched.firstname} isRequired>
                      <FormLabel htmlFor='firstname'>First Name</FormLabel>
                      <Input {...field} id='firstname' placeholder='' type={'text'}/>
                      <FormErrorMessage>{form.errors.firstname}</FormErrorMessage>
                    </FormControl>
                    )}
                  </Field>
                  <Field name='lastname'>
                    {({ field, form }) => (
                    <FormControl isInvalid={form.errors.lastname && form.touched.lastname} isRequired>
                      <FormLabel htmlFor='lastname'>Last Name</FormLabel>
                      <Input {...field} id='lastname' placeholder='' type={'text'}/>
                      <FormErrorMessage>{form.errors.lastname}</FormErrorMessage>
                    </FormControl>
                    )}
                  </Field>
                </HStack>

                <Field name='email' validate={validateEmail}>
                    {({ field, form }) => (
                    <FormControl isInvalid={form.errors.email && form.touched.email} isRequired>
                        <FormLabel htmlFor='email'>Email address</FormLabel>
                        <Input {...field} id='email' placeholder='' type={'text'}/>
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                    )}
                </Field>

                <Field name='password' validate={validatePassword}>
                {({ field, form }) => (
                <FormControl isInvalid={form.errors.password && form.touched.password} isRequired>
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <InputGroup>
                    <Input {...field} id='password' placeholder='' type={showPassword ? 'text' : 'password'} />
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
                )}
                </Field>

                <Field name='passwordVerify' validate={validateConfirmPassword}>
                {({ field, form }) => (
                <FormControl isInvalid={form.errors.passwordVerify && form.touched.passwordVerify} isRequired>
                  <FormLabel htmlFor='passwordVerify'>Retype Password</FormLabel>
                  <InputGroup>
                    <Input {...field} id='passwordVerify' placeholder='' type={showPassword ? 'text' : 'password'} />
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{form.errors.passwordVerify}</FormErrorMessage>
                </FormControl>
                )}
                </Field>

                <Stack spacing={10} pt={2}>
                <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={props.isSubmitting}
                    type='submit'
                >
                    Sign Up
                </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'}>
                    Already a user? <Link color={'blue.400'} href='Login'>Login</Link>
                  </Text>
                </Stack>
              </Form>
            )}
            </Formik>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }

  export default SignUp;