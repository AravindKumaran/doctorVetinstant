import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const MedicalHistoryPets = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 105,
          width: "95%",
          alignSelf: "center",
          borderRadius: 20,
          padding: 10,
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <View
          style={{
            height: 75,
            width: 75,
            borderRadius: 20,
            backgroundColor: "rgba(81, 215, 244, 0.21)",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
            }}
          >
            15 May
          </Text>
        </View>
        <View style={{ marginRight: 150, marginHorizontal: 20 }}>
          <Text style={{ color: "#47687F", fontSize: 14, fontWeight: "700" }}>
            Digestion problem
          </Text>
          <Text style={{ color: "#B9C4CF", fontSize: 12, fontWeight: "400" }}>
            Treated by Dr. Kumar at Global Veteneriary Hospitals
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 1,
          width: "90%",
          alignSelf: "center",
          marginBottom: 10,
          marginTop: 10,
          borderWidth: 1,
          borderColor: "#DCE1E7",
        }}
      />
      <Text
        style={{
          color: "#47687F",
          fontSize: 14,
          fontWeight: "700",
          margin: 10,
        }}
      >
        Uploads from user
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 105,
          width: "95%",
          alignSelf: "center",
          borderRadius: 20,
          padding: 0,
          elevation: 10,
          backgroundColor: "#FFFFFF",
          marginBottom: 10,
        }}
      >
        <Image
          source={require("../components/assets/images/document.png")}
          style={{ height: 100, width: 100 }}
        />
        <Text style={{ color: "#47687F", marginHorizontal: 15 }}>
          Digestion report.img
        </Text>
        <TouchableOpacity>
          <Feather
            name={"arrow-down-circle"}
            size={20}
            color={"#4AC4F1"}
            style={{ marginHorizontal: 15 }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather
            name={"eye"}
            size={20}
            color={"#4AC4F1"}
            style={{
              marginHorizontal: 10,
            }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MedicalHistoryPets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  choose: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  catItem1: {
    // flexDirection: "column",
    alignSelf: "center",
    marginTop: 30,
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
    paddingHorizontal: 20,
  },
  text2: {
    color: "#FA7C7C",
    fontSize: 14,
    fontWeight: "400",
  },
  text3: {
    color: "#37CF86",
    fontSize: 12,
    fontWeight: "400",
  },
  catItem2: {
    flexDirection: "row",
    alignItems: "flex-end",
    bottom: 20,
    borderRadius: 30,
  },
});
