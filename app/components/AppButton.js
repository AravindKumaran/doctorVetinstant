import React from "react";

import { StyleSheet, Text, TouchableOpacity } from "react-native";

const AppButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fc5c65",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    marginBottom: 15,
    width: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
