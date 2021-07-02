import React from "react";

import { useFormikContext } from "formik";

import ErrorMessage from "../ErrorMessage";
import AppFilePicker from "./AppFilePicker";

const FormFilePicker = ({ name, size, initialUrl }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <AppFilePicker
        size={size}
        initialUrl={initialUrl}
        onChangeUri={(fileUri) => setFieldValue(name, fileUri)}
      />
      <ErrorMessage error={errors[name]} visible={!values[name]} />
    </>
  );
};

export default FormFilePicker;
