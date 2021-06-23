import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AppText from "../components/AppText";
import Feather from "react-native-vector-icons/Feather";
import { Formik } from "formik";
import AppFormField from "../components/AppFormField";
import DateTimePicker from "@react-native-community/datetimepicker";
import RadioForm from "react-native-simple-radio-button";
import AppButton from "../components/AppButton";

const pet = [
  { label: "Bruno", value: "Bruno" },
  { label: "Kit", value: "Kit" },
  { label: "Drogon", value: "Drogon" },
];

const time = [
  { value: "Morning" },
  { value: "Afternoon" },
  { value: "Evening" },
];

// const time = [
//   { label: "Morning", value: "Morning" },
//   { label: "Afternoon", value: "Afternoon" },
//   { label: "Evening", value: "Evening" },
// ];

const PetMedication = () => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [isSelected, setisSelected] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Formik
        initialValues={{
          pet: "",
        }}
      >
        <>
          <View style={styles.container1}>
            <AppText
              style={{
                alignSelf: "center",
                color: "#47687F",
                size: 14,
                fontWeight: "400",
                marginBottom: 20,
              }}
            >
              Add Medication
            </AppText>
            <AppFormField
              label="Medicine name"
              autoCapitalize="none"
              autoCorrect={false}
              name="Medicine name"
              // placeholder="Medicine name"
            />
            <AppFormField
              label="Doze"
              autoCapitalize="none"
              autoCorrect={false}
              name="Doze"
              // placeholder="Doze"
            />

            <View
              style={{
                top: 0,
                width: "80%",
                alignSelf: "center",
                flexDirection: "row",
                justifyContent: "center",
                paddingTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={showDatepicker}
                style={{
                  marginHorizontal: 20,
                  borderColor: "rgba(21, 56, 95, 0.3)",
                  borderWidth: 1,
                  marginBottom: 18,
                  borderRadius: 40,
                  height: 60,
                  width: 125,
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <AppText
                  style={{
                    color: "#47687F",
                    fontSize: 14,
                    alignSelf: "center",
                  }}
                >
                  From
                </AppText>
                <Text
                  style={{
                    color: "rgba(21, 56, 95, 0.3)",
                    fontSize: 16,
                    padding: 2,
                    alignSelf: "center",
                    fontWeight: "700",
                  }}
                >
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={"date"}
                  onChange={onChange}
                  neutralButtonLabel="clear"
                  placeholder="From"
                />
              )}
              <TouchableOpacity
                onPress={showDatepicker}
                style={{
                  marginHorizontal: 20,
                  borderColor: "rgba(21, 56, 95, 0.3)",
                  borderWidth: 1,
                  marginBottom: 18,
                  borderRadius: 40,
                  height: 60,
                  width: 125,
                  justifyContent: "center",
                }}
              >
                <AppText
                  style={{
                    color: "#47687F",
                    fontSize: 14,
                    alignSelf: "center",
                  }}
                >
                  To
                </AppText>
                <Text
                  style={{
                    color: "rgba(21, 56, 95, 0.3)",
                    fontSize: 16,
                    padding: 2,
                    alignSelf: "center",
                    fontWeight: "700",
                  }}
                >
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={"date"}
                  onChange={onChange}
                  neutralButtonLabel="clear"
                  placeholder="To"
                />
              )}
            </View>
            <AppText
              style={{
                color: "#47687F",
                size: 14,
                fontWeight: "400",
              }}
            >
              Duration
            </AppText>
            <View
              style={{
                alignSelf: "center",
                flexDirection: "row",
                paddingTop: 10,
                marginHorizontal: 20,
              }}
            >
              <Feather
                name={"sun"}
                size={20}
                color={"#B9C4CF"}
                style={{ right: 20 }}
              />
              <Feather
                name={"plus-circle"}
                size={20}
                color={"#B9C4CF"}
                style={{}}
              />
              <Feather
                name={"moon"}
                size={20}
                color={"#B9C4CF"}
                style={{ left: 20 }}
              />
            </View>
            <View
              style={{
                alignItems: "center",
                alignSelf: "center",
                alignContent: "center",
                paddingLeft: 10,
                marginTop: 20,
              }}
            >
              <RadioForm
                radio_props={time}
                initial={null}
                formHorizontal={true}
                labelHorizontal={true}
                labelColor={"white"}
                animation={true}
                onPress={setisSelected}
                buttonColor={"#B9C4CF"}
                selectedButtonColor={"#41BFE2"}
                buttonStyle={{ margin: 20 }}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <AppFormField
                label="Duration"
                autoCapitalize="none"
                autoCorrect={false}
                name="Duration"
                // placeholder="Duration"
              />
            </View>
          </View>
        </>
      </Formik>
      <View style={{ margin: 25, marginBottom: 50 }}>
        <AppButton title="Add Medication" />
      </View>
    </ScrollView>
  );
};
export default PetMedication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container1: {
    marginHorizontal: 20,
    marginTop: 20,
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
