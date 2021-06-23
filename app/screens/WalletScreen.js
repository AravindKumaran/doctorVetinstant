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
import LinearGradient from "react-native-linear-gradient";

const WalletScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container1}>
        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={styles.text1}>Yay! You’ve earned</Text>
            <Text style={[styles.text1, { color: "#45C4E6", fontSize: 45 }]}>
              ₹ 24,458
            </Text>
            <Text style={styles.text2}>through VetInstant</Text>
          </View>

          <View>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#FB6868", "#FFB4B4"]}
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 200,
                width: "100%",
                alignSelf: "center",
                marginVertical: 20,
                borderRadius: 20,
                elevation: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <Text style={[styles.text5, { fontSize: 9 }]}>CARD NUMBER</Text>
                <Text style={[styles.text5, { fontSize: 14 }]}>
                  **** **** **** 7586
                </Text>
                <Text style={[styles.text5, { fontSize: 9 }]}>NAME</Text>
                <Text style={[styles.text5, { fontSize: 14 }]}>
                  MARK ANDERSON L
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  margin: 20,
                  alignItems: "flex-end",
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={[
                    styles.text4,
                    { fontSize: 30, color: "#FFFFFF", fontWeight: "900" },
                  ]}
                >
                  VISA
                </Text>
              </View>
            </LinearGradient>
          </View>

          <Text style={styles.text2}>Add new account</Text>
          <TouchableOpacity
            style={{
              height: 50,
              width: 50,
              borderRadius: 50,
              elevation: 10,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
            }}
          >
            <Feather
              name={"plus"}
              size={25}
              color={"#4AC4F1"}
              style={{
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              borderWidth: 0.75,
              borderColor: "#EDEDED",
              marginVertical: 10,
              marginTop: 20,
              width: "100%",
            }}
          />
          <Text style={styles.text2}>Transactions</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 125,
            width: "100%",
            alignSelf: "center",
            marginVertical: 20,
            borderRadius: 20,
            elevation: 10,
            backgroundColor: "#FFFFFF",
          }}
        >
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <Text style={[styles.text3, { fontSize: 16 }]}>
              Transaction from Bruno
            </Text>
            <Text style={[styles.text3, { fontWeight: "400" }]}>
              Transaction ID : 214578451574
            </Text>
            <Text style={[styles.text3, { fontWeight: "400" }]}>
              Date and time : 11-06-2021 04:30 PM
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={[styles.text4, { fontSize: 24, color: "#45C4E6" }]}>
              ₹ 550
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    margin: 15,
    marginBottom: 50,
  },
  text1: {
    color: "#47687F",
    fontSize: 14,
    fontWeight: "700",
  },
  text2: {
    color: "#47687F",
    fontSize: 14,
    fontWeight: "700",
    marginVertical: 10,
  },
  text3: {
    color: "#47687F",
    fontSize: 12,
    fontWeight: "700",
    marginVertical: 5,
    marginLeft: 10,
  },
  text4: {
    color: "#47687F",
    fontSize: 12,
    fontWeight: "400",
    marginRight: 10,
  },
  text5: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    marginVertical: 5,
    marginLeft: 10,
  },
});
