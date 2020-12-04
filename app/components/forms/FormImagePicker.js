import React from "react";

import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import ImageInput from "./ImageInput";

const FormImagePicker = ({ name }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <ImageInput
        imageUri={values[name]}
        onChangeImage={(uri) => setFieldValue(name, uri)}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default FormImagePicker;
