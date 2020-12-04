import React from "react";
import { useFormikContext } from "formik";
import { StyleSheet, View } from "react-native";

import AppTextInput from "./AppTextInput";
import ErrorMessage from "./ErrorMessage";

const AppFormField = ({ name, ...rest }) => {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
  return (
    <>
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        {...rest}
      />

      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

const styles = StyleSheet.create({});

export default AppFormField;
