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
import RNHTMLtoPDF from "react-native-html-to-pdf";
import petsApi from "../api/pets";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const Prescription = ({ navigation, route }) => {
  const [todayReminders, setTodayReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [medication, setMedication] = useState([]);
  const [loading, setLoading] = useState(false);
  const [petDetails, setPetDetails] = useState({});
  const [petAge, setPetAge] = useState(null);
  const [diagnosis, onChangeDiagnosis] = useState("");
  const [prescription, onChangePrescription] = useState("");
  const [advice, onChangeAdvice] = useState("");
  const refRBSheet = useRef();
  const { details } = route.params;

  const petDetail = async () => {
    setLoading(true);
    const res = await petsApi.getSinglePet(details?.petId);
    if (!res.ok) {
      setLoading(false);
      console.log(res);
      return;
    }

    console.log("ResPEt", res.data.exPet);
    setPetDetails(res.data.exPet);

    let year = res?.data?.exPet?.dob.substr(0, 4);
    let month = res?.data?.exPet?.dob.substr(5, 2) - 1;
    let day = res?.data?.exPet?.dob.substr(8, 2);
    let today = new Date();
    let age = today.getFullYear() - year;
    if (
      today.getMonth() < month ||
      (today.getMonth() == month && today.getDate() < day)
    ) {
      age--;
    }
    setPetAge(age);

    setLoading(false);
  };
  useEffect(() => {
    petDetail();
    console.log("age", petAge);
  }, []);

  // const [pdfUri, setPdfUri] = useState("");

  const pdfstylings = {
    display: "inline",
    padding: "0px 20px",
  };

  const createPDF = async () => {
    const generateHTML = (petDetails, petAge, pdfstylings) =>
      `<div>
      <h1>Diagnosis :${diagnosis} </h1>
      
          <h2>Pet Name : ${petDetails.name}</h2>
          <h2>Breed: ${petDetails.breed}</h2>
          <h2>Gender: ${petDetails.gender}</h2>
          <h2>Age : ${petAge}</h2>
       <table style="width:100%;text-align:center; border-collapse: separate;
       border-spacing: 0 0.6em;">
          <tr>
            <th style="width:10%;border: 1px solid black;">Sr.No.</th>
            <th style="border: 1px solid black;">Medicine</th>
            <th style="border: 1px solid black;">Dose</th>
            <th style="border: 1px solid black;">timing-Duration</th>
          </tr>
      ${medication.map(
        (med, index) =>
          `   <tr >
               <td style="border: 1px solid black;">${index}</td>
              <td style="border: 1px solid black;">${med.medicine_Name}</td>
              <td style="border: 1px solid black;">${med.doze}</td>
              <td style="border: 1px solid black;">
              ${med.isSelected}- ${med.duration}
              </td>
          </tr>`
      )}
          </tr>
        </table>
      <br />
    <h3>Advice</h3>
    <p>${advice}</p>
    <br />
     <h2>Diagnostic prescription :</h2>
      <p>${prescription}</p>
    </div>`;

    const html = generateHTML(petDetails, petAge, pdfstylings);
    let options = {
      html,
      fileName: diagnosis.substr(0, 10),
      directory: "Documents",
    };
    let file = await RNHTMLtoPDF.convert(options);
    // console.log(file.filePath);

    console.log("file", file.filePath);
    navigation.navigate("PrescriptionPreview", {
      pdfUri: file.filePath,
      prescription: prescription,
      details: details,
    });
  };

  // const getReminders = async () => {
  //   const data = await getAllKeys();
  //   // console.log(data)

  //   if (data.length > 0) {
  //     data.forEach(async (dateTime) => {
  //       console.log("Dateime", dateTime);
  //       const date = dateTime.split("-")[0];
  //       if (date === new Date().toLocaleDateString()) {
  //         const rmr = await getObjectData(dateTime);
  //         todayReminders.push(rmr);
  //       } else {
  //         const rmr = await getObjectData(dateTime);
  //         upcomingReminders.push(rmr);
  //       }

  //       setTodayReminders([...Array.from(new Set(todayReminders))]);
  //       setUpcomingReminders([...new Set(upcomingReminders)]);
  //     });
  //   }
  // };

  const onClose = (data) => {
    setMedication([...medication, data]);
  };

  // useEffect(() => {
  //   getReminders();
  // }, []);

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
              <TextInput
                style={styles.textinput1}
                numberOfLines={4}
                onChangeText={onChangeDiagnosis}
                value={diagnosis}
              />
            </View>
            <View style={{ margin: 20 }}>
              <Text style={styles.text5}>Medications</Text>
            </View>
            {medication.length !== 0 &&
              medication.map((med) => (
                <View>
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
                        {med.duration}
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
                        <View
                          style={{ flexDirection: "column", marginLeft: 15 }}
                        >
                          <Text
                            style={{
                              color: "#47687F",
                              fontSize: 14,
                              fontWeightL: "400",
                            }}
                          >
                            {med.medicine_Name}
                          </Text>
                          <Text
                            style={{
                              color: "#B9C4CF",
                              fontSize: 11,
                              fontWeightL: "400",
                            }}
                          >
                            {med.isSelected}
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
                          {med.doze}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* <View
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
                </View> */}
                </View>
              ))}
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
            <PetMedication onclose={onClose} />
          </RBSheet>
          <Text style={styles.text1}>Add Medication</Text>
          <Text style={styles.text5}>Diagnostic prescription</Text>
          <TextInput
            style={styles.textinput1}
            numberOfLines={4}
            value={prescription}
            onChangeText={onChangePrescription}
          />
          <Text style={styles.text5}>Advice/Remarks</Text>
          <TextInput
            style={styles.textinput1}
            numberOfLines={4}
            value={advice}
            onChangeText={onChangeAdvice}
          />
        </View>
        <View style={{ margin: 25 }}>
          <AppButton
            title="Generate Prescription"
            onPress={() => createPDF()}
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
