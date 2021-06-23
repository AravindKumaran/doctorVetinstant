import React from "react";
import { StyleSheet, View, Text, Image, ImageBackground } from "react-native";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

const WelcomeScreen = ({ navigation }) => {
  return (
    // <>
    //   <View style={styles.container}>
    //     <ImageBackground
    //       source={require("../components/assets/images/welcomescreenbg.png")}
    //       style={{ width: "100%", height: "105%" }}
    //     >
    //       <View style={styles.container1}>
    //         <Text style={[styles.text1, { top: 20 }]}>Manage </Text>
    //         <Text style={[styles.text1, { color: "#47687F", top: 10 }]}>
    //           your clients at ease.
    //         </Text>
    //         <AppButton
    //           title="Login"
    //           onPress={() => navigation.navigate("Login")}
    //         />
    //         <AppButton
    //           title="Register"
    //           onPress={() => navigation.navigate("Register")}
    //         />
    //       </View>
    //       <View style={{ flex: 1, justifyContent: "flex-end" }}>
    //         <Image
    //           source={require("../components/assets/images/petimage.png")}
    //         />
    //       </View>
    //     </ImageBackground>
    //   </View>
    // </>
    <ImageBackground
      source={require("../components/assets/images/welcomescreenbg.png")}
      style={{ width: "100%", height: "100%" }}
      resizeMode="stretch"
    >
      <View style={styles.container}>
        <View style={styles.container1}>
          <Text style={[styles.text1, { top: 0 }]}>Manage </Text>
          <Text style={[styles.text1, { color: "#47687F", top: 0 }]}>
            your clients at ease.
          </Text>
          <AppButton
            title="Login"
            onPress={() => navigation.navigate("Login")}
          />
          <AppButton
            title="Register"
            onPress={() => navigation.navigate("Register")}
          />
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Image source={require("../components/assets/images/petimage.png")} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 25,
    top: 160,
  },
  text1: {
    color: "#3FBDE3",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "nunito.regular",
  },
  text2: {
    color: "#47687F",
    fontSize: 31,
    fontWeight: "800",
    fontFamily: "nunito.regular",
  },
});

export default WelcomeScreen;

{
  /* <Image
            source={require("../components/assets/images/welcomehand.png")}
            style={{
              top: 0,
              backgroundColor: "#C4C4C4",
              borderRadius: 250,
              height: 300,
              width: 300,
            }}
          /> */
}
