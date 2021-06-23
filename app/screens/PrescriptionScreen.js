import React, { useState, useContext, useEffect } from "react";
import { ScrollView, StyleSheet, View, BackHandler, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import AppText from "../components/AppText";
import AuthContext from "../context/authContext";
import LoadingIndicator from "../components/LoadingIndicator";
import AppSelect from "../components/forms/AppSelect";
import SubmitButton from "../components/SubmitButton";
import AppFormField from "../components/AppFormField";
import AppImagePicker from "../components/forms/AppImagePicker";

import roomsApi from "../api/room";
import petsApi from "../api/pets";

const validationSchema = Yup.object().shape({
  patientName: Yup.string()
    .required("Please select a patient")
    .nullable()
    .label("Patient Name"),
  prescription: Yup.string().max(100).required().label("Prescription"),
  photo: Yup.string().nullable(),
});

const PrescriptionScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "YES",
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            }),
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const getPatients = async () => {
      setLoading(true);
      const res = await roomsApi.getReceiverRoom(user._id);
      if (!res.ok) {
        setLoading(false);
        console.log(res);
        return;
      }

      let pateintss = res.data.room;
      let newPatients = pateintss.reduce((acc, item) => {
        acc.push({
          label:
            item.senderName.charAt(0).toUpperCase() + item.senderName.slice(1),
          value: item.petId,
        });
        return acc;
      }, []);

      setPatients(newPatients);
      setLoading(false);
    };
    getPatients();
  }, []);

  const handleSubmit = async (values) => {
    const form = new FormData();
    if (values.photo) {
      form.append("photo", {
        name: "photo",
        type: "image/jpeg",
        uri: values.photo,
      });
    }

    form.append("prescription", values.prescription);
    form.append("docname", user.name);
    setLoading(true);
    const petRes = await petsApi.sendPetPrescription(form, values.patientName);
    if (!petRes.ok) {
      setLoading(false);
      console.log("Error", petRes);
      return;
    }
    // console.log(petRes)
    alert("Prescription Send Successfully!");
    setLoading(false);
    navigation.navigate("Home");
  };

  return (
    <>
      <LoadingIndicator visible={loading} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.container1}>
          <AppText
            style={{ textAlign: "center", fontSize: 20, marginVertical: 30 }}
          >
            Please Provide Your Prescription
          </AppText>
          <Formik
            initialValues={{
              patientName: "",
              prescription: "",
              photo: null,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <>
                <AppSelect
                  items={patients}
                  label="Select Patient Name"
                  name="patientName"
                />
                <AppFormField
                  label="Doctor Comments"
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="prescription"
                  numberOfLines={3}
                  placeholder="Enter Your Comments"
                />

                <AppText style={{ marginVertical: 20 }}>
                  Select Image(optional)
                </AppText>

                <AppImagePicker name="photo" />

                <SubmitButton title="Send" />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
});

export default PrescriptionScreen;
