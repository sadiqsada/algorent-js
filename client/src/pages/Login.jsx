import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
  InputGroup,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  useBoolean,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Axios from 'axios';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const web_url = 'http://localhost:8000' //'http://localhost:8000';
  const handleSubmit = values => {
    Axios.post(
      web_url + '/login',
      {
        email: values.email,
        password: values.password,
      },
      { withCredentials: true, credentials: 'include' }
    )
      .then(response => {
        if (response.data.success) {
          setIsLoggedIn(true);
          navigate('/Explore');
        }
      })
      .catch(error => {
        alert(error.response.data.message);
      });
  };

  const validateEmail = value => {
    let error;
    if (!value) {
      error = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }
    return error;
  };

  const [rememberMe, setRememberMe] = useBoolean();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            and continue where you left off
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <Formik
              initialValues={{ email: '', password: '' }}
              onSubmit={(values, actions) => {
                const useValues = { ...values, rememberMe };
                handleSubmit(useValues);
                actions.setSubmitting(false);
              }}
            >
              {props => (
                <Form>
                  <Stack spacing={10}>
                    <Stack spacing={4}>
                      <Field name="email" validate={validateEmail}>
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.email && form.touched.email}
                            isRequired
                          >
                            <FormLabel htmlFor="email">Email address</FormLabel>
                            <Input
                              {...field}
                              id="email"
                              placeholder=""
                              type={'text'}
                            />
                            <FormErrorMessage>
                              {form.errors.email}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="password">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.password && form.touched.password
                            }
                            isRequired
                          >
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <InputGroup>
                              <Input
                                {...field}
                                id="password"
                                placeholder=""
                                type={showPassword ? 'text' : 'password'}
                              />
                              <InputRightElement h={'full'}>
                                <Button
                                  variant={'ghost'}
                                  onClick={() =>
                                    setShowPassword(
                                      showPassword => !showPassword
                                    )
                                  }
                                >
                                  {showPassword ? (
                                    <ViewIcon />
                                  ) : (
                                    <ViewOffIcon />
                                  )}
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>
                              {form.errors.password}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        align={'start'}
                        justify={'space-between'}
                      >
                        <Checkbox onChange={setRememberMe.toggle}>
                          Remember me
                        </Checkbox>
                        <Link color={'blue.400'} href={'ForgotPassword'}>
                          Forgot password?
                        </Link>
                      </Stack>
                    </Stack>
                    <Button
                      mt={4}
                      colorScheme="teal"
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Login
                    </Button>
                    <Text align={'center'}>
                      Not a user?{' '}
                      <Link color={'blue.400'} href={'Register'}>
                        Sign up
                      </Link>
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
};

export default Login;
