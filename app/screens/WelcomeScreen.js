import React from "react";

import { Button, StyleSheet, Text, View } from "react-native";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>VetInstant</Text>
      <View style={styles.btnWrapper}>
        <Button
          style={styles.button}
          title='Sign Up'
          onPress={() => navigation.navigate("Auth", { title: "Register" })}
        />
      </View>

      <View style={styles.btnWrapper}>
        <Button
          style={styles.button}
          title='Login'
          onPress={() => navigation.navigate("Auth", { title: "Login" })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 30,
  },
  button: {
    marginVertical: 10,
    backgroundColor: "#fff",
  },

  btnWrapper: {
    marginVertical: 10,
    width: "80%",
  },
});

export default WelcomeScreen;
