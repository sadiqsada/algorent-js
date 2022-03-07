import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
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
  
import {
    Formik,
    Form,
    Field,
} from 'formik';

export function Login() {

    function validateEmail(value) {
        let error;
        if (!value) {
            error = 'Required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = 'Invalid email address';
        }
        return error;
    }

    const [rememberMe, setRememberMe] = useBoolean();

    return (
        <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            </Stack>
            <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
                <Formik
                initialValues={{ email: '', password: ''}}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        const useValues = {...values, rememberMe}
                        alert(JSON.stringify(useValues, null, 2))
                        actions.setSubmitting(false)
                    }, 1000)
                }}
                >
                {(props) => (
                    <Form>
                        <Stack spacing={10}>
                            <Stack spacing={4}>
                                <Field name='email' validate={validateEmail}>
                                    {({ field, form }) => (
                                    <FormControl isInvalid={form.errors.name && form.touched.name} isRequired>
                                        <FormLabel htmlFor='email'>Email address</FormLabel>
                                        <Input {...field} id='email' placeholder='' type={'text'}/>
                                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                    </FormControl>
                                    )}
                                </Field>
                                <Field name='password'>
                                    {({ field, form }) => (
                                    <FormControl isInvalid={form.errors.name && form.touched.name} isRequired>
                                        <FormLabel htmlFor='password'>Password</FormLabel>
                                        <Input {...field} id='password' placeholder='' type={'text'}/>
                                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                    </FormControl>
                                    )}
                                </Field>
                                <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                    <Checkbox onChange={setRememberMe.toggle}>
                                        Remember me
                                    </Checkbox>
                                    <Link color={'blue.400'} href={'ForgotPassword'}>Forgot password?</Link>
                                </Stack>
                            </Stack>
                            <Button
                                mt={4}
                                colorScheme='teal'
                                isLoading={props.isSubmitting}
                                type='submit'
                            >
                                Login
                            </Button>
                            <Text align={'center'}>
                                Not a user? <Link color={'blue.400'} href={'SignUp'}>Sign up</Link>
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