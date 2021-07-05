import React from "react";
import { useFormikContext } from "formik";
import { StyleSheet, View } from "react-native";

import AppTextInput from "./AppTextInput";
import ErrorMessage from "./ErrorMessage";
import AppText from "./AppText";

const AppFormField = ({ name, label, numberOfLines, contStyle, defaultValue, ...rest }) => {
  const { setFieldTouched, handleChange, errors, touched, values } =
    useFormikContext();
  return (
    <View style={[styles.container, contStyle]}>
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        numberOfLines={numberOfLines}
        value={values[name]}
        defaultValue={defaultValue}
        {...rest}
      />
      {label && (
        <AppText
          style={{
            left: 40,
            top: -6,
            fontSize: 14,
            position: "absolute",
            color: "#9AA5B0",
            fontWeight: "700",
            backgroundColor: "#FFFFFF",
          }}
        >
          {label}
        </AppText>
      )}

      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
  },
});

export default AppFormField;
