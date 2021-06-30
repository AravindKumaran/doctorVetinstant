import React, { useContext, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AuthContext from "../context/authContext";
import authStorage from "../components/utils/authStorage";
import LoadingIndicator from "../components/LoadingIndicator";
import usersApi from "../api/users";
import doctorsApi from "../api/doctors";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Header } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const doctors = [
  {
    src: require("../components/assets/images/pet.png"),
    name: "Video call from Dr. Kumar has been scheduled at 07:00pm today.",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Your chat with Dr. R. Vijayashanthini has ended.",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Video call from Dr. Kumar has been scheduled at 07:00pm today.",
  },
  {
    src: require("../components/assets/images/pet.png"),
    name: "Your chat with Dr. R. Vijayashanthini has ended.",
  },
];

const HomeScreen = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setUser();
    authStorage.removeToken();
  };

  const navigation = useNavigation();

  console.log('user', user)

  const MyCustomLeftComponent = () => {
    return (
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Feather
          name="bar-chart"
          size={25}
          color="#47687F"
          style={{
            marginLeft: 10,
            paddingLeft: 20,
            top: 15,
            transform: [{ scaleX: -1 }, { rotate: "270deg" }],
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
          color="#47687F"
          size={25}
          style={{ height: 35, padding: 5 }}
        />
      </TouchableOpacity>
    );
  };

  useEffect(() => {

    const saveNotificationToken = async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== "granted") {
        alert("No notification permissions!");
        return;
      }
      try {
        const token = await Notifications.getExpoPushTokenAsync({
          experienceId: `@vetinstant/docvetInstant`,
        });

        // console.log(token.data)

        if (user.token && user.token === token.data) {
          return;
        }

        const res = await usersApi.createPushToken({ token: token.data });
        if (!res.ok) {
          console.log("Error", res.data);
          return;
        }

        setUser(res.data.user);
      } catch (error) {
        console.log("Error getting push token", error);
      }
    };
    saveNotificationToken();
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        navigation.navigate("CallLog", { name: "Avids" });
      }
    );
    return () => subscription.remove();
  }, []);

  return (
    <>
      <Header
        leftComponent={<MyCustomLeftComponent />}
        rightComponent={<MyCustomRightComponent />}
        centerComponent={{
          text: "VetInstant",
          style: { color: "#4AC4F1", fontSize: 20, fontWeight: "700", top: 5 },
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
          <View
            style={{
              elevation: 10,
              backgroundColor: "#FFFFFF",
              borderRadius: 50,
            }}
          >
            <Image
              source={require("../components/assets/images/doctor1.png")}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                borderWidth: 5,
                borderColor: "#FFFFFF",
              }}
            />
          </View>
          <Text style={styles.text1}>Dr. Raj Kumar</Text>
          <Text style={styles.text2}>PetCare Veteneriary Hospital</Text>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#59E3FC", "#2090C7"]}
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 125,
              width: "100%",
              alignSelf: "center",
              marginVertical: 20,
              borderRadius: 20,
              elevation: 10,
            }}
          >
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text style={[styles.text3, { fontSize: 16 }]}>
                Next Appointment
              </Text>
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: "#FFFFFF",
                  marginLeft: 10,
                  marginVertical: 5,
                }}
              />
              <Text style={styles.text3}>Name : Bruno</Text>
              <Text style={styles.text3}>Parent Name : Vivek_14796</Text>
            </View>

            <View style={{ flex: 1, alignItems: "flex-end", marginTop: 50 }}>
              <Text style={[styles.text4, { fontSize: 18 }]}>Thu 3rd JUN</Text>
              <Text style={[styles.text4, { fontSize: 24 }]}>03:00 PM</Text>
              <Image
                source={require("../components/assets/images/clock.png")}
              />
            </View>
          </LinearGradient>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#E7E7E7",
              width: "95%",
              marginVertical: 25,
            }}
          />

          <View>
            <Text style={[styles.text1, { textAlign: "center" }]}>
              Dashboard
            </Text>
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <View style={styles.dashboard}>
                <Text style={styles.text5}>Today’s Appoinments</Text>
                <View style={[styles.box, { borderColor: "#47687F" }]}>
                  <Text
                    style={[styles.text5, { fontSize: 30, color: "#47687F" }]}
                  >
                    5
                  </Text>
                </View>
              </View>
              <View style={styles.dashboard}>
                <Text style={styles.text5}>Pending Appointments</Text>
                <View style={[styles.box, { borderColor: "#FF8C8C" }]}>
                  <Text
                    style={[styles.text5, { fontSize: 30, color: "#FF8C8C" }]}
                  >
                    4
                  </Text>
                </View>
              </View>
              <View style={styles.dashboard}>
                <Text style={styles.text5}>Completed Appointments</Text>
                <View style={[styles.box, { borderColor: "#88DC8B" }]}>
                  <Text
                    style={[styles.text5, { fontSize: 30, color: "#88DC8B" }]}
                  >
                    1
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginVertical: 20 }}>
            <Text style={[styles.text1, { textAlign: "center" }]}>
              Notifications
            </Text>
          </View>
        </View>
        <View style={{ margin: 20, marginBottom: 20 }}>
          {doctors.map((c, i) => (
            <>
              <View key={`${c.name}-${Date.now()}`} style={styles.catItem}>
                <Image
                  source={c.src}
                  size={15}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 50,
                    borderWidth: 10,
                    borderColor: "#FFFFFF",
                  }}
                />
                <Text style={[styles.catItemText, { marginTop: -10 }]}>
                  {c.name}
                </Text>
                <View style={styles.Rectangle}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("VetProfile");
                    }}
                  >
                    <Text style={styles.text6}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  height: 1,
                  width: "95%",
                  borderWidth: 1,
                  borderColor: "#DCE1E7",
                  alignSelf: "center",
                  marginVertical: 15,
                  bottom: 20,
                }}
              />
            </>
          ))}
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
    alignItems: "center",
    margin: 20,
  },
  text1: {
    color: "#47687F",
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 5,
  },
  text2: {
    color: "#839BAB",
    fontSize: 12,
    fontWeight: "400",
  },
  text3: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginVertical: 5,
    marginLeft: 10,
  },
  text4: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginRight: 10,
  },
  text5: {
    color: "#47687F",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    alignSelf: "center",
    marginVertical: 5,
  },
  dashboard: {
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "center",
    width: "33.33%",
  },
  box: {
    width: 100,
    height: 100,
    elevation: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    justifyContent: "center",
    borderWidth: 1,
  },
  catItem: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 20,
  },
  catItemText: {
    color: "#47687F",
    fontWeight: "400",
    fontFamily: "Proxima Nova",
    paddingLeft: 0,
    marginRight: 190,
    fontSize: 12,
  },
  Rectangle: {
    width: 80,
    height: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    right: 180,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4AC4F1",
  },
  text6: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 12,
    color: "#4AC4F1",
  },
});

export default HomeScreen;

{
  /* <LoadingIndicator visible={loading} />
          <AppText>
            Welcome Doctor {user ? user.name.split(" ")[0] : ""}
          </AppText>
          <AppButton
            title="My Details"
            onPress={() => navigation.navigate("DoctorDetails")}
          />
          <AppButton
            title="Patient List"
            onPress={() => navigation.navigate("PatientList")}
          />
          <AppButton title="Logout" onPress={handleLogout} /> */
}
