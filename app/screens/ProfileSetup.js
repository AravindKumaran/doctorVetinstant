import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import AppButton from "../components/AppButton";
import FormFilePicker from "../components/forms/FormFilePicker";
import ToggleSwitch from "toggle-switch-react-native";
import Feather from "react-native-vector-icons/Feather";
import RBSheet from "react-native-raw-bottom-sheet";

const ProfileSetup = () => {
  const refRBSheet = useRef();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Formik
        initialValues={{
          reminder: "",
        }}
      >
        <>
          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 20,
              marginBottom: 50,
            }}
          >
            <View style={{ marginVertical: 10 }}>
              <ToggleSwitch
                isOn={true}
                onColor="#4DD1EF"
                offColor="#47687F"
                label="Include digital signature"
                labelStyle={styles.text5}
                onToggle={(isOn) => console.log("changed to : ", isOn)}
              />
              <FormFilePicker name="file" size={1} />
              <Text style={styles.text5}>Tele-Consultation fee:</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[styles.text5, { fontSize: 12, fontWeight: "400" }]}
                >
                  Enter the consultation amount :
                </Text>
                <TextInput
                  style={{
                    height: 50,
                    width: 150,
                    borderColor: "rgba(21, 56, 95, 0.15)",
                    borderWidth: 1,
                    color: "#47687F",
                    borderRadius: 50,
                    marginHorizontal: 10,
                    fontSize: 16,
                    paddingHorizontal: 15,
                  }}
                  placeholder="₹"
                  keyboardType="numeric"
                  placeholderTextColor="#47687F"
                />
              </View>

              <Text style={styles.text5}>Credit offered on direct visits:</Text>
              <Text style={[styles.text5, { fontWeight: "400", fontSize: 12 }]}>
                We understand that everything cannot be done over a call. And
                you might want the pet to visit the clinic directly. Please
                indicate the amount of discount/credit on the physical
                consultation fees which you are willing to give to the client,
                for a physical visit if it takes place within 3 days of the
                call.
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[styles.text5, { fontSize: 12, fontWeight: "400" }]}
                >
                  Enter the discount amount :
                </Text>
                <TextInput
                  style={{
                    height: 50,
                    width: 100,
                    borderColor: "rgba(21, 56, 95, 0.15)",
                    borderWidth: 1,
                    color: "#47687F",
                    borderRadius: 50,
                    marginHorizontal: 10,
                    fontSize: 16,
                    paddingHorizontal: 15,
                  }}
                  placeholder="₹"
                  keyboardType="numeric"
                  placeholderTextColor="#47687F"
                />
                <TouchableOpacity>
                  <Feather
                    name={"info"}
                    size={20}
                    style={{
                      color: "#47687F",
                      backgroundColor: "#FFFFFF",
                      elevation: 10,
                      borderRadius: 50,
                      marginHorizontal: 25,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.text5}>Contact number</Text>
              <Text style={[styles.text5, { fontWeight: "400", fontSize: 12 }]}>
                Pet parent would contact this number in case of direct visits.
              </Text>
              <TextInput
                style={{
                  height: 60,
                  width: "90%",
                  borderColor: "rgba(21, 56, 95, 0.15)",
                  borderWidth: 1,
                  color: "#47687F",
                  borderRadius: 50,
                  marginHorizontal: 10,
                  marginVertical: 10,
                  fontSize: 16,
                  paddingHorizontal: 15,
                  alignSelf: "center",
                }}
                placeholder="+91"
                keyboardType="numeric"
                placeholderTextColor="#47687F"
              />
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: 12,
                  alignSelf: "center",
                  color: "#839BAB",
                  marginVertical: 5,
                }}
              >
                These settings can be changed later
              </Text>
            </View>
            <AppButton
              title="Submit"
              onPress={() => refRBSheet.current.open()}
            />
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
                  alignSelf: "center",
                  alignContent: "center",
                  alignItems: "center",
                  bottom: 50,
                  margin: 20,
                },
              }}
            >
              <ScrollView style={{ margin: 20 }}>
                <View>
                  <Text style={styles.text1}>About direct visit</Text>
                  <Text style={[styles.text2, { marginHorizontal: 15 }]}>
                    We recommend that you give you a minimum of 50% of your
                    tele-consultation charges as credit.
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#EFF3F5",
                      marginVertical: 10,
                    }}
                  />
                </View>
                <View>
                  <Text style={[styles.text4, { marginLeft: 10 }]}>Eg: </Text>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.text3}>Tele-consultation charges.</Text>
                    <Text style={styles.text6}>₹ 300</Text>
                  </View>
                  <Text style={[styles.text4, { marginLeft: 10 }]}>
                    On physical visit:
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.text3}>
                      Physical consultation charges.
                    </Text>
                    <Text style={styles.text6}>₹ 300</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.text3}>
                      Credit for tele-consultation charges.
                    </Text>
                    <Text style={styles.text6}>₹ 300</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.text3, { width: "75%" }]}>
                      Amount to be collected from customers on physical visit.
                      (for visits happening within 3 days of the call)
                    </Text>
                    <Text style={styles.text6}>₹ 300</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.text3}>
                      Plus Amount collected during tele-call.
                    </Text>
                    <Text style={styles.text6}>₹ 300</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[
                        styles.text3,
                        { color: "#35AED9", fontWeight: "700" },
                      ]}
                    >
                      Total revenue from the customer.
                    </Text>
                    <Text
                      style={[
                        styles.text6,
                        { color: "#35AED9", fontWeight: "700" },
                      ]}
                    >
                      ₹ 300
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </RBSheet>
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
    fontSize: 16,
    color: "#476880",
    marginVertical: 10,
    textAlign: "center",
  },
  text2: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 14,
    color: "#47687F",
    marginVertical: 10,
    textAlign: "center",
  },
  text3: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 14,
    color: "#47687F",
    marginVertical: 10,
    marginLeft: 10,
  },
  text4: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 14,
    color: "#47687F",
    marginVertical: 10,
  },
  text5: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 16,
    color: "#47687F",
    marginVertical: 10,
  },
  text6: {
    flex: 1,
    color: "#47687F",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    marginRight: 15,
    marginVertical: 10,
  },
});

export default ProfileSetup;
