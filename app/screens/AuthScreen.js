import React, { useContext } from "react";
import * as Google from "expo-google-app-auth";
import { StyleSheet, View, Text } from "react-native";

import AppButton from "../components/AppButton";

import authStorage from "../components/utils/authStorage";
import AuthContext from "../context/authContext";

import authApi from "../api/auth";

const config = {
  // iosClientId: `<YOUR_IOS_CLIENT_ID>`,
  androidClientId:
    "320113619885-drs735a38tcvfq000k0psg7t60c8nfff.apps.googleusercontent.com",
  scopes: ["profile", "email"],
};

const AuthScreen = ({ route, navigation }) => {
  const { title } = route.params;

  const { setUser } = useContext(AuthContext);

  const handlePress = () => {
    navigation.navigate(`${title}`);
  };

  const signInWithGoogle = async () => {
    try {
      const result = await Google.logInAsync(config);
      if (result.type === "success") {
        const password = result.user.email + result.user.id;
        await authApi.saveGoogleUser(result.user.email, password);
        authStorage.storeToken(result.accessToken);
        setUser(result.user);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>VetInstant</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <AppButton title='Continue with Email ID' onPress={handlePress} />

      <AppButton title='Continue with Google' onPress={signInWithGoogle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  text: {
    fontSize: 25,
  },
  title: {
    fontSize: 22,
    alignSelf: "center",
  },
});

export default AuthScreen;
