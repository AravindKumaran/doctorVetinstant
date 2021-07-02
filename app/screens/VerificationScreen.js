import React, { useState, useContext, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-community/google-signin";

import AppFormField from "../components/AppFormField";
import SubmitButton from "../components/SubmitButton";
import ErrorMessage from "../components/ErrorMessage";

import authApi from "../api/auth";
import hospitalsApi from "../api/hospitals";
import doctorsApi from "../api/doctors";
import AuthContext from "../context/authContext";
import authStorage from "../components/utils/authStorage";
import LoadingIndicator from "../components/LoadingIndicator";
import socket from "../components/utils/socket";

import usersApi from "../api/users";
import FormFilePicker from "../components/forms/FormFilePicker";
import AppImagePicker from "../components/forms/AppImagePicker";
import ImagePicker from "../components/forms/ImagePicker";
import RBSheet from "react-native-raw-bottom-sheet";

const validationSchema = Yup.object().shape({
  image: Yup.string().label("Image"),
  name: Yup.string().required().label("Name"),
  hospital: Yup.string().required().label("Hospital"),
  address: Yup.string().required().label("Address"),
  file: Yup.string().required().label("File"),
});

const VerificationScreen = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const refRBSheet = useRef();
  const [profile, setImage] = useState();

  const handleSubmit = async ({ image, name, hospital, address, file }) => {
    if(!profile) {
      setError('Image is required!')
      return;
    }

    setLoading(true);
    //save hospital name
    const hospitalRes = await hospitalsApi.saveHospitalName(hospital, address);

    if (!hospitalRes.ok) {
      setLoading(false);
      console.log("Ress Regs", hospitalRes);
      setError(hospitalRes.data?.msg ? hospitalRes.data.msg : "Something Went Wrong");
      return;
    }

    const hospitalId = hospitalRes.data.newHospital._id;

    //save user name, profile image and attach hospital id
    const userform = new FormData();
    userform.append("hospitalId", hospitalId);
    userform.append("name", name);
    userform.append("image", {
      name: "image",
      type: "image/" + profile.split('.').reverse()[0],
      uri: profile,
    });
    const userRes = await usersApi.updateDoctorHosp(userform);

    if (!userRes.ok) {
      setLoading(false);
      console.log("Ress Regs in updateDoctorHosp", userRes);
      setError(userRes.data?.msg ? userRes.data.msg : "Something Went Wrong");
      return;
    }

    //upload pdf
    const pdfform = new FormData();
    pdfform.append("hospital", hospitalId);
    pdfform.append('file', {
      name: file.split('.').reverse()[0],
      type: 'application/pdf',
      uri: file
    });

    const pdfRes = await doctorsApi.saveDoctor(pdfform);

    if (!pdfRes.ok) {
      setLoading(false);
      console.log("Ress Regs in saveDoctor", pdfRes);
      setError(pdfRes.data?.msg ? pdfRes.data.msg : "Something Went Wrong");
      return;
    }
    setLoading(false);
    refRBSheet.current.open();
    // setTimeout(() => refRBSheet.current.close(), 5000)
    // navigation.navigate("Login", {
    //   msg: "Registration  Successfull. Please wait for admin approval",
    // });
    setError(null);
  };

  return (
    <>
      <LoadingIndicator visible={loading} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 20, marginHorizontal: 30 }}>
          {error && <ErrorMessage error={error} visible={!loading} />}

          <Formik
            initialValues={{
              image: "",
              name: "",
              hospital: "",
              address: "",
              file: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <>
                <Image
                  source={{
                    uri: profile ? profile : Image.resolveAssetSource(require("../components/assets/images/user.png")).uri
                  }}
                  style={{
                    height: 150,
                    width: 200,
                    borderRadius: 100,
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                />
                <ImagePicker
                  name="image"
                  onChangeImage={(uri) => setImage(uri)}
                />
                
                <AppFormField
                  icon="account"
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="name"
                  label="Your name"
                  // placeholder="Your name"
                />

                <AppFormField
                  icon="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  name="hospital"
                  label="Hospital name"
                  // placeholder="Hospital name/Clinic name"
                />

                <AppFormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="lock"
                  name="address"
                  label="Registered address"
                  // placeholder="Registered address"
                />

                <View style={{ marginTop: 10 }}>
                  <FormFilePicker name="file" size={1} />
                </View>

                {/* <TouchableOpacity
                  style={{ alignSelf: "center", paddingTop: 5 }}
                  onPress={() => refRBSheet.current.open()}
                >
                  <Text style={{ fontSize: 14, fontWeight: "700" }}>
                    <Text style={{ color: "#47687F" }}>New to the app?</Text>{" "}
                    <Text style={{ color: "#3FBDE3" }}>Sign Up</Text>
                  </Text>
                </TouchableOpacity> */}
                <RBSheet
                  ref={refRBSheet}
                  closeOnDragDown={true}
                  closeOnPressMask={true}
                  onClose={() => navigation.navigate("Login")}
                  height={200}
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
                      bottom: 250,
                      width: "90%",
                      alignSelf: "center",
                      elevation: 10,
                    },
                  }}
                >
                  <View style={{ alignItems: "center", margin: 25 }}>
                    <Text
                      style={{
                        color: "#4DD1EF",
                        fontSize: 18,
                        fontWeight: "700",
                        marginVertical: 10,
                      }}
                    >
                      Success!
                    </Text>
                    <Text
                      style={{
                        color: "#47687F",
                        fontSize: 16,
                        fontWeight: "400",
                        textAlign: "center",
                      }}
                    >
                      Registration is complete. Our team will verify your
                      details and you will receive your verification code in
                      your mail.
                    </Text>
                  </View>
                </RBSheet>

                <View style={{ top: 0 }}>
                  <SubmitButton title="Register" />
                </View>
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
  text1: {
    color: "#47687F",
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
    paddingRight: "5%",
    paddingLeft: "5%",
  },
});

export default VerificationScreen;
