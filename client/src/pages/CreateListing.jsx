import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    useColorModeValue,
    Input,
    FormErrorMessage,
  } from '@chakra-ui/react';
import Axios from 'axios';
import FileUpload from '../components/FileUpload.jsx'
import { Formik, Form, Field } from 'formik';
import CustomSelect from "../components/CustomSelect.tsx";
import { useState } from 'react';

const CreateListing =  () =>{
    const [checked, setChecked] = useState(false)
    const [images, setImages] = useState([])
    const web_url = 'http://localhost:8000' //'http://localhost:8000'; //
    const handleSubmit = (values) => {
        Axios
          .post(web_url + '/createListing', {
              image: images,
              address: values.address,
              zipCode: values.zipCode,
              state: values.state,
              city: values.city,
              size: values.size,
              numBed: values.numBed,
              numBath: values.numBath,
              amenities: values.amenities,
              price: values.price,
              contact: values.contact,
          })
          .then(response => {
            alert(response.data.message);
          })
          .catch(error => {
            alert(error);
          });
    };

    const amenitiesOptions = [
      {label: "Air Conditioning", value: "ac"},
      {label: "Balcony", value: "balcony"},
      {label: "Dishwasher", value: "dishwasher"},
      {label: "Garage", value: "garage"},
      {label: "Gym", value: "gym"},
      {label: "Hardwood Floor", value: "hardwood"},
      {label: "On-Site Laundry", value: "laundry"},
      {label: "Pool", value: "pool"},

    ];

    const term = " I agree to, acknowledge and understand the following: (i) I am (or I have authority to act on behalf of) the owner of this home; (ii) I will not provide incorrect information; (iii) I will be posting my property 'for sale by owner' on algorent.com and other affiliated websites and that I will solely be responsible for maintaining and updating the posting and responding to and negotiating potential offers to purchase the property;" 
    
    const handleCheck = () =>{
      setChecked(!checked)
    }

    const handleImage = (files) =>{
      if(files){
        setImages(files)
      }
    }

    return(
        <div>
            <Formik
              initialValues={{
                image:[],
                address:'',
                zipCode: '',
                state: '',
                size: '',
                numBed: null,
                numBath: null,
                amenities: [],
                price: null,
                contact: ''
              }}
              onSubmit={(values, actions) => {
                handleSubmit(values);
                actions.setSubmitting(false);
              }}
            >
              <Form>
                <Box 
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  width='98%'
                  p={10}
                  margin={'1%'}
                >
                  <Field name="image">
                    {({ field, form }) =>
                      <FormControl
                        isInvalid={form.errors.image && form.touched.image}
                        isRequired
                      >
                        <FileUpload onChange={(files) => handleImage(files)}/>
                        <FormErrorMessage>{form.errors.image}</FormErrorMessage>
                      </FormControl>
                    }
                    
                  </Field>
                </Box>

                <Box 
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  width='98%'
                  p={5}
                  marginLeft={'1%'}
                  display='inline-flex'
                >
                  <Flex margin='2%' width = '50%'>
                  <Field name="address">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.address && form.touched.address}
                        isRequired
                      >
                        <FormLabel htmlFor="address">Address</FormLabel>
                        <Input
                          {...field}
                          id="address"
                          placeholder=""
                          type={'text'}
                        />
                        <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  </Flex>
                  <Flex margin='2%' width='50%'>
                  <Field name="city">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.city && form.touched.city}
                        isRequired
                      >
                        <FormLabel htmlFor="city">City</FormLabel>
                        <Input
                          {...field}
                          id="city"
                          placeholder=""
                          type={'text'}
                        />
                        <FormErrorMessage>{form.errors.city}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  </Flex>
                </Box>

                <Box 
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  width='98%'
                  p={5}
                  marginLeft={'1%'}
                  display='inline-flex'
                >
                  <Flex margin='2%' width='50%'>
                  <Field name="state">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.state && form.touched.state}
                        isRequired
                      >
                        <FormLabel htmlFor="state">State</FormLabel>
                        <Input
                          {...field}
                          id="state"
                          placeholder=""
                          type={'text'}
                        />
                        <FormErrorMessage>{form.errors.state}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  </Flex>
                  <Flex margin='2%' width='50%'>
                  <Field name="zipCode">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.zipCode && form.touched.zipCode}
                        isRequired
                      >
                        <FormLabel htmlFor="zipCode">Zip Code</FormLabel>
                        <Input
                          {...field}
                          id="zipCode"
                          placeholder=""
                          type={'text'}
                        />
                        <FormErrorMessage>{form.errors.city}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  </Flex>
                </Box>

                <Box 
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  width='98%'
                  p={5}
                  marginLeft={'1%'}
                  display='inline-flex'
                >
                  <Flex margin='2%' width='50%'>
                  <Field name="size">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.size && form.touched.size}
                        isRequired
                      >
                        <FormLabel htmlFor="size">Size(sq ft)</FormLabel>
                        <Input
                          {...field}
                          id="size"
                          placeholder=""
                          type={'text'}
                        />
                        <FormErrorMessage>{form.errors.size}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  </Flex>
                  <Flex width='50%' margin='2%'>
                  <Field name="numBed">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.numBed && form.touched.numBed}
                        isRequired
                      >
                        <FormLabel htmlFor="numBed">Number of Bedroom(s)</FormLabel>
                        <Input
                          {...field}
                          id="numBed"
                          placeholder=""
                          type={'text'}
                        />
                        <FormErrorMessage>{form.errors.numBed}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="numBath">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.numBath && form.touched.numBath}
                        isRequired
                      >
                        <FormLabel htmlFor="numBath">Number of Bathroom(s)</FormLabel>
                        <Input
                          {...field}
                          id="numBath"
                          placeholder=""
                          type={'text'}
                        />
                        <FormErrorMessage>{form.errors.numBath}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  </Flex>
                </Box>

                <Box 
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  width='98%'
                  p={5}
                  marginLeft={'1%'}
                  display='inline-flex'
                >
                  <Flex margin='2%' width='50%' display='block'>
                  <FormLabel htmlFor="amenities">Amenities</FormLabel>
                  <Field name="amenities" 
                    isMulti={true}
                    options={amenitiesOptions} 
                    component={CustomSelect}
                  />
                  </Flex>
                  <Flex width='50%' margin='2%'>
                  <Field name="price">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.price && form.touched.price}
                        isRequired
                      >
                        <FormLabel htmlFor="price">Price (in USD)</FormLabel>
                        <Input
                          {...field}
                          id="price"
                          placeholder="$"
                          type={'text'}
                        />
                        <FormErrorMessage>{form.errors.numBed}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="contact">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.contact && form.touched.contact}
                        isRequired
                      >
                        <FormLabel htmlFor="contact">Contact Information</FormLabel>
                        <Input
                          {...field}
                          id="contact"
                          placeholder=""
                          type={'text'}
                        />
                        <FormErrorMessage>{form.errors.cont}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  </Flex>
                </Box>
                <Box
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                width='98%'
                p={5}
                marginLeft={'1%'}
                display='inline-block'
                >
                <div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleCheck}
                  />
                  {term}
                </div>
                <Button
                  float='right'
                  margin='1%'
                  disabled={!checked || images.length < 1}
                  fontSize='32px'
                  padding='32px 16px'
                  colorScheme="teal"
                  type="submit"
                >
                Post Sale by Owner
                </Button>
                </Box>
              </Form>
          </Formik>
      </div>
    )
}

export default CreateListing;
