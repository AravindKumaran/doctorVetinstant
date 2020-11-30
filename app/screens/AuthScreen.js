import React from "react";
import { StyleSheet, View, Text } from "react-native";

import AppButton from "../components/AppButton";

const AuthScreen = ({ route, navigation }) => {
  const { title } = route.params;

  const handlePress = () => {
    navigation.navigate(`${title}`);
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>VetInstant</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <AppButton title='Continue with Email ID' onPress={handlePress} />

      <AppButton title='Continue with Google' onPress={handlePress} />
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
