import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AppTextInput = ({ icon, ...rest }) => {
  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color='#6e6969'
          style={styles.icon}
        />
      )}
      <TextInput style={styles.textInput} numberOfLines={1} {...rest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    marginVertical: 10,
    overflow: "hidden",
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    fontSize: 18,
    color: "#0c0c0c",
    padding: 3,
  },
});

export default AppTextInput;
