import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import ErrorMessage from "../components/forms/ErrorMessage";

import { ScrollView } from "react-native-gesture-handler";
import FormImagePicker from "../components/forms/FormImagePicker";
import AppFormPicker from "../components/forms/AppFormPicker";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  breed: Yup.string().required().label("Breed"),
  age: Yup.number().required().min(0).label("Age"),
  weight: Yup.number().required().min(1).label("Weight"),
  gender: Yup.string().required("Please pick dog gender").nullable(),
  petType: Yup.string().required("Please pick pet type").nullable(),
  image: Yup.string().required("Please pick an image").nullable(),
});

const petTypes = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Other...", value: "other" },
];

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const AddPetScreen = ({ navigation }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    console.log(values);
    navigation.navigate("Home", { pet: values });
  };
  return (
    <ScrollView vertical={true}>
      <View style={styles.container}>
        {/* {error && <ErrorMessage error={error} visible={!loading} />} */}

        <Formik
          initialValues={{
            name: "",
            breed: "",
            age: "",
            weight: "",
            notes: "",
            image: null,
            gender: null,
            petType: null,
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {() => (
            <>
              <FormImagePicker name='image' />
              <AppFormPicker items={petTypes} label='Type' name='petType' />

              <AppFormField
                label='Name'
                autoCapitalize='none'
                autoCorrect={false}
                name='name'
                placeholder='enter your dog name'
              />
              <AppFormField
                label='Breed'
                autoCapitalize='none'
                autoCorrect={false}
                name='breed'
                placeholder='enter your dog breed'
              />
              <AppFormPicker items={genders} label='Gender' name='gender' />

              <AppFormField
                label='Age'
                autoCapitalize='none'
                autoCorrect={false}
                name='age'
                keyboardType='numeric'
                placeholder='enter your dog age in yrs'
              />

              <AppFormField
                label='Weight'
                autoCapitalize='none'
                autoCorrect={false}
                name='weight'
                keyboardType='numeric'
                placeholder='enter your dog weight in lbs'
              />

              <AppFormField
                label='Notes'
                autoCapitalize='none'
                autoCorrect={false}
                name='notes'
                numberOfLines={5}
              />

              <SubmitButton title='Save Pet' />
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 20,
  },
});

export default AddPetScreen;
