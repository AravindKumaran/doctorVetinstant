import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-community/google-signin";
import AppText from "../components/AppText";
import AppFormField from "../components/AppFormField";
import SubmitButton from "../components/SubmitButton";
import ErrorMessage from "../components/ErrorMessage";
import authApi from "../api/auth";
import usersApi from "../api/users";
import AuthContext from "../context/authContext";
import authStorage from "../components/utils/authStorage";
import LoadingIndicator from "../components/LoadingIndicator";
import socket from "../components/utils/socket";
import LinearGradient from "react-native-linear-gradient";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(8).label("Password"),
});

const LoginScreen = ({ navigation, route }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);

  const title = route.name;

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    const res = await authApi.login(email, password);
    if (!res.ok) {
      console.log("Error", res);
      setError(res.data?.msg);
      setLoading(false);
      return;
    }
    setError(null);
    authStorage.storeToken(res.data.token);
    const userRes = await usersApi.getLoggedInUser();
    if (!userRes.ok) {
      console.log("Error", userRes);
      setError("You are not allowed to login");
      setLoading(false);
      // console.log(userRes.data.msg)
      return;
    }
    socket.emit("online", userRes.data.user._id);
    setUser(userRes.data.user);
    setLoading(false);
  };

  const signIn = async () => {
    await GoogleSignin.configure({
      androidClientId:
        "320113619885-r1botebnmi0rpu76q2ktjbt89niha3ht.apps.googleusercontent.com",
    });
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User', userInfo.user)
      const password = userInfo.user.id + Date.now();
      const res = await authApi.saveGoogleUser(
        userInfo.user.name,
        userInfo.user.email,
        password
      );
      authStorage.storeToken(res.data.token);
      // if (!res.ok) {
      //   setLoading(false);
      //   alert(res.data?.msg);
      //   console.log('response not ok', res);
      //   return;
      // }
      if (title === "Login") {
        const userRes = await usersApi.getLoggedInUser();
        console.log('User response msg', userRes.data.msg)
        
        if(userRes.ok) {
          console.log('User response', userRes.data)
          setUser(userRes.data.user);
          setLoading(false);

          navigation.navigate("AddDoctor", {
            msg: "Registration  Successfull. Please wait for admin approval",
          });
        } else {
          alert(userRes.data.msg);
          setLoading(false);
        }
      } else {
        authStorage.storeToken(res.data.token);
        setLoading(false);
        alert("Please add doctor Details! Don't Press back button");
        navigation.navigate("AddDoctor", {
          msg: "Registration  Successfull. Please wait for admin approval",
        });
        // alert()
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("e 1");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("e 2");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("e 3");
      } else {
        console.log("Eror", error);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingIndicator visible={loading} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ marginVertical: 30, marginHorizontal: 30 }}>
          <TouchableOpacity onPress={signIn}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#F6F6F6", "#FFFFFF"]}
              style={{
                borderRadius: 75,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                alignSelf: "center",
                padding: 10,
                width: 320,
                height: 60,
                marginBottom: 20,
                elevation: 10,
              }}
            >
              <Image
                source={require("../components/assets/images/google.png")}
              />
            </LinearGradient>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                marginLeft: "17%",
                flex: 1,
                height: 1,
                backgroundColor: "#47687F",
              }}
            />
            <View>
              <Text style={styles.text1}>OR</Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "#47687F",
                marginRight: "17%",
              }}
            />
          </View>
          {error && <ErrorMessage error={error} visible={!loading} />}
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <>
                <AppFormField
                  icon="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  name="email"
                  label="Username"
                />

                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="lock"
                  name="password"
                  secureTextEntry
                  label="Password"
                />

                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <AppText
                    style={{
                      textAlign: "center",
                      fontSize: 14,
                      color: "#47687F",
                      fontWeight: "700",
                    }}
                  >
                    Forgot Password?
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ alignSelf: "center", paddingTop: 5 }}
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={{ fontSize: 14, fontWeight: "700" }}>
                    <Text style={{ color: "#47687F" }}>New to the app?</Text>{" "}
                    <Text style={{ color: "#3FBDE3" }}>Sign Up</Text>
                  </Text>
                </TouchableOpacity>
                <View style={{ top: 0 }}>
                  <SubmitButton title="Login" />
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 0,
    backgroundColor: "#FFFFFF",
    // justifyContent: "center",
  },
  text1: {
    color: "#47687F",
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
    paddingRight: "5%",
    paddingLeft: "5%",
  },
});

export default LoginScreen;
