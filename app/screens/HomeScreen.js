import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import AppButton from '../components/AppButton'
import AppText from '../components/AppText'
import AuthContext from '../context/authContext'
import authStorage from '../components/utils/authStorage'

import LoadingIndicator from '../components/LoadingIndicator'
import usersApi from '../api/users'

const HomeScrren = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    setUser()
    authStorage.removeToken()
  }

  const handleVideoPress = async () => {
    const tokenRes = await usersApi.getVideoToken(user.name)
    console.log('Video Token', tokenRes)
    if (!tokenRes.ok) {
      setLoading(false)
      console.log('Error', tokenRes)
    }
    setLoading(false)
    // console.log(tokenRes)
    navigation.navigate('VideoCall', {
      name: user.name,
      token: tokenRes.data,
    })
  }

  return (
    <View style={styles.container}>
      <LoadingIndicator visible={loading} />
      <AppText>Welcome Doctor {user ? user.name.split(' ')[0] : ''}</AppText>
      <AppButton title='Logout' onPress={handleLogout} />
      <AppButton
        title='View History'
        onPress={() => navigation.navigate('Patient')}
      />
      <AppButton
        title='View Doctor Details'
        onPress={() => navigation.navigate('DoctorDetails')}
      />
      <AppButton
        title='Patient List'
        onPress={() => navigation.navigate('PatientList')}
      />
      <AppButton title='Video Call' onPress={handleVideoPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
})

export default HomeScrren
