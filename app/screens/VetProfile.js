import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Formik } from "formik";
import AppButton from "../components/AppButton";

const VetProfile = ({ navigation, route }) => {
  const [active, setActive] = useState("Profile");

  const handleActive = (value) => {
    setActive(value);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Formik
        initialValues={{
          reminder: "",
        }}
      >
        <>
          <View style={{ marginVertical: 20, marginBottom: 80 }}>
            <Image
              style={{
                height: 130,
                width: 130,
                alignSelf: "center",
                borderRadius: 100,
                borderWidth: 10,
                borderColor: "#FFFFFF",
                elevation: 10,
              }}
              source={require("../components/assets/images/doctor1.png")}
            />
            <Text style={{ textAlign: "center" }}>
              <Text style={styles.text2}>Dr. Raj Kumar </Text>{" "}
              <Text
                style={[
                  styles.text2,
                  { color: "#47687F", fontSize: 18, fontWeight: "400" },
                ]}
              >
                M.B.B.S., M.D.
              </Text>
            </Text>
            <TouchableOpacity
              style={{
                height: 40,
                width: "80%",
                borderWidth: 1,
                borderColor: "#4AC4F1",
                borderRadius: 30,
                justifyContent: "center",
                alignSelf: "center",
                marginVertical: 20,
              }}
              onPress={() => {
                navigation.navigate("EditVetProfile");
              }}
            >
              <Text
                style={{
                  color: "#47687F",
                  fontSize: 12,
                  fontWeight: "700",
                  alignSelf: "center",
                }}
              >
                Edit your profile
              </Text>
            </TouchableOpacity>
            <View>
              <View style={styles.box}>
                <Text style={styles.text3}>Hospital</Text>
                <Text style={styles.text4}>PetCare Chennai Clinic</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text3}>Vet Contact</Text>
                <Text style={styles.text4}>+91 1234567890</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text3}>Hospital Contact</Text>
                <Text style={styles.text4}>+91 1234567890</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text3}>Tele-Consultation fee</Text>
                <Text style={styles.text4}>₹ 450/-</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text3}>Physical visit fee</Text>
                <Text style={styles.text4}>₹ 150/-</Text>
              </View>
            </View>
            <View>
              <AppButton
                title="MedicalHistoryPets"
                onPress={() => navigation.navigate("MedicalHistoryPets")}
              />
              <AppButton
                title="Notification"
                onPress={() => navigation.navigate("Notification")}
              />
              <AppButton
                title="ChatNotification"
                onPress={() => navigation.navigate("ChatNotification")}
              />
              <AppButton
                title="MenuScreen"
                onPress={() => navigation.navigate("MenuScreen")}
              />
              <AppButton
                title="WalletScreen"
                onPress={() => navigation.navigate("WalletScreen")}
              />
              <AppButton
                title="Prescription"
                onPress={() => navigation.navigate("Prescriptionnnnn")}
              />
              {/* <AppButton
                title="PetMedication"
                onPress={() => navigation.navigate("PetMedication")}
              /> */}
              <AppButton
                title="ProfileSetup"
                onPress={() => navigation.navigate("ProfileSetup")}
              />
            </View>
          </View>
        </>
      </Formik>
    </ScrollView>
  );
};

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
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
    paddingHorizontal: 20,
  },
  text2: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 24,
    color: "#4AC4F1",
    marginBottom: 20,
  },
  text3: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 16,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
  text4: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 14,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
  box: {
    height: 50,
    borderRadius: 30,
    marginVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    elevation: 10,
    backgroundColor: "#FFFFFF",
    margin: 20,
  },
});

export default VetProfile;
