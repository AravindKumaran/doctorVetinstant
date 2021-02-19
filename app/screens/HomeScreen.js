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
import socket from '../components/utils/socket'

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
  const notificationListener = useRef()
  const responseListener = useRef()
  const [dataSend, setDataSend] = useState(false)
  // const [userToken, userToken.current] = useState(null)
  const userToken = useRef(null)

  const handleLogout = () => {
    setUser()
    authStorage.removeToken()
  }

  const sendPushToken = async (token, message, status) => {
    setLoading(true)

    const pushRes = await usersApi.sendPushNotification({
      targetExpoPushToken: token,
      title: 'Doctor Response!',
      message: message,
      datas: { token: user.token || null, status: status || null },
    })
    if (!pushRes.ok) {
      setLoading(false)
      console.log('Error', pushRes)
      return
    }
    userToken.current = null
    setDataSend(false)
    setLoading(false)
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

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        // console.log('REceived', notification)
        if (!userToken.current && notification.request.content.data.token) {
          console.log('Received', userToken.current)
          userToken.current = notification.request.content.data.token

          Alert.alert(
            'Incoming Call Request from PetOwner',
            `Are you available for next 15-30 minutes?\n** Don't close the app from background!!`,
            [
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('Cancel Pressed')
                  if (!dataSend) {
                    sendPushToken(
                      userToken.current,
                      `Sorry! I'm not available. Please try with other available doctors`,
                      'cancel'
                    )
                    // console.log('Data Send')
                    setDataSend(true)
                  }
                },
                style: 'cancel',
              },
              {
                text: 'Accept',
                onPress: () => {
                  if (!dataSend) {
                    sendPushToken(
                      userToken.current,
                      `Yes I'm available. Complete the payment within 5-10 minutes`,
                      'ok'
                    )
                    // console.log('Data Send')
                    setDataSend(true)
                  }
                  // console.log('OK Pressed')
                  return
                },
              },
            ],
            { cancelable: false }
          )
        }
      }
    )

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        console.log(userToken.current)
        console.log('Response', notification)
      }
    )

    return () => {
      Notifications.removeNotificationSubscription(notificationListener)
      Notifications.removeNotificationSubscription(responseListener)
      userToken.current = null
    }
  }, [])

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
      {/* {userToken.current &&
        Alert.alert(
          'Incoming Call Request from PetOwner',
          `Are you available for next 15-30 minutes?\n** Don't close the app from background!!`,
          [
            {
              text: 'Cancel',
              onPress: () => {
                console.log('Cancel Pressed')
                if (!dataSend) {
                  sendPushToken(
                    userToken.current,
                    `Sorry! I'm not available. Please try with other available doctors`
                  )
                  console.log('Data Send')
                  setDataSend(true)
                }
              },
              style: 'cancel',
            },
            {
              text: 'Accept',
              onPress: () => {
                if (!dataSend) {
                  sendPushToken(
                    userToken.current,
                    `Yes I'm available. Complete the payment within 5-10 minutes`
                  )
                  console.log('Data Send')
                  setDataSend(true)
                }
                console.log('OK Pressed')
                return
              },
            },
          ],
          { cancelable: false }
        )} */}
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
