import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  Text,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppButton from "../components/AppButton";
import scheduledCallsApi from "../api/scheduledCall";
import pendingsApi from "../api/callPending";
import usersApi from "../api/users";
import AuthContext from "../context/authContext";
import * as Notifications from "expo-notifications";
import { storeObjectData } from "../components/utils/reminderStorage";

const ScheduleCallScreen = ({ navigation, route, screen, callData, rBSheet, setFetchCalls }) => {
  const [date, setDate] = useState(new Date());
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log("Ddd", route?.params?.sdata);

  let params = {};

  if(screen && screen === "PetLobby") {
    params.userName = callData.userName;
  }

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

  const showTimepicker = () => {
    showMode("time");
  };

  const sendPushToken = async (token, title, message) => {
    if (token) {
      setLoading(true);

      const pushRes = await usersApi.sendPushNotification({
        targetExpoPushToken: token,
        title: ` Dr. ${user.name} ${title} `,
        message: message || `Open the pending calls page for further action`,
        datas: { token: user.token || null },
      });

      if (!pushRes.ok) {
        setLoading(false);
        console.log("Error", pushRes);
        return;
      }
      setLoading(false);
    } else {
      alert("Something Went Wrong. Try Again Later");
    }
  };

  const scheduleNotification = async (rmr) => {
    const date1 = new Date(date.getTime() - 10 * 60 * 1000);
    const trigger = new Date(date1);
    trigger.setMinutes(date1.getMinutes());
    trigger.setSeconds(date1.getSeconds());
    console.log("Trigger", trigger.toLocaleString());
    console.log("Date1", date1.toLocaleString());
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your Today Scheduled Call Reminder",
        body: `You have call with ${rmr.userName}. Please join it`,
      },
      trigger,
    });
    return identifier;
  };

  const handlePress = async () => {
    if (route?.params?.scheduled) {
      const npCall = {
        ...route?.params?.sdata,
        status: "scheduled",
        extraInfo: `${date}`,
      };
      // console.log('Callssd', npCall)
      setLoading(true);
      const pRes = await pendingsApi.updateCallPending(
        route?.params?.sdata._id,
        npCall
      );
      if (!pRes.ok) {
        console.log("Error", pRes);
        setLoading(false);
        return;
      }
      const data = {
        date,
        userId: route?.params?.sdata.userId,
        doctorId: route?.params?.sdata.docId,
        doctorName: route?.params?.sdata.docName,
      };

      const res = await scheduledCallsApi.createScheduledCall(data);
      if (!res.ok) {
        setLoading(false);
        console.log("Res", res);
        return;
      }
      const rmr1 = {
        date,
        ...route?.params?.sdata,
      };
      const idt1 = await scheduleNotification(rmr1);
      rmr1["identifier"] = idt1;
      // console.log('Rmsdr', rmr1)
      await storeObjectData(
        `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`,
        rmr1
      );
      await sendPushToken(
        route?.params?.sdata.userMobToken,
        "has scheduled your call"
      );
      alert("Your call has been scheduled!");
      setLoading(false);
      navigation.navigate("CallLog");
    } else {
      const data = {
        date,
        userId: route?.params?.call?.senderId._id || callData.senderId,
        doctorId: route?.params?.call?.receiverId._id || callData.receiverId,
        doctorName: route?.params?.call?.receiverId.name || callData.doctorName,
      };

      // console.log('Data', data)

      setLoading(true);

      const res = await scheduledCallsApi.createScheduledCall(data);
      if (!res.ok) {
        setLoading(false);
        console.log("Res", res);
        return;
      }

      console.log("res", res);
      setLoading(false);

      const npCall = {
        ...route?.params?.sdata,
        status: "scheduled",
        extraInfo: `${date}`,
      };
      // console.log('Callssd', npCall)
      setLoading(true);
      await pendingsApi.updateCallPending(
        route?.params?.sdata._id || callData._id,
        npCall
      );

      alert("Your call has been scheduled!");
      if(screen && screen == "PetLobby" && rBSheet && setFetchCalls) {
        setFetchCalls(true);
        return rBSheet.current.close();
      }
      navigation.goBack();
    }
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.container1}>
        <Text style={styles.text}>Reschedule : Meet with {params.userName}</Text>

        <Text style={styles.text}>Choose Time</Text>
        <TouchableOpacity onPress={showTimepicker} style={styles.dateTime}>
          <Text style={styles.text2}>{date.toLocaleTimeString()}</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Choose Date</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.dateTime}>
          <Text style={styles.text2}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            neutralButtonLabel="clear"
            minimumDate={new Date()}
            // dateFormat={ShowCurrentDate}
            // dateFormat='dd/MM/yyyy'
          />
        )}

        {/* <Text
          style={{
            fontSize: 12,
            marginVertical: 10,
            color: "#DC143C",
            textAlign: "center",
          }}
        >
          *Time must be greater than current time for successful reminder
        </Text> */}

        <AppButton title="Schedule Call" onPress={handlePress} />
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
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  dateTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
    padding: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(21, 56, 95, 0.15)",
    width: "70%",
  },
  text: {
    color: "#47687F",
    fontWeight: "700",
    fontSize: 14,
    marginVertical: 10,
  },
  text1: {
    color: "#47687F",
    fontWeight: "700",
    fontSize: 12,
    marginVertical: 10,
  },
  text2: {
    color: "#47687F",
    fontWeight: "700",
    fontSize: 18,
  },
});

export default ScheduleCallScreen;
