import React from "react";

import { StyleSheet, View, Text, Button } from "react-native";

const AuthScreen = ({ route }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>VetInstant</Text>
        <Text style={styles.title}>{route.params.title}</Text>
      </View>

      <View style={styles.btnWrapper}>
        <Button
          style={styles.button}
          title='Continue With EmailID'
          //   onPress={() => navigation.navigate("Auth", { title: "Login" })}
        />
      </View>

      <View style={styles.btnWrapper}>
        <Button
          style={styles.button}
          title='Continue With Google'
          //   onPress={() => navigation.navigate("Auth", { title: "Login" })}
        />
      </View>

      <View style={styles.btnWrapper}>
        <Button
          style={styles.button}
          title={route.params.title}
          //   onPress={() => navigation.navigate("Auth", { title: "Login" })}
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
    fontSize: 25,
  },
  title: {
    fontSize: 22,
    alignSelf: "center",
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

export default AuthScreen;
