import { FieldProps } from "formik";
import { useColorModeValue } from '@chakra-ui/react';
import React from "react";
import Select from "react-select";
import { Options, OnChangeValue } from "react-select";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps extends FieldProps {
  options: Options<Option>;
  isMulti?: boolean;
  className?: string;
  placeholder?: string;
}

export const CustomSelect = ({
  className,
  placeholder,
  field,
  form,
  options,
  isMulti = false
}: CustomSelectProps) => {
  const onChange = (OnChangeValue) => {
    form.setFieldValue(
      field.name,
      isMulti
    ? (OnChangeValue as Option[]).map((item: Option) => item.value)
    : (OnChangeValue as Option).value)
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter(option => field.value.indexOf(option.value) >= 0)
        : options.find(option => option.value === field.value);
    } else {
      return isMulti ? [] : ("" as any);
    }
  };

  const customStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'transparent' }),
    menu: (styles) => ({ ...styles, backgroundColor: useColorModeValue('white', '#7393B3')}),
    option:(provided:any) => ({
      ...provided,
      height:'100%',
      color:'black',
      paddingTop:'3px',
    }),
    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: "teal"
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: 'white',
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: 'white',
      ':hover': {
        color: 'black',
      },
    }),
  }

  return (
    <Select
      className={className}
      name={field.name}
      value={getValue()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      maxMenuHeight={200}
      styles={customStyles}
      theme={(theme) => ({
      ...theme,
      borderRadius: 0,
      colors: {
        ...theme.colors,
        primary25: 'teal',
        primary: 'teal',
      },
    })}
    />
  );
};

export default CustomSelect;