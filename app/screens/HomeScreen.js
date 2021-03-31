import React, { useContext, useEffect, useState, useRef } from 'react'
import { StyleSheet, View, Platform, Alert } from 'react-native'

import AppButton from '../components/AppButton'
import AppText from '../components/AppText'
import AuthContext from '../context/authContext'
import authStorage from '../components/utils/authStorage'

import LoadingIndicator from '../components/LoadingIndicator'
import usersApi from '../api/users'
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

const HomeScrren = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    setUser()
    authStorage.removeToken()
  }

  useEffect(() => {
    const saveNotificationToken = async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      if (status !== 'granted') {
        alert('No notification permissions!')
        return
      }
      try {
        const token = await Notifications.getExpoPushTokenAsync({
          experienceId: `@vetinstant/docvetInstant`,
        })

        // console.log(token.data)

        if (user.token && user.token === token.data) {
          return
        }

        const res = await usersApi.createPushToken({ token: token.data })
        if (!res.ok) {
          console.log('Error', res.data)
          return
        }

        setUser(res.data.user)
      } catch (error) {
        console.log('Error getting push token', error)
      }
    }
    saveNotificationToken()

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      })
    }
  }, [])

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        navigation.navigate('CallLog', { name: 'Avids' })
      }
    )
    return () => subscription.remove()
  }, [])

  return (
    <View style={styles.container}>
      <LoadingIndicator visible={loading} />
      <AppText>Welcome Doctor {user ? user.name.split(' ')[0] : ''}</AppText>
      <AppButton
        title='My Details'
        onPress={() => navigation.navigate('DoctorDetails')}
      />
      <AppButton
        title='Patient List'
        onPress={() => navigation.navigate('PatientList')}
      />
      <AppButton title='Logout' onPress={handleLogout} />
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
