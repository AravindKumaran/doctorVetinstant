import React, { useState, useContext, useEffect } from "react";

import { StyleSheet, View } from "react-native";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AuthContext from "../context/authContext";
import LoadingIndicator from "../components/LoadingIndicator";
import doctorsApi from "../api/doctors";

const DoctorDetailsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDoctorDetails = async () => {
    setLoading(true);
    const res = await doctorsApi.getSingleDoctor(user._id);
    if (!res.ok) {
      setLoading(false);
      console.log(res);
      return;
    }
    setDoctor(res.data.doctor);
    setLoading(false);
  };

  useEffect(() => {
    getDoctorDetails();
  }, []);
  return (
    <>
      {loading ? (
        <LoadingIndicator visible={loading} />
      ) : (
        <View style={styles.container}>
          {doctor ? (
            <View style={styles.details}>
              <AppText
                style={{
                  fontSize: 25,
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: 50,
                }}
              >
                Your Details
              </AppText>
              <View style={styles.card}>
                <AppText style={{ fontSize: 14, color: "#606770" }}>
                  Phone Number :{" "}
                </AppText>
                <AppText>{doctor.phone}</AppText>
              </View>
              <View style={styles.card}>
                <AppText style={{ fontSize: 14, color: "#606770" }}>
                  Hospital/Clinic Address :{" "}
                </AppText>
                <AppText>{doctor.address}</AppText>
              </View>
              <View style={styles.card}>
                <AppText style={{ fontSize: 14, color: "#606770" }}>
                  Bank Details :{" "}
                </AppText>
                <AppText>{doctor.bank}</AppText>
              </View>
              <View style={styles.card}>
                <AppText style={{ fontSize: 14, color: "#606770" }}>
                  Your Form File :{" "}
                </AppText>
                <AppText>{doctor.file}</AppText>
              </View>
            </View>
          ) : (
            <>
              <AppText
                style={{ fontSize: 22, fontWeight: "600", textAlign: "center" }}
              >
                You haven't added your details
              </AppText>
              <AppButton
                title='Add Doctor Details'
                onPress={() => navigation.navigate("Doctor")}
              />
            </>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 15,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },
  details: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 50,
  },
});

export default DoctorDetailsScreen;
