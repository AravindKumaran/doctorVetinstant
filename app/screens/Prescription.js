import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Feather from "react-native-vector-icons/Feather";
import * as Notifications from "expo-notifications";
import {
  getObjectData,
  getAllKeys,
  clearAll,
  removeValue,
} from "../components/utils/reminderStorage";
import ChoosePicker from "../components/forms/ChoosePicker";
import { Formik } from "formik";
import RBSheet from "react-native-raw-bottom-sheet";
import PetMedication from "./PetMedication";
import ToggleSwitch from "toggle-switch-react-native";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const Prescription = ({ navigation }) => {
  const [todayReminders, setTodayReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const refRBSheet = useRef();

  const getReminders = async () => {
    const data = await getAllKeys();
    // console.log(data)

    if (data.length > 0) {
      data.forEach(async (dateTime) => {
        console.log("Dateime", dateTime);
        const date = dateTime.split("-")[0];
        if (date === new Date().toLocaleDateString()) {
          const rmr = await getObjectData(dateTime);
          todayReminders.push(rmr);
        } else {
          const rmr = await getObjectData(dateTime);
          upcomingReminders.push(rmr);
        }

        setTodayReminders([...Array.from(new Set(todayReminders))]);
        setUpcomingReminders([...new Set(upcomingReminders)]);
      });
    }
  };

  useEffect(() => {
    getReminders();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.container1}>
        <View>
          <View>
            <View style={{ margin: 20 }}>
              <ToggleSwitch
                isOn={true}
                onColor="#4DD1EF"
                offColor="#47687F"
                label="Include digital signature"
                labelStyle={styles.text5}
                onToggle={(isOn) => console.log("changed to : ", isOn)}
              />
              <View
                style={{
                  borderWidth: 0.75,
                  borderColor: "#DCE1E7",
                  marginVertical: 10,
                }}
              />
              <Text style={styles.text5}>Doctor Notes/Diagnosis</Text>
              <TextInput style={styles.textinput1} numberOfLines={4} />
            </View>
            <View style={{ margin: 20 }}>
              <Text style={styles.text5}>Medications</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#41BFE2",
                    borderRadius: 50,
                    height: 25,
                    width: 25,
                    justifyContent: "center",
                    elevation: 10,
                    borderWidth: 5,
                    borderColor: "#FFFFFF",
                    alignSelf: "center",
                    margin: 5,
                  }}
                />
                <Text
                  style={{
                    color: "#47687F",
                    fontSize: 14,
                    fontWeightL: "400",
                    alignSelf: "center",
                  }}
                >
                  10:00 am
                </Text>
              </View>
              <View
                style={{
                  borderColor: "#FFFFFF",
                  borderWidth: 1,
                  marginBottom: 18,
                  borderRadius: 20,
                  height: 70,
                  width: 250,
                  alignSelf: "center",
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                  margin: 10,
                  elevation: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flexDirection: "column", marginLeft: 15 }}>
                    <Text
                      style={{
                        color: "#47687F",
                        fontSize: 14,
                        fontWeightL: "400",
                      }}
                    >
                      Intas Eazypet
                    </Text>
                    <Text
                      style={{
                        color: "#B9C4CF",
                        fontSize: 11,
                        fontWeightL: "400",
                      }}
                    >
                      After Breakfast
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "#41BFE2",
                      fontSize: 18,
                      fontWeight: "700",
                      flex: 1,
                      textAlign: "right",
                      marginRight: 15,
                    }}
                  >
                    1 No.
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#41BFE2",
                    borderRadius: 50,
                    height: 25,
                    width: 25,
                    justifyContent: "center",
                    elevation: 10,
                    borderWidth: 5,
                    borderColor: "#FFFFFF",
                    alignSelf: "center",
                    margin: 5,
                  }}
                />
                <Text
                  style={{
                    color: "#47687F",
                    fontSize: 14,
                    fontWeightL: "400",
                    alignSelf: "center",
                  }}
                >
                  09:30 pm
                </Text>
              </View>
              <View
                style={{
                  borderColor: "#FFFFFF",
                  borderWidth: 1,
                  marginBottom: 18,
                  borderRadius: 20,
                  height: 70,
                  width: 250,
                  alignSelf: "center",
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                  margin: 10,
                  elevation: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flexDirection: "column", marginLeft: 15 }}>
                    <Text
                      style={{
                        color: "#47687F",
                        fontSize: 14,
                        fontWeightL: "400",
                      }}
                    >
                      Himalaya Digyton Drop
                    </Text>
                    <Text
                      style={{
                        color: "#B9C4CF",
                        fontSize: 11,
                        fontWeightL: "400",
                      }}
                    >
                      After Breakfast
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "#41BFE2",
                      fontSize: 18,
                      fontWeight: "700",
                      flex: 1,
                      textAlign: "right",
                      marginRight: 15,
                    }}
                  >
                    10ml
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={{ margin: 20 }}>
          <TouchableOpacity
            style={{
              margin: 10,
              height: 50,
              width: 50,
              borderRadius: 50,
              elevation: 10,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignSelf: "center",
            }}
            onPress={() => refRBSheet.current.open()}
          >
            <Feather
              name={"plus"}
              size={25}
              color={"#41BFE2"}
              style={{
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
          <RBSheet
            ref={refRBSheet}
            animationType="fade"
            customStyles={{
              wrapper: {
                backgroundColor: "rgba(255, 255, 255, 0.92)",
              },
              draggableIcon: {
                backgroundColor: "#000",
              },
              container: {
                width: "90%",
                height: "80%",
                borderRadius: 25,
                backgroundColor: "#FFFFFF",
                elevation: 10,
                justifyContent: "center",
                alignSelf: "center",
                alignContent: "center",
                alignItems: "center",
                bottom: 50,
              },
            }}
          >
            <PetMedication />
          </RBSheet>
          <Text style={styles.text1}>Add Medication</Text>
          <Text style={styles.text5}>Diagnostic prescription</Text>
          <TextInput style={styles.textinput1} numberOfLines={4} />
          <Text style={styles.text5}>Advice/Remarks</Text>
          <TextInput style={styles.textinput1} numberOfLines={4} />
        </View>
        <View style={{ margin: 25 }}>
          <AppButton
            title="Generate Prescription"
            onPress={() => navigation.navigate("PrescriptionPreview")}
          />
        </View>
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
    marginBottom: 80,
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 10,
  },
  innerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text1: {
    color: "#47687F",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginVertical: 5,
  },
  text5: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 14,
    color: "#47687F",
    marginVertical: 10,
  },
  textinput1: {
    height: 100,
    width: "100%",
    borderColor: "#B9C4CF",
    borderWidth: 1,
    color: "#47687F",
    borderRadius: 15,
    fontSize: 16,
    marginVertical: 10,
  },
});

export default Prescription;