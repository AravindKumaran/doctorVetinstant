import React, { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import AppText from "../components/AppText";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import ErrorMessage from "../components/forms/ErrorMessage";

import authApi from "../api/auth";
import AuthContext from "../context/authContext";
import authStorage from "../components/utils/authStorage";

import usersApi from "../api/users";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  cnfPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password do not match")
    .label("Confirm Password"),
});

const RegisterScreen = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    const res = await authApi.register(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.data.msg);
      return;
    }
    setError(null);
    authStorage.storeToken(res.data.token);
    const userRes = await usersApi.getLoggedInUser();
    setUser(userRes.data.user);
  };

  return (
    <View style={styles.container}>
      <AppText>Register</AppText>

      {error && <ErrorMessage error={error} visible={!loading} />}

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {() => (
          <>
            <AppFormField
              icon='email'
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='email-address'
              name='email'
              placeholder='Enter your email id'
            />

            <AppFormField
              autoCapitalize='none'
              autoCorrect={false}
              icon='lock'
              name='password'
              secureTextEntry
              placeholder='Enter your password'
            />

            <AppFormField
              autoCapitalize='none'
              autoCorrect={false}
              icon='lock'
              name='cnfPassword'
              secureTextEntry
              placeholder='Retype your password'
            />

            <SubmitButton title='Register' />
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 60,
  },
});

export default RegisterScreen;
