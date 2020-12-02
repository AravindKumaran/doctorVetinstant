import React, { useContext } from "react";

import { StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AuthContext from "../context/authContext";
import authStorage from "../components/utils/authStorage";

const AccountScrren = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setUser();
    authStorage.removeToken();
    // navigation.navigate("Welcome");
  };

  return (
    <View style={styles.container}>
      <AppText>{user ? user.emailID || user.email : ""}</AppText>
      <AppButton title='Logout' onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});

export default AccountScrren;
