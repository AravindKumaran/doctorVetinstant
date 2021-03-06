import React, { useState, useContext } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import AppText from '../components/AppText'
import AppFormField from '../components/AppFormField'
import SubmitButton from '../components/SubmitButton'
import ErrorMessage from '../components/ErrorMessage'

import authApi from '../api/auth'
import usersApi from '../api/users'
import AuthContext from '../context/authContext'
import authStorage from '../components/utils/authStorage'
import LoadingIndicator from '../components/LoadingIndicator'
import socket from '../components/utils/socket'

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(8).label('Password'),
})

const LoginScreen = ({ navigation }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { setUser } = useContext(AuthContext)

  const handleSubmit = async ({ email, password }) => {
    setLoading(true)
    const res = await authApi.login(email, password)
    if (!res.ok) {
      console.log('Error', res)
      setError(res.data?.msg)
      setLoading(false)
      return
    }
    setError(null)
    authStorage.storeToken(res.data.token)
    const userRes = await usersApi.getLoggedInUser()
    if (!userRes.ok) {
      console.log('Error', userRes)
      setError('You are not allowed to login')
      setLoading(false)
      // console.log(userRes.data.msg)
      return
    }
    socket.emit('online', userRes.data.user._id)
    setUser(userRes.data.user)
    setLoading(false)
  }

  return (
    <>
      <LoadingIndicator visible={loading} />
      <View style={styles.container}>
        <AppText
          style={{ textAlign: 'center', fontSize: 25, marginVertical: 20 }}
        >
          Login
        </AppText>

        {error && <ErrorMessage error={error} visible={!loading} />}

        <Formik
          initialValues={{ email: '', password: '' }}
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
                placeholder='Enter Your Email ID'
              />

              <AppFormField
                autoCapitalize='none'
                autoCorrect={false}
                icon='lock'
                name='password'
                placeholder='Password'
                secureTextEntry
                placeholder='Enter Your Password'
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <AppText style={{ textAlign: 'right', fontSize: 20 }}>
                  Forgot Password?
                </AppText>
              </TouchableOpacity>

              <SubmitButton title='Login' />
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
    marginTop: 60,
  },
})

export default LoginScreen
