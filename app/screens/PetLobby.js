import React, { useEffect, useLayoutEffect, useState, useContext, useRef, useReducer } from "react";
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
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import AppButton from "../components/AppButton";
import RBSheet from "react-native-raw-bottom-sheet";
import ScheduleCallScreen from "./ScheduleCallScreen";
import AuthContext from "../context/authContext";
import reminderStorage from "../components/utils/reminderStorage";
import callPendingApi from "../api/callPending";
import roomApi from "../api/room";
import scheduledCallsApi from "../api/scheduledCall";

const PetLobby = () => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const refRBSheet = useRef();
  const { user, setUser } = useContext(AuthContext);
  const [calls, setCalls] = useState(false);
  const [callers, setCallers] = useState([]);
  const [requestedCalls, setRequestedCalls] = useState([]);
  const [scheduledCalls, setScheduledCalls] = useState([]);
  const [incomingCallRequest, setIncomingCallRequest] = useState();
  const [fetchCalls, setFetchCalls] = useState(false);

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

  const formatTime = (hour, min) => {
    if(hour > 12) {
      hour = hour % 12;
      return `${hour}:${min}PM`
    }
    return `${hour}:${min}AM`
  }

  const getPostfix = (date) => {
    const st = ['1'];
    const nd = ['2'];
    const rd = ['3'];
    const th = ['4', '5', '6', '7', '8', '9', '0'];
    const lastNum = date.split('')[date.length-1]
    
    if(st.includes(lastNum)) {
      return `st`
    } else if(nd.includes(lastNum)) {
      return `nd`
    } if(rd.includes(lastNum)) {
      return `rd`
    } if(th.includes(lastNum)) {
      return `th`
    }   
  }

  const formatDate = (inputDate) => {
    let date, month, hh, mm, postfix;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    date = inputDate.getDate();
    month = months[inputDate.getMonth()];
    hh = inputDate.getHours();
    mm = inputDate.getMinutes();
    postfix = getPostfix(String(date));
    return `${date}${postfix} ${month} ${formatTime(hh, mm)}`;
  }

  const getTimeDiff = (t2, t1) => {
    const tdiff_in_ms = t2 - t1;
    const tdiff_in_sec = tdiff_in_ms/1000;
    const tdiff_in_min = tdiff_in_sec/60;
    const tdiff_in_hours = tdiff_in_min/60;
    return {
      hh: tdiff_in_hours,
      mm: tdiff_in_min
    }
  }

  const getExpiryTime = (createdTime) => {
    const currentTime = new Date();
    const expiryTime = new Date();
    const expiryTimeInMs = createdTime.getTime() + (72 * 60 * 60 * 1000);
    expiryTime.setTime(expiryTimeInMs);
    const tdiff = getTimeDiff(expiryTime.getTime(), currentTime.getTime());
    const expiresIn = {
      hh: Math.floor(tdiff.hh),
      mm: Math.floor(tdiff.mm % 60),
      ss: 0
    }
    if(expiresIn.hh <= 0) return 'Expired';
    return `${expiresIn.hh}h ${expiresIn.mm}m`;
  }

  useEffect(() => {
    const getIncomingCallRequest = (calls) => {
      //let requested = calls.filter(call => call.status === 'requested')
      return calls.map(call => {
        //const scheduledCallRes = await scheduledCallsApi.getScheduledCallsByUserAndDoc(call.userId._id, call.docId._id);
        //const scheduledDate = scheduledCallRes?.data?.scheduledCalls?.date;
        const date = new Date(call.createdAt);
        //call.date = formatDate(date);
        if(call.extraInfo) {
          const scheduledDate = new Date(call?.extraInfo);
          call.date = formatDate(scheduledDate);
        } else {
          call.date = "";
        }
        if(!call.hasExpired) call.expiresIn = getExpiryTime(date);
        if(call.expiresIn == 'Expired') {
          call.hasExpired = true;
        }
        console.log('call=====', call)
        return call;
      });
    }
    const getCallNotifications = async() => {
      const res = await callPendingApi.getCallPendingByDoctor(user._id);
      if(res.ok) {
        const calls = res.data.calls;
        console.log('calls', calls.length)
        if(calls.length > 0) {
          setCalls(true)
          setCallers(calls);
          const incomingCallRequests = getIncomingCallRequest(calls);
          setRequestedCalls(incomingCallRequests);
        }
      }
      setFetchCalls(false);
    }
    getCallNotifications();
  },[isFocused, fetchCalls])

  const handleAccept = async(id) => {
    await callPendingApi.updateCallPending(id, { status: 'accepted' });
  }

  const createRoom = async(userId, docId, petId, userName) => {
    await roomApi.createRoom({
      name: `${userId}-${docId}`, 
      senderName: userName, 
      receiverId: docId, 
      petId
    });
  }

  const renderElement = ({status, id, paymentDone, petId, docName, userName, docId, userId, petName}) => {
    if(status === "requested") {
      return  <View style={{ flexDirection: "row", width: "50%" }}>
                <AppButton title="Accept" onPress={() => {
                  handleAccept(id)
                  refRBSheet.current.open()
                }} />
                <AppButton title="Decline" />
            </View>
    } else if((status === "accepted" || status === "scheduled") && !paymentDone) {
      return <View
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
    } else if(paymentDone) {
      createRoom(userId._id, docId._id, petId, userName);
      return <AppButton
                title="Enter Room"
                onPress={() => navigation.navigate("Room", {
                  petId,
                  petName,
                  docName,
                  userName,
                  docId: docId._id,
                  userId: userId._id
                })}
              />
    }
  }

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
              <ScheduleCallScreen screen="PetLobby" />
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
            {requestedCalls.length > 0 
            ?
            <View style={{ flexDirection: "column" }}>
            {requestedCalls.map((c, i) => (
              <>
                {c.hasExpired ? null :
                  <View>
                    <View style={{ flexDirection: "row", margin: 0, padding:0 }}>
                  <View key={c._id}>
                  <Text style={styles.text1}>Dr. {c.docName} & {c.petName}</Text>
                  <Text style={styles.text2}>Status: {c.status}</Text>
                  {c.paymentDone ? 
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Feather name="check-circle" color="#67F296" size={15} />
                      <Text style={[styles.text3, { paddingLeft: 5 }]}>
                        Payment
                      </Text>
                    </View>
                    :
                    <Text style={styles.text3}>Payment</Text>
                  }
                  <Text>
                    <Text style={styles.text3}>Call Scheduled at</Text>{" "}
                    <Text style={[styles.text2, { color: "#4AC4F1" }]}>
                      {c.date}
                    </Text>
                  </Text>
                  <Text style={styles.text2}>Room:</Text>
                  <Text style={styles.text3}>No one is in the room</Text>
                </View>
                <View
                  key={Math.random()}
                  style={{
                    flexDirection: "column",
                    flex: 1,
                    alignItems: "flex-end",
                    alignSelf: "center",
                  }}
                >
                  <View
                    key={Math.random()}
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      key={Math.random()}
                      source={require("../components/assets/images/doctor1.png")}
                      // source={{
                      //   uri: c.docId?._profile_image
                      // }}
                      style={[styles.image1, { left: 7.5 }]}
                    />
                    <Image
                      key={Math.random()}
                      source={require("../components/assets/images/pet.png")}
                      // source={{
                      //   uri: c.userId?._profile_image
                      // }}
                      style={[styles.image1, { right: 7.5 }]}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.text3}>Expires in </Text>
                    <Text style={styles.text2}>{c.expiresIn}</Text>
                  </View>
                </View>
                  </View>
                  {renderElement(c)}
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
                    <ScheduleCallScreen 
                      screen="PetLobby" 
                      rBSheet={refRBSheet} 
                      setFetchCalls={setFetchCalls} 
                      callData={{
                        userName: c.userName,
                        senderId: c.userId._id,
                        receiverId: c.docId._id,
                        doctorName: c.docName,
                        status: c.status,
                        _id: c._id,
                      }} 
                    />
                  </RBSheet>
                  {/* {c.status == "requested" ? 
                    <View style={{ flexDirection: "row", width: "50%" }}>
                      <AppButton title="Accept" onPress={() => handleAccept(c._id)} />
                      <AppButton title="Decline" />
                  </View>
                : 
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
              } */}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#DCE1E7",
                    marginVertical: 10,
                  }}
                />
                  </View>
                }
              </>
            ))}
          </View>
          : null
          }
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
