import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as Yup from "yup";

import AppText from "../components/AppText";
import AppFormField from "../components/AppFormField";
import SubmitButton from "../components/SubmitButton";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";

import FormFilePicker from "../components/forms/FormFilePicker";

import doctorsApi from "../api/doctors";

const phoneRegExp = /^[6-9]\d{9}$/g;

const validationSchema = Yup.object().shape({
  address: Yup.string().max(100).required().label("Address"),
  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required()
    .label("Phone"),
  file: Yup.string()
    .required("Please select a .pdf file of size less than 1 Mb")
    .nullable()
    .label("File"),
  bank: Yup.string().required().max(100).label("Bank"),
});

const DetailsScreen = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const data = new FormData();
    data.append("file", {
      name: "file",
      type: "application/pdf",
      uri: values.file,
    });
    data.append("address", values.address);
    data.append("phone", values.phone);
    data.append("bank", values.bank);
    setLoading(true);
    const res = await doctorsApi.saveDoctor(data);
    if (!res.ok) {
      setLoading(false);
      setError(res.data?.msg);
      console.log(res);
    }
    setLoading(false);

    alert("Your data has been saved!");
    navigation.navigate("Account");
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
              address: "",
              phone: "",
              file: "",
              bank: "",
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <>
                <FormFilePicker name='file' />

                <AppFormField
                  label='Address'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='address'
                  numberOfLines={4}
                  placeholder='Hospital/Clinic address'
                />
                <AppFormField
                  label='Phone Number'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='phone'
                  keyboardType='numeric'
                  placeholder='Enter your phone number'
                />

                <AppFormField
                  label='Bank Details'
                  autoCapitalize='none'
                  autoCorrect={false}
                  name='bank'
                  numberOfLines={4}
                  placeholder='Enter your bank details'
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
