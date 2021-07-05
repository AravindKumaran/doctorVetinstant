import React, { useEffect, useState, useContext } from "react";
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
import SubmitButton from "../components/SubmitButton";
import AppFormField from "../components/AppFormField";
import AppImagePicker from "../components/forms/AppImagePicker";
import FormFilePicker from "../components/forms/FormFilePicker";
import ToggleSwitch from "toggle-switch-react-native";
import Feather from "react-native-vector-icons/Feather";
import usersApi from "../api/users";
import doctorsApi from "../api/doctors"
import hospitalsApi from "../api/hospitals"
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import AuthContext from "../context/authContext";

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

const EditVetProfile = ({navigation, route}) => {
  const { user, setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vetName, setDoctor] = useState();
  const [qualification, setQual] = useState();
  const [hospital, setHosp] = useState();
  const [contact, setContact] = useState();
  const [hospitalContact, setHospitalContact] = useState();
  const [teleConsultationfee, setTeleConsultationFee] = useState();
  const [visitFee, setVisitFee] = useState();
  const [discountAmount, setDiscountAmount] = useState();
  let hospitalId;
  let initialPdf = null, initialImage = null;

  const getUser = async() => {
    const userRes = await usersApi.getLoggedInUser();
    if(userRes.ok) {
      const user = userRes.data.user;
      setDoctor(`Dr.${user.name}`);
    }
  }
  const getDoctor = async() => {
    setDoctor(`Dr.${user.name}`);
    const doctorRes = await doctorsApi.getLoggedInDoctor(user._id);
    console.log(doctorRes.data);
    if(doctorRes.ok) {
      hospitalId = doctorRes.data.doctor?.hospital._id;
      setQual(doctorRes.data.doctor.qlf);
      setContact(doctorRes.data.doctor.phone);
      setTeleConsultationFee(doctorRes.data.doctor.fee);
      setVisitFee(doctorRes.data.doctor.visitFee);
      setDiscountAmount(doctorRes.data.doctor.discount);
      setHospitalContact(doctorRes.data.doctor?.hospital?.contact);
      let hospname = capitalize(doctorRes.data.doctor.hospital.name)
      setHosp(hospname);
    }  
  }
  const getPdf_setFee = async() => {
    const doctorsRes = await doctorsApi.getLoggedInDoctor();
    const file = doctorsRes.data.doctor.file;
    if(file) {
      initialPdf = file;
      setPdf(file)
    };
  }

  useEffect(() => {
    getDoctor();
    getUser();
    getPdf_setFee();
  },[])

  const handleSubmit = async({ name, qual, Hospital, Contact, HospitalContact, fee, visitfee, discountAmount, file, photo }) => {
    console.log("submit", { name, qual, Hospital, Contact, HospitalContact, fee, visitfee, discountAmount });
    setLoading(true);
    //1. Update doctor phone, qlf, fee, pdf
    if(Contact || qual || fee || file || visitfee || discountAmount) {
      const loggedInDoctor = await doctorsApi.getLoggedInDoctor();
      
      if (!loggedInDoctor.ok) {
        setLoading(false);
        console.log("Error loggedInDoctor", loggedInDoctor);
        setError(loggedInDoctor.data?.msg ? loggedInDoctor.data.msg : "Something Went Wrong");
        return;
      }
      const doctorId = loggedInDoctor.data.doctor._id;
      hospitalId = loggedInDoctor.data.doctor?.hospital._id;

      const doctorsForm = new FormData();
      if(qual) doctorsForm.append('qlf', qual);
      if(Contact) doctorsForm.append('phone', Contact);
      if(fee) doctorsForm.append('fee', fee);
      if(visitfee) doctorsForm.append('visitFee', visitfee);
      if(discountAmount) doctorsForm.append('discount', discountAmount);
      if(file && initialPdf !== pdf) doctorsForm.append('file', {
        name: file.split('.').reverse()[1],
        type: 'application/pdf',
        uri: file
      });
      //console.log('doctorsForm', doctorsForm)
      const doctorsRes = await doctorsApi.updateDoctor(doctorId, doctorsForm)
      //console.log('uploaded file', doctorsRes.data.doctor.file)

      if (!doctorsRes.ok) {
        setLoading(false);
        console.log("Error doctorsRes", doctorsRes);
        setError(doctorsRes.data?.msg ? doctorsRes.data.msg : "Something Went Wrong");
        return;
      }
    }

  //2. Update Hosp name, Contact
  if((Hospital || HospitalContact) && hospitalId) {
    console.log('hospital name', Hospital)
    const data = {
      name: Hospital,
      contact: HospitalContact
    }
    const hospRes = await hospitalsApi.updateHospital(data, hospitalId);
    if (!hospRes.ok) {
      setLoading(false);
      console.log("Error in hospRes", hospRes);
      setError(hospRes.data?.msg ? hospRes.data.msg : "Something Went Wrong");
      return;
    }
    console.log('Hosp updated', hospRes.data);
  }

  //3. Update profile image, vetname
  if(name || photo) {
    const form = new FormData();
    if(name) {
      let drname = name;
      if(name.startsWith('Dr.')) {
        drname = name.split('.')[1]
      }
      form.append('name', drname);
    }
    if(photo && photo !== initialImage) form.append('image', {
      name: photo.split('.').reverse()[1],
      type: "image/" + photo.split('.').reverse()[0],
      uri: photo,
    })
    const userRes = await usersApi.updateDoctorHosp(form);
    if(!userRes.ok) {
      setLoading(false);
      console.log("userRes", userRes);
      setError(userRes.data?.msg ? userRes.data.msg : "Something Went Wrong");
      return;
    }
  }
    setLoading(false);
    alert('Updated Successfully!');
    navigation.navigate("Home");
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {error && <ErrorMessage error={error} visible={!loading} />}
      <Formik
        initialValues={{
          // name: vetName,
          // qual: qualification,
          // Hospital: hospital,
          // Contact: contact,
          // HospitalContact: hospitalContact,
          // fee: teleConsultationfee,
          // discountAmount: discountAmount
        }}
        onSubmit={handleSubmit}
      > 
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
          <LoadingIndicator visible={loading} />
          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 30,
              marginBottom: 50,
            }}
          >
            <View style={{ alignSelf: "center", marginVertical: 20 }}>
              <AppImagePicker name="photo" />
            </View>
            <AppFormField
              label="Vet Name"
              autoCapitalize="none"
              autoCorrect={false}
              name="name"
              defaultValue={vetName}
              //placeholder="Vet Name"
            />
            <AppFormField
              label="Qualification"
              autoCapitalize="none"
              autoCorrect={false}
              name="qual"
              defaultValue={qualification}
              //   placeholder="Qualification"
            />
            <AppFormField
              label="Hospital"
              autoCapitalize="none"
              autoCorrect={false}
              name="Hospital"
              defaultValue={hospital}
              //   placeholder="Hospital"
            />
            <AppFormField
              label="Contact"
              autoCapitalize="none"
              autoCorrect={false}
              name="Contact"
              defaultValue={contact}
              //   placeholder="Contact"
            />
            <AppFormField
              label="Hospital Contact"
              autoCapitalize="none"
              autoCorrect={false}
              name="HospitalContact"
              defaultValue={hospitalContact}
              //   placeholder="Hospital Contact"
            />

            <View style={{ marginVertical: 10 }}>
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    color: "#4AC4F1",
                    fontSize: 12,
                    fontWeight: "400",
                    marginVertical: 5,
                  }}
                >
                  Add Contact
                </Text>
              </TouchableOpacity>
              <ToggleSwitch
                isOn={true}
                onColor="#4DD1EF"
                offColor="#47687F"
                label="Include digital signature"
                labelStyle={styles.text5}
                onToggle={(isOn) => console.log("changed to : ", isOn)}
              />
              <FormFilePicker initialUrl={pdf} name="file" size={1} />
              
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
                  name="fee"
                  onChangeText={handleChange('fee')}
                  defaultValue={teleConsultationfee ? teleConsultationfee : ""}
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

              <Text style={styles.text5}>Physical Visit fee:</Text>
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
                  name="visitfee"
                  onChangeText={handleChange('visitfee')}
                  defaultValue={visitFee ? visitFee : ""}
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
                  name="discountAmount"
                  onChangeText={handleChange('discountAmount')}
                  defaultValue={discountAmount ? discountAmount : ""} 
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
              {/* <AppButton title="Update Vet" /> */}
              <View style={{ top: 0 }}>
                <SubmitButton title="Update Vet" />
              </View>
            </View>
          </View>
        </>
        )}
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
    color: "#41CE8A",
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
  text5: {
    fontFamily: "Proxima Nova",
    fontWeight: "700",
    fontSize: 16,
    color: "#47687F",
    marginVertical: 10,
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

export default EditVetProfile;
