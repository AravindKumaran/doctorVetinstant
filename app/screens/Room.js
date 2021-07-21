import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { Header } from "react-native-elements";
import AppButton from "../components/AppButton";
import { useNavigation } from "@react-navigation/native";
import ChatScreen from "./ChatScreen";
import MedicalHistory from "./MedicalHistory";

const ActiveStyle = () => (
  <View
    style={{
      width: 30,
      height: 4,
      borderRadius: 14,
      position: "absolute",
      top: 20,
      borderBottomColor: "#4AC4F1",
      borderBottomWidth: 2,
      alignSelf: "center",
    }}
  ></View>
);

const Room = () => {
  const [active, setActive] = useState("problem");
  const [isvideo, setVideo] = useState(true);
  const [petProblems, setPetProblems] = useState();
  const [petName, setPetName] = useState();
  const { petId, docName, userName, docId, userId, petname, extraInfo, callId, petowner } = route?.params?.petId ? route.params : { petId: null, docName: null, userName: null };
  const [room, setRoom] = useState();
  const isFocused = useIsFocused();
  const [roomDet, setRoomDet] = useState({});
  console.log('route params', route.params)

  useEffect(() => {
    const getPetProblems = async() => {
      const petsRes = await petsApi.getPetDetails(petId);
      if(petsRes.ok) {
        const petProbs = petsRes.data?.exPet.problems;
        setPetProblems(petProbs.find(item => item.docname === docName))
        setPetName(petsRes.data?.exPet.name);
      }
    }
    if(petId) getPetProblems();
  }, [isFocused]);

  useEffect(() => {
    const getReceiverRoom = async() => {
      let room_name = `${userId}-${docId}`;
      const roomApiRes = await roomApi.getReceiverRoom(room_name);
      if(roomApiRes.ok) {
        const roomData = roomApiRes.data.room[0];
        console.log('receiver room', roomApiRes.data.room)
        const roomDetails = {
          name: roomData.name,
          petId: roomData.petId,
          senderName: roomData.senderName,
          userId: roomData.name.split("-")[0],
          docId: roomData.name.split("-")[1],
          userName: roomData.senderName
        }
        // console.log('roomDetails', roomDetails)
        setRoom(roomData);
        setRoomDet(roomDetails);
      }
    }
    if(docId) getReceiverRoom();
  }, [isFocused]);

  useEffect(() => {
    console.log('petname', petName)
    console.log('room', room)
  }, [petName, room]);

  const handleActive = (value) => {
    setActive(value);
  };

  const navigation = useNavigation();

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
          text: "Room",
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
      <View style={styles.container}>
        <View>
          <View style={styles.catItem2}>
            <Image
              source={require("../components/assets/images/doctor1.png")}
              style={[styles.image1, { left: 10 }]}
            />
            <Image
              source={require("../components/assets/images/pet.png")}
              style={[styles.image1, { right: 10 }]}
            />
            <View styles={{ flexDirection: "column" }}>
              <Text
                style={{ fontSize: 14, color: "#47687F", fontWeight: "700" }}
              >
                Dr. {docName} & 
              </Text>
              <Text style={{ fontSize: 14, color: "#47687F", fontWeight: "700" }}>
                {petname} ‘s room
              </Text>
              <Text
                style={{ fontSize: 12, color: "#A3B1BF", fontWeight: "400" }}
              >
                Room ID : #141526
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.choose}>
          <View>
            {active === "problem" ? <ActiveStyle /> : <View />}
            <TouchableWithoutFeedback onPress={() => handleActive("problem")}>
              <Text
                style={[
                  styles.text1,
                  { color: active === "problem" ? "#4AC4F1" : "#476880" },
                ]}
              >
                Problem
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View>
            {active === "videocall" ? <ActiveStyle /> : <View />}
            <TouchableWithoutFeedback onPress={() => handleActive("videocall")}>
              <Text
                style={[
                  styles.text1,
                  { color: active === "videocall" ? "#4AC4F1" : "#476880" },
                ]}
              >
                Video Call
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View>
            {active === "chat" ? <ActiveStyle /> : <View />}
            <TouchableWithoutFeedback onPress={() => handleActive("chat")}>
              <Text
                style={[
                  styles.text1,
                  { color: active === "chat" ? "#4AC4F1" : "#476880" },
                ]}
              >
                Chat
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View>
            {active === "sharableassets" ? <ActiveStyle /> : <View />}
            <TouchableWithoutFeedback
              onPress={() => handleActive("sharableassets")}
            >
              <Text
                style={[
                  styles.text1,
                  {
                    color: active === "sharableassets" ? "#4AC4F1" : "#476880",
                  },
                ]}
              >
                Sharable Assets
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View
          style={{
            height: 0.5,
            backgroundColor: "#47687F",
            elevation: 5,
          }}
        />
        {active === "videocall" && (
          <View>
            {!isvideo ? (
              <View style={{ alignItems: "center", margin: 30 }}>
                <Text
                  style={{
                    margin: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#47687F",
                      fontWeight: "400",
                      fontSize: 14,
                    }}
                  >
                    Call Scheduled at
                  </Text>{" "}
                  <Text
                    style={{
                      color: "#4AC4F1",
                      fontWeight: "700",
                      fontSize: 14,
                    }}
                  >
                    11th April 07:00 pm
                  </Text>
                </Text>
                <Image
                  source={require("../components/assets/images/doctor1.png")}
                  style={styles.image1}
                />
                <Text
                  style={{
                    margin: 10,
                  }}
                >
                  Dr.Kumar has joined the call
                </Text>
                <AppButton
                  title="Join Video call"
                  // onPress={() => navigation.navigate("VideoCall")}
                  // onPress={() => setVideo(true)}
                  onPress={() => {
                    setVideo(true);
                    navigation.navigate("VideoCall", {
                      roomName: `${userId}-${docId}`,
                      extraInfo: extraInfo,
                      callId: callId,
                      petowner: petowner,
                      petId: petId
                    });
                  }}
                />
              </View>
            ) : (
              <View style={{ alignItems: "center", margin: 50 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      marginLeft: "15%",
                      flex: 1,
                      height: 1,
                      backgroundColor: "#C5CACF",
                      marginHorizontal: 10,
                    }}
                  />
                  <View>
                    <Text style={styles.text4}>No one in the room</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: "#C5CACF",
                      marginRight: "15%",
                      marginHorizontal: 10,
                    }}
                  />
                </View>
                <AppButton
                  title="Join Video call"
                  onPress={() => navigation.navigate("Video")}
                  onPress={() => setVideo(false)}
                />
                <AppButton
                  title="Generate Prescription"
                  onPress={() => navigation.navigate("Video")}
                  onPress={() => setVideo(false)}
                />
              </View>
            )}
          </View>
        )}
        {active === "chat" && <ChatScreen />}
        {active === "sharableassets" && <MedicalHistory />}
      </View>
    </>
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
  catItem1: {
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
  text4: {
    color: "#47687F",
    fontSize: 14,
    fontWeight: "400",
    marginVertical: 15,
  },
  catItem2: {
    borderRadius: 30,
    flexDirection: "row",
    padding: 25,
    alignItems: "center",
  },
  image1: {
    height: 75,
    width: 75,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    borderRadius: 50,
  },
});

export default Room;
