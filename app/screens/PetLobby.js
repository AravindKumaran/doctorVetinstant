import React, { useEffect, useState, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Header } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import AppButton from "../components/AppButton";
import RBSheet from "react-native-raw-bottom-sheet";
import ScheduleCallScreen from "./ScheduleCallScreen";

const PetLobby = () => {
  const navigation = useNavigation();
  const refRBSheet = useRef();

  const MyCustomLeftComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation?.goBack();
        }}
      >
        <Feather
          name={"arrow-left"}
          size={25}
          color="#476880"
          style={{
            marginLeft: 10,
            top: 5,
          }}
        />
      </TouchableOpacity>
    );
  };

  const MyCustomRightComponent = () => {
    return (
      <TouchableOpacity>
        <Feather
          name="message-circle"
          color="#FFFFFF"
          size={25}
          style={{ height: 35, padding: 5 }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Header
        leftComponent={<MyCustomLeftComponent />}
        rightComponent={<MyCustomRightComponent />}
        centerComponent={{
          text: "Pet Lobby",
          style: {
            color: "#476880",
            fontSize: 20,
            fontWeight: "700",
            top: 5,
          },
        }}
        containerStyle={{
          backgroundColor: "#FFFFFF",
          elevation: 5,
          borderBottomStartRadius: 15,
          borderBottomEndRadius: 15,
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.container1}>
          <View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text style={styles.text1}>Dr. Kumar & Bruno</Text>
                <Text style={styles.text2}>Status:</Text>
                <Text style={styles.text3}>Payment</Text>
                <Text>
                  <Text style={styles.text3}>Call Scheduled at</Text>{" "}
                  <Text style={[styles.text2, { color: "#4AC4F1" }]}>
                    3rd June 03:00PM
                  </Text>
                </Text>
                <Text style={styles.text2}>Room:</Text>
                <Text style={styles.text3}>No one is in the room</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "flex-end",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../components/assets/images/doctor1.png")}
                    style={[styles.image1, { left: 7.5 }]}
                  />
                  <Image
                    source={require("../components/assets/images/pet.png")}
                    style={[styles.image1, { right: 7.5 }]}
                  />
                </View>
                <Text>
                  <Text style={styles.text3}>Expires in</Text>{" "}
                  <Text style={styles.text2}>42h 21m</Text>
                </Text>
              </View>
            </View>
            <AppButton
              title="Enter Room"
              onPress={() => refRBSheet.current.open()}
            />
            <RBSheet
              ref={refRBSheet}
              height={450}
              animationType="fade"
              customStyles={{
                wrapper: {
                  backgroundColor: "rgba(255, 255, 255, 0.92)",
                },
                draggableIcon: {
                  backgroundColor: "#000",
                },
                container: {
                  backgroundColor: "#FFFFFF",
                  borderRadius: 25,
                  bottom: 150,
                  width: "90%",
                  alignSelf: "center",
                  elevation: 10,
                },
              }}
            >
              <ScheduleCallScreen />
            </RBSheet>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#DCE1E7",
                marginVertical: 10,
              }}
            />
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text style={styles.text1}>Dr. Kumar & Bruno</Text>
                <Text style={styles.text2}>Status:</Text>
                <Text style={styles.text3}>Payment</Text>
                <Text>
                  <Text style={styles.text3}>Call Scheduled at</Text>{" "}
                  <Text style={[styles.text2, { color: "#4AC4F1" }]}>
                    3rd June 03:00PM
                  </Text>
                </Text>
                <Text style={styles.text2}>Room:</Text>
                <Text style={styles.text3}>No one is in the room</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "flex-end",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../components/assets/images/doctor1.png")}
                    style={[styles.image1, { left: 7.5 }]}
                  />
                  <Image
                    source={require("../components/assets/images/pet.png")}
                    style={[styles.image1, { right: 7.5 }]}
                  />
                </View>
                <Text>
                  <Text style={styles.text3}>Expires in</Text>{" "}
                  <Text style={styles.text2}>42h 21m</Text>
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", width: "50%" }}>
              <AppButton title="Accept" />
              <AppButton title="Decline" />
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#DCE1E7",
                marginVertical: 10,
              }}
            />
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text style={styles.text1}>Dr. Kumar & Bruno</Text>
                <Text style={styles.text2}>Status:</Text>
                <Text style={styles.text3}>Payment</Text>
                <Text>
                  <Text style={styles.text3}>Call Scheduled at</Text>{" "}
                  <Text style={[styles.text2, { color: "#4AC4F1" }]}>
                    3rd June 03:00PM
                  </Text>
                </Text>
                <Text style={styles.text2}>Room:</Text>
                <Text style={styles.text3}>No one is in the room</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "flex-end",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../components/assets/images/doctor1.png")}
                    style={[styles.image1, { left: 7.5 }]}
                  />
                  <Image
                    source={require("../components/assets/images/pet.png")}
                    style={[styles.image1, { right: 7.5 }]}
                  />
                </View>
                <Text>
                  <Text style={styles.text3}>Expires in</Text>{" "}
                  <Text style={styles.text2}>42h 21m</Text>
                </Text>
              </View>
            </View>
            <AppButton title="Enter Room" />
            <View
              style={{
                borderWidth: 1,
                borderColor: "#DCE1E7",
                marginVertical: 10,
              }}
            />
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text style={styles.text1}>Dr. Kumar & Bruno</Text>
                <Text style={styles.text2}>Status:</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather name="check-circle" color="#67F296" size={15} />
                  <Text style={[styles.text3, { paddingLeft: 5 }]}>
                    Payment
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather name="alert-octagon" color="#E5AF44" size={15} />
                  <Text
                    style={[styles.text3, { color: "#E5AF44", paddingLeft: 5 }]}
                  >
                    Prescription pending
                  </Text>
                </View>
                <Text style={styles.text2}>Room:</Text>
                <Text style={styles.text3}>No one is in the room</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "flex-end",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../components/assets/images/doctor1.png")}
                    style={[styles.image1, { left: 7.5 }]}
                  />
                  <Image
                    source={require("../components/assets/images/pet.png")}
                    style={[styles.image1, { right: 7.5 }]}
                  />
                </View>
                <Text>
                  <Text style={styles.text3}>Expires in</Text>{" "}
                  <Text style={styles.text2}>42h 21m</Text>
                </Text>
              </View>
            </View>
            <AppButton title="Enter Room" />
            <View
              style={{
                borderWidth: 1,
                borderColor: "#DCE1E7",
                marginVertical: 10,
              }}
            />
          </View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text style={styles.text1}>Dr. Kumar & Bruno</Text>
                <Text style={styles.text2}>Status:</Text>
                <Text style={styles.text3}>Payment</Text>
                <Text>
                  <Text style={styles.text3}>Call Scheduled at</Text>{" "}
                  <Text style={[styles.text2, { color: "#4AC4F1" }]}>
                    3rd June 03:00PM
                  </Text>
                </Text>
                <Text style={styles.text2}>Room:</Text>
                <Text style={styles.text3}>No one is in the room</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  alignItems: "flex-end",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../components/assets/images/doctor1.png")}
                    style={[styles.image1, { left: 7.5 }]}
                  />
                  <Image
                    source={require("../components/assets/images/pet.png")}
                    style={[styles.image1, { right: 7.5 }]}
                  />
                </View>
                <Text>
                  <Text style={styles.text3}>Expires in</Text>{" "}
                  <Text style={styles.text2}>42h 21m</Text>
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 25,
              }}
            >
              <Image
                source={require("../components/assets/images/loader.png")}
              />
              <Text style={[styles.text2, { marginHorizontal: 10 }]}>
                Awaiting payment from the pet parent
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#DCE1E7",
                marginVertical: 10,
              }}
            />
          </View>
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
    margin: 20,
    marginBottom: 50,
  },
  text1: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 20,
    color: "#47687F",
    marginVertical: 4,
  },
  text2: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    color: "#47687F",
    marginVertical: 4,
  },
  text3: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 12,
    color: "#47687F",
    marginVertical: 4,
  },
  text4: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 14,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
  text5: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 16,
    color: "#47687F",
    marginVertical: 10,
  },
  image1: {
    height: 50,
    width: 50,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    borderRadius: 50,
  },
});

export default PetLobby;
