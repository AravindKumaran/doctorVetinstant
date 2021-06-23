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
    name: "Video call from Dr. Kumar has been scheduled at 07:00pm today.",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Your chat with Dr. R. Vijayashanthini has ended.",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Video call from Dr. Kumar has been scheduled at 07:00pm today.",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Your chat with Dr. R. Vijayashanthini has ended.",
  },
];

const Notification = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container1}>
        <View style={{ margin: 10, marginBottom: 20 }}>
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
                <Text style={[styles.catItemText, { marginTop: -10 }]}>
                  {c.name}
                </Text>
                <View style={styles.Rectangle}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("VetProfile");
                    }}
                  >
                    <Text style={styles.text6}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    marginHorizontal: 10,
  },
  choose: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  catItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  catItemText: {
    color: "#47687F",
    fontWeight: "400",
    fontFamily: "Proxima Nova",
    paddingLeft: 10,
    marginRight: 180,
    fontSize: 12,
  },
  Rectangle: {
    width: 80,
    height: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    right: 160,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4AC4F1",
  },
  text6: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#4AC4F1",
  },
  image1: {
    height: 75,
    width: 75,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    elevation: 10,
    backgroundColor: "#FFFFFF",
  },
});
