import React, { useState, useEffect, useContext } from "react";
import { useIsFocused } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Formik } from "formik";
import AppButton from "../components/AppButton";
import AuthContext from "../context/authContext";
import usersApi from "../api/users";
import doctorsApi from "../api/doctors"
import hospitalsApi from "../api/hospitals"

const capitalize = (str) => {
  const words = str.trim().split(' ');
  const cap_arr = []
  for(const word of words) {
  	let w = word.split('')
    let firstL = w[0].toUpperCase();
    let restL = w.slice(1, w.length)
    restL.unshift(firstL)
    let capitalized = restL.join('');
    cap_arr.push(capitalized);
  }
  return cap_arr.join(" ")
}

const VetProfile = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const { user, setUser } = useContext(AuthContext);
  const [active, setActive] = useState("Profile");
  //const { doctor, qlf, hospital, profile, contact, hospitalContact, teleConsultationFee, physicalVisitFee, discountAmount } = route.params;
  const [profile, setImage] = useState(null);
  const [vetName, setDoctor] = useState();
  const [qualification, setQual] = useState();
  const [hospital, setHosp] = useState();
  const [contact, setContact] = useState();
  const [hospitalContact, setHospitalContact] = useState();
  const [teleConsultationfee, setTeleConsultationFee] = useState();
  const [visitFee, setVisitFee] = useState();

  const handleActive = (value) => {
    setActive(value);
  };

  const getUser = async() => {
    const userRes = await usersApi.getLoggedInUser();
    if(userRes.ok) {
      const user = userRes.data.user;
      setDoctor(`Dr.${user.name}`);
      if(user.profile_image) {
        setImage(user.profile_image)
      };
    }
  }

  const getDoctor = async() => {
    const doctorRes = await doctorsApi.getLoggedInDoctor(user._id);
    console.log(doctorRes.data);
    if(doctorRes.ok) {
      setQual(doctorRes.data.doctor.qlf);
      setContact(doctorRes.data.doctor.phone);
      setTeleConsultationFee(doctorRes.data.doctor.fee);
      setVisitFee(doctorRes.data.doctor.visitFee);
      setHospitalContact(doctorRes.data.doctor?.hospital?.contact);
      let hospname = capitalize(doctorRes.data.doctor.hospital.name)
      setHosp(hospname);
    }  
  }
  
  useEffect(() => {
    getDoctor();
    getUser();
  },[isFocused])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Formik
        initialValues={{
          reminder: "",
        }}
      >
        <>
          <View style={{ marginVertical: 20, marginBottom: 80 }}>
            <Image
              style={{
                height: 130,
                width: 130,
                alignSelf: "center",
                borderRadius: 100,
                borderWidth: 10,
                borderColor: "#FFFFFF",
                //elevation: 10,
              }}
              //source={require("../components/assets/images/doctor1.png")}
              source={{
                uri: profile ? profile : Image.resolveAssetSource(require("../components/assets/images/doctor1.png")).uri
              }}
            />
            <Text style={{ textAlign: "center" }}>
              <Text style={styles.text2}>{vetName} </Text>{" "}
              <Text
                style={[
                  styles.text2,
                  { color: "#47687F", fontSize: 18, fontWeight: "400" },
                ]}
              >
                {/* M.B.B.S., M.D. */}
                {qualification}
              </Text>
            </Text>
            <TouchableOpacity
              style={{
                height: 40,
                width: "80%",
                borderWidth: 1,
                borderColor: "#4AC4F1",
                borderRadius: 30,
                justifyContent: "center",
                alignSelf: "center",
                marginVertical: 20,
              }}
              onPress={() => {
                navigation.navigate("EditVetProfile");
              }}
            >
              <Text
                style={{
                  color: "#47687F",
                  fontSize: 12,
                  fontWeight: "700",
                  alignSelf: "center",
                }}
              >
                Edit your profile
              </Text>
            </TouchableOpacity>
            <View>
              <View style={styles.box}>
                <Text style={styles.text3}>Hospital</Text>
                <Text style={styles.text4}>{hospital}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text3}>Vet Contact</Text>
                <Text style={styles.text4}>{contact}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text3}>Hospital Contact</Text>
                <Text style={styles.text4}>{hospitalContact}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text3}>Tele-Consultation fee</Text>
                <Text style={styles.text4}>{teleConsultationfee}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text3}>Physical visit fee</Text>
                <Text style={styles.text4}>{visitFee}</Text>
              </View>
            </View>
            <View>
              <AppButton
                title="MedicalHistoryPets"
                onPress={() => navigation.navigate("MedicalHistoryPets")}
              />
              <AppButton
                title="Notification"
                onPress={() => navigation.navigate("Notification")}
              />
              <AppButton
                title="ChatNotification"
                onPress={() => navigation.navigate("ChatNotification")}
              />
              <AppButton
                title="MenuScreen"
                onPress={() => navigation.navigate("MenuScreen")}
              />
              <AppButton
                title="WalletScreen"
                onPress={() => navigation.navigate("WalletScreen")}
              />
              <AppButton
                title="Prescription"
                onPress={() => navigation.navigate("Prescriptionnnnn")}
              />
              {/* <AppButton
                title="PetMedication"
                onPress={() => navigation.navigate("PetMedication")}
              /> */}
              <AppButton
                title="ProfileSetup"
                onPress={() => navigation.navigate("ProfileSetup")}
              />
            </View>
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
    fontSize: 12,
    color: "#47687F",
    paddingHorizontal: 20,
  },
  text2: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 24,
    color: "#4AC4F1",
    marginBottom: 20,
  },
  text3: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 16,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
  text4: {
    fontFamily: "Proxima Nova",
    fontWeight: "400",
    fontSize: 14,
    color: "#47687F",
    alignSelf: "center",
    margin: 20,
  },
  box: {
    height: 50,
    borderRadius: 30,
    marginVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    elevation: 10,
    backgroundColor: "#FFFFFF",
    margin: 20,
  },
});

export default VetProfile;
