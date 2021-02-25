import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import AppFormField from '../components/AppFormField'
import SubmitButton from '../components/SubmitButton'
import ErrorMessage from '../components/ErrorMessage'

import authApi from '../api/auth'
import LoadingIndicator from '../components/LoadingIndicator'

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
})

const ForgotPasswordScreen = ({ navigation }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    navigation.setOptions({ title: 'Forgot Password' })
  }, [])

  const handleSubmit = async ({ email }) => {
    setLoading(true)
    const res = await authApi.sendForgotPasswordMail(email)

    if (!res.ok) {
      setLoading(false)
      console.log('Error', err)
      return
    }

    setLoading(false)
    alert('Email Sent! Please Check Your Inbox')

    navigation.navigate('ResetPassword')
  }

  return (
    <>
      <LoadingIndicator visible={loading} />
      <View style={styles.container}>
        <AppText
          style={{ textAlign: 'center', fontSize: 25, marginVertical: 20 }}
        >
          Provide Your Email Address Below
        </AppText>

        {error && <ErrorMessage error={error} visible={!loading} />}

        <Formik
          initialValues={{ email: '' }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {() => (
            <>
              <AppFormField
                icon='email'
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
                name='email'
                placeholder='john@gmail.com'
              />

              <SubmitButton title='Submit' />
            </>
          )}
        </Formik>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    marginTop: 80,
  },
})

export default ForgotPasswordScreen
