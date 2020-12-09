import React from "react";
import { useFormikContext } from "formik";
import { StyleSheet, View } from "react-native";

import AppTextInput from "./AppTextInput";
import ErrorMessage from "./ErrorMessage";
import AppText from "./AppText";

const AppFormField = ({ name, label, numberOfLines, ...rest }) => {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
  return (
    <View style={styles.container}>
      {label && <AppText>{label}</AppText>}
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        numberOfLines={numberOfLines}
        {...rest}
      />

      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
});

export default AppFormField;
