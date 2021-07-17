import React, { useState } from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { Formik } from "formik";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import LoadingIndicator from "../components/LoadingIndicator";
import SubmitButton from "../components/SubmitButton";
import ErrorMessage from "../components/ErrorMessage";
import authApi from "../api/auth";

const CELL_COUNT = 4;

const VerificationCodeScreen = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleSubmit = async() => {
    setLoading(true);

    if(!value) {
      setError("Invalid OTP!");
    }

    const data = {
      otp: value
    }
    const otpres = await authApi.verifyOtp(data);

    if(!otpres.ok) {
      setLoading(false);
      console.log("otpres not ok", otpres);
      setError(otpres.data?.msg ? otpres.data.msg : "Invalid OTP!");
      return;
    }
    setLoading(false);
    alert('Verified')
    navigation.navigate('ProfileSetup')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Formik initialValues={{ name: "", hospital: "", address: "" }} onSubmit={handleSubmit}>
        <>
        <LoadingIndicator visible={loading} />
        {error && <ErrorMessage error={error} visible={!loading} />}
          <View style={styles.container1}>
            <Text style={styles.text1}>
              Please enter the verification code here
            </Text>
            <CodeField
              ref={ref}
              {...props}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
            <View style={{ top: 40 }}>
              <SubmitButton title="Submit" />
            </View>
          </View>
        </>
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  container1: {
    marginHorizontal: 30,
  },
  text1: {
    color: "#47687F",
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  cell: {
    width: 60,
    height: 60,
    borderRadius: 10,
    fontSize: 35,
    borderWidth: 2,
    borderColor: "#D9D9D9",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    color: "#47687F",
  },
  focusCell: {
    borderColor: "#47687F",
  },
  codeFieldRoot: { marginTop: 20 },
});

export default VerificationCodeScreen;