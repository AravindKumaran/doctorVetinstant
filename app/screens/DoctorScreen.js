import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as Yup from "yup";

import AppText from "../components/AppText";
import AppFormField from "../components/AppFormField";
import SubmitButton from "../components/SubmitButton";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import AppSelect from "../components/forms/AppSelect";

import FormFilePicker from "../components/forms/FormFilePicker";

import doctorsApi from "../api/doctors";
import hospitalsApi from "../api/hospitals";

const accType = [
  { label: "Savings", value: "savings" },
  { label: "Current", value: "current" },
];

const phoneRegExp = /^[6-9]\d{9}$/g;
const acceptedCreditCards = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
  amex: /^3[47][0-9]{13}$/,
  discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
  diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
};

function validateCard(value) {
  if (!value) return;
  // remove all non digit characters
  var value = value.replace(/\D/g, "");
  var sum = 0;
  var shouldDouble = false;
  // loop through values starting at the rightmost side
  for (var i = value.length - 1; i >= 0; i--) {
    var digit = parseInt(value.charAt(i));

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  var valid = sum % 10 == 0;
  var accepted = false;

  // loop through the keys (visa, mastercard, amex, etc.)
  Object.keys(acceptedCreditCards).forEach(function (key) {
    var regex = acceptedCreditCards[key];
    if (regex.test(value)) {
      accepted = true;
    }
  });

  return valid && accepted;
}

const validationSchema = Yup.object().shape({
  // hospname: Yup.string().max(100).required().label("Hospital/Clinic Name"),
  hospname: Yup.string()
    .test(
      "samefield",
      "Please either enter or select Hospital name",
      function (value) {
        const { selectHospName } = this.parent;
        if (selectHospName && value) return false;
        if (!selectHospName) return value != null;
        return true;
      }
    )
    .max(100)
    .label("Hospital/Clinic Name"),
  selectHospName: Yup.string()
    .test(
      "samefield",
      "Please either enter or select Hospital name",
      function (value) {
        const { hospname } = this.parent;
        if (hospname && value) return false;
        if (!hospname) return value != null;
        return true;
      }
    )
    .nullable()
    .label("Hospital/Clinic Name"),
  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required()
    .label("Phone"),
  file: Yup.string()
    .required("Please select a .pdf file of size less than 1 Mb")
    .nullable()
    .label("File"),
  acc: Yup.string()
    .test("card-number", "Invalid Card Number", (value) => validateCard(value))
    .required()
    .min(13)
    .label("Account No."),
  accname: Yup.string().required().label("Name"),
  type: Yup.string()
    .required("Please Pick Account Type")
    .nullable()
    .label("Account Type"),
  ifsc: Yup.string().min(11).required().label("IFSC Code"),
});

const DetailsScreen = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hospitals, setHopitals] = useState([]);

  const getAllHospitals = async () => {
    setLoading(true);
    const res = await hospitalsApi.getHospitals();
    if (!res.ok) {
      setLoading(false);
      console.log(res);
      return;
    }
    let allHospitals = res.data.hospitals;
    let newHospitals = allHospitals.reduce((acc, item) => {
      acc.push({
        label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        value: item.name,
      });
      return acc;
    }, []);
    setHopitals(newHospitals);
    setLoading(false);
  };

  useEffect(() => {
    getAllHospitals();
  }, []);

  const handleSubmit = async (values) => {
    // if (values) {
    //   console.log(values);
    //   return;
    // }

    const data = new FormData();
    if (!values.selectHospName) {
      setLoading(true);
      const hosRes = await hospitalsApi.saveHospitalName(values.hospname);
      if (!hosRes.ok) {
        setLoading(false);
        alert(hosRes.data.msg);
        // setError(hosRes.data.msg);
        return;
      }
      data.append("hospname", hosRes.data.newHospital.name);
    } else {
      data.append("hospname", values.selectHospName);
    }
    data.append("file", {
      name: "file",
      type: "application/pdf",
      uri: values.file,
    });
    data.append("phone", values.phone);
    data.append("accno", values.acc);
    data.append("accname", values.accname);
    data.append("acctype", values.type);
    data.append("ifsc", values.ifsc);
    setLoading(true);
    const res = await doctorsApi.saveDoctor(data);
    if (!res.ok) {
      setLoading(false);
      setError(res.data?.msg);
      console.log(res);
    }
    setLoading(false);

    alert("Your data has been saved!");
    navigation.navigate("Home");
    setError(null);
  };

  return (
    <>
      <LoadingIndicator visible={loading} />
      <ScrollView>
        <View style={styles.container}>
          <AppText
            style={{
              marginBottom: 30,
              textAlign: "center",
              fontWeight: "600",
              fontSize: 22,
              marginTop: -22,
            }}
          >
            Provide your details below
          </AppText>

          {error && <ErrorMessage error={error} visible={!loading} />}

          <Formik
            initialValues={{
              hospname: "",
              selectHospName: "",
              phone: "",
              file: "",
              acc: "",
              accname: "",
              type: "",
              ifsc: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <>
                <FormFilePicker name='file' />

                <AppFormField
                  label='Hospital/Clinic Name'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='hospname'
                  numberOfLines={2}
                  placeholder='Hospital/Clinic Name'
                />
                <AppText
                  style={{ textAlign: "center", fontSize: 22, margin: 10 }}
                >
                  OR
                </AppText>

                <AppSelect
                  items={hospitals}
                  label='Select Hospital Name If Exists!'
                  name='selectHospName'
                />

                <AppFormField
                  label='Phone Number'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='phone'
                  keyboardType='numeric'
                  placeholder='Enter your phone number'
                  maxLength={10}
                />

                <AppText
                  style={{
                    textAlign: "center",
                    marginVertical: 20,
                    fontSize: 28,
                    textDecorationLine: "underline",
                  }}
                >
                  Bank Details
                </AppText>

                <AppFormField
                  label='Card Number'
                  autoCapitalize='none'
                  autoCorrect={false}
                  keyboardType='numeric'
                  name='acc'
                  placeholder='xxxx xxxx xxxx xxxx'
                />
                <AppFormField
                  label='Name On Card'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='accname'
                  placeholder='Name On Card'
                />

                <AppSelect items={accType} label='Account Type' name='type' />

                <AppFormField
                  label='IFSC Code'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='ifsc'
                  placeholder='Enter your bank ifsc code'
                  maxLength={11}
                />

                <SubmitButton title='Submit' />
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
    marginHorizontal: 30,
    marginTop: 60,
  },
});

export default DetailsScreen;
