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
import petsApi from "../api/pets";

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

const MedicalHistory = ({ petId }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    try {
      const changePetAndProblem = async () => {
        setLoading(true);
        const pres = await petsApi.getSinglePet(petId);
        if (!pres.ok) {
          console.log("Error", pres);
          setLoading(false);
          return;
        }
        console.log("prescriptions", pres.data.exPet.prescriptions);
        setPrescriptions(pres.data.exPet.prescriptions);
      };
      changePetAndProblem();
    } catch (error) {
      console.log("err", error);
    }
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container1}>
        <Formik
          initialValues={{
            pet: "",
          }}
        >
          <ChoosePicker
            items={type}
            label="Problem type"
            name="type"
            placeholder="Problem type"
          />
        </Formik>
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            alignSelf: "center",
            marginVertical: 10,
            marginRight: 10,
          }}
        >
          <Searchbar />
          <TouchableOpacity>
            <Feather
              name={"plus"}
              size={40}
              color={"#4AC4F1"}
              style={{
                alignSelf: "center",
                borderRadius: 50,
                elevation: 10,
                backgroundColor: "#FFFFFF",
              }}
            />
          </TouchableOpacity>
        </View>
        {prescriptions &&
          prescriptions.map((pres, i) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 105,
                width: "95%",
                alignSelf: "center",
                borderRadius: 20,
                padding: 10,
                elevation: 10,
                backgroundColor: "#FFFFFF",
                marginBottom: 10,
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
                  {new Date(pres.date).toLocaleDateString("default", {
                    month: "short",
                  })}
                </Text>
              </View>
              <View style={{ marginRight: 150, marginHorizontal: 20 }}>
                <Text
                  style={{ color: "#47687F", fontSize: 14, fontWeight: "700" }}
                >
                  {pres.prescription} problem
                </Text>
                <Text
                  style={{
                    color: "#B9C4CF",
                    fontSize: 12,
                    fontWeight: "400",
                    marginVertical: 5,
                  }}
                >
                  Treated by Dr.{pres.docname} at Global Veteneriary Hospitals
                </Text>
              </View>
              <View style={{ right: 120 }}>
                <TouchableOpacity
                  // onPress={() => navigation.navigate("MedicalHistoryPets")}
                  // onPress={() => navigation.navigate("Notification")}
                  // onPress={() => navigation.navigate("ChatNotification")}
                  // onPress={() => navigation.navigate("MenuScreen")}
                  // onPress={() => navigation.navigate("WalletScreen")}
                  // onPress={() => navigation.navigate("Prescriptionnnnn")}
                  // onPress={() => navigation.navigate("PetMedication")}
                  onPress={() => navigation.navigate("ProfileSetup")}
                >
                  <Text
                    style={{
                      color: "#4AC4F1",
                      fontWeight: "700",
                      fontSize: 14,
                    }}
                  >
                    VIEW
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

export default MedicalHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    marginVertical: 30,
    marginHorizontal: 10,
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
