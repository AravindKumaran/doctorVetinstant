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
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import ChoosePicker from "../components/forms/ChoosePicker";
import { Formik } from "formik";
import Searchbar from "../components/searchbar";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const type = [
  { label: "Via VetInstant", value: "Via VetInstant" },
  { label: "Vaccinations", value: "Vaccinations" },
  { label: "General Checkup", value: "General Checkup" },
];

const doctors = [
  {
    src: require("../components/assets/images/pet.png"),
    name: "Bruno",
    message: "Hey Doc, I’ve joined the room and we are...",
    time: "42s ago",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Bruno",
    message: "Hey Doc, I’ve joined the room and we are...",
    time: "13min ago",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Bruno",
    message: "Hey Doc, I’ve joined the room and we are...",
    time: "1w ago",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Bruno",
    message: "Hey Doc, I’ve joined the room and we are...",
    time: "2w ago",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Bruno",
    message: "Hey Doc, I’ve joined the room and we are...",
    time: "3w ago",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Bruno",
    message: "Hey Doc, I’ve joined the room and we are...",
    time: "1m ago",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Bruno",
    message: "Hey Doc, I’ve joined the room and we are...",
    time: "2m ago",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Bruno",
    message: "Hey Doc, I’ve joined the room and we are...",
    time: "3m ago",
  },
];

const ChatNotification = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container1}>
        <View style={{ margin: 10, marginBottom: 50 }}>
          {doctors.map((c, i) => (
            <>
              <View key={`${c.name}-${i}`} style={styles.catItem}>
                <View
                  style={{
                    elevation: 10,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 50,
                  }}
                >
                  <Image source={c.src} style={styles.image1} />
                </View>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.text1}>{c.name}</Text>
                  <Text style={styles.text2}>{c.message}</Text>
                </View>
                <View style={{ flex: 1, alignContent: "flex-end" }}>
                  <Text style={styles.text3}>{c.time}</Text>
                </View>
              </View>
              <View
                style={{
                  borderWidth: 0.75,
                  borderColor: "#EDEDED",
                  marginVertical: 10,
                }}
              />
            </>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ChatNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    marginHorizontal: 10,
  },
  catItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  image1: {
    height: 45,
    width: 45,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    elevation: 10,
    backgroundColor: "#FFFFFF",
  },
  text1: {
    color: "#47687F",
    fontWeight: "700",
    fontFamily: "Proxima Nova",
    paddingLeft: 10,
    fontSize: 12,
  },
  text2: {
    color: "#47687F",
    fontWeight: "400",
    fontFamily: "Proxima Nova",
    paddingLeft: 10,
    fontSize: 12,
  },
  text3: {
    color: "#D1D1D1",
    fontWeight: "700",
    fontFamily: "Proxima Nova",
    paddingLeft: 10,
    fontSize: 12,
  },
});
