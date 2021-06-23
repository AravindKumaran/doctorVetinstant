import React from "react";
import { StyleSheet, ScrollView, View, Text, Image } from "react-native";
import AppButton from "../components/AppButton";

const PrescriptionPreview = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.text1}>Preview Prescription</Text>
        <Image source={require("../components/assets/images/document1.png")} />
        <AppButton title="Upload" />
        <AppButton title="Edit" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    alignItems: "center",
    margin: 50,
  },
  text1: {
    color: "#47687F",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 5,
  },
});

export default PrescriptionPreview;
