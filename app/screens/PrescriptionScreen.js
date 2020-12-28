import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import SubmitButton from '../components/SubmitButton'
import AppFormField from '../components/AppFormField'
import FormImagePicker from '../components/forms/FormImagePicker'

const validationSchema = Yup.object().shape({
  prescription: Yup.string().max(100).required().label('Prescription'),
  photo: Yup.string().nullable(),
})

const PrescriptionScreen = () => {
  const handleSubmit = (values) => {
    console.log(values)
  }

  return (
    <View style={styles.container}>
      <AppText
        style={{ textAlign: 'center', fontSize: 20, marginVertical: 30 }}
      >
        Please Provide Your Prescription
      </AppText>
      <Formik
        initialValues={{
          prescription: '',
          photo: null,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {() => (
          <>
            <AppFormField
              //   label='Pet Problems'
              autoCapitalize='none'
              autoCorrect={false}
              name='prescription'
              numberOfLines={3}
              placeholder='enter your prescription'
            />

            <AppText style={{ marginVertical: 20 }}>
              Select Image(optional)
            </AppText>

            <FormImagePicker name='photo' />

            <SubmitButton title='Send' />
          </>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 30,
  },
})

export default PrescriptionScreen
