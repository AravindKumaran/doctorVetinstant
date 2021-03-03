import React, { useState, useEffect, useContext, useRef } from 'react'
import { StyleSheet, View, ScrollView, Image, Alert } from 'react-native'
import AppButton from '../components/AppButton'

import petsApi from '../api/pets'
import roomsApi from '../api/room'
import usersApi from '../api/users'

import * as Notifications from 'expo-notifications'

import LoadingIndicator from '../components/LoadingIndicator'
import AppText from '../components/AppText'
import AuthContext from '../context/authContext'

const PatientDetailsScreen = ({ navigation, route }) => {
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useContext(AuthContext)
  const responseListener = useRef()

  // console.log('Routee', route.params.pat)

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      async (notification) => {
        if (
          notification.notification?.request?.content?.data.status ===
            'startcall' &&
          notification.notification?.request?.content?.data.tokenn
        ) {
          const pushRes = await usersApi.sendPushNotification({
            targetExpoPushToken:
              notification.notification?.request?.content?.data.tokenn,
            title: `Call Started from Dr. ${user.name}`,
            message: `I have started the call. Please join it ASAP\n** Don't close the app from background!!`,
            datas: {
              token:
                notification.notification?.request?.content?.data.tokenn ||
                null,
              details: route?.params?.pat,
              callStarted: true,
            },
          })

          if (!pushRes.ok) {
            setLoading(false)
            console.log('Error', pushRes)
            return
          }
          setLoading(false)
          const tokenRes = await usersApi.getVideoToken({
            userName: user.name,
            roomName: route.params.pat.name,
          })
          console.log('Video Token', tokenRes)
          if (!tokenRes.ok) {
            setLoading(false)
            console.log('Error', tokenRes)
          }
          setLoading(false)
          navigation.navigate('VideoCall', {
            name: user.name,
            token: tokenRes.data,
          })
        }
      }
    )

    return () => {
      Notifications.removeNotificationSubscription(responseListener)
    }
  }, [])

  const getPetById = async () => {
    setLoading(true)
    const res = await petsApi.getPetDetails(route.params.pat.petId)
    if (!res.ok) {
      setLoading(false)
      console.log('Res', res)
      return
    }
    setPet(res.data.exPet)
    setLoading(false)
  }

  useEffect(() => {
    getPetById()
  }, [])

  const handleVideoCall = async () => {
    Alert.alert(
      'Video Call Request',
      `If you want to call press YES or If call has been already started by patient then press NO`,
      [
        {
          text: 'NO',
          onPress: async () => {
            const tokenRes = await usersApi.getVideoToken({
              userName: user.name,
              roomName: route.params.pat.name,
            })
            console.log('Video Token', tokenRes)
            if (!tokenRes.ok) {
              setLoading(false)
              console.log('Error', tokenRes)
            }
            setLoading(false)
            navigation.navigate('VideoCall', {
              name: user.name,
              token: tokenRes.data,
            })
          },
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            const userId = route.params?.pat?.name.split('-')[0]
            if (userId) {
              setLoading(true)
              const pushTokenRes = await usersApi.getPushToken(userId)
              if (!pushTokenRes.ok) {
                setLoading(false)
                console.log('Error', pushTokenRes)
              }
              setLoading(false)
              if (pushTokenRes.data?.token) {
                setLoading(true)

                const pushRes = await usersApi.sendPushNotification({
                  targetExpoPushToken: pushTokenRes.data?.token,
                  title: `Incoming Call Request from Dr. ${user.name}`,
                  message: `Are you available for next 15-30 minutes?\n** Don't close the app from background!!`,
                  datas: {
                    token: user.token || null,
                    details: route?.params?.pat,
                  },
                })

                if (!pushRes.ok) {
                  setLoading(false)
                  console.log('Error', pushRes)
                  return
                }
                setLoading(false)
              }
            }
          },
        },
      ],
      { cancelable: true }
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LoadingIndicator visible={loading} />

      <AppText>User Name: {route.params.pat.senderName}</AppText>
      <AppText style={{ fontSize: 24, fontWeight: '500', marginVertical: 20 }}>
        Pet Details :-
      </AppText>
      {pet && (
        <>
          <View style={styles.card}>
            <AppText>Weight: {pet.weight} Kg</AppText>
            <AppText>
              Age: {pet.years !== 0 && `${pet.years} years`}{' '}
              {pet.months !== 0 && `${pet.months} months`}
            </AppText>
            <AppText>Gender: {pet.gender} </AppText>
            <AppText>Breed: {pet.breed} </AppText>
            <AppText>Pet Type: {pet.type} </AppText>
            {pet.petHistoryImages?.length > 0 && (
              <>
                <AppText>Pet History Images: </AppText>
                <ScrollView horizontal style={{ marginVertical: 20 }}>
                  {pet.petHistoryImages.map((img, i) => (
                    <View key={`${img}-${i}`} style={{ marginRight: 20 }}>
                      <Image
                        // source={{
                        //   uri: `https://vetinstantbe.azurewebsites.net/${img}`,
                        // }}
                        source={{
                          uri: `http://192.168.43.242:8000/${img}`,
                        }}
                        style={{ width: 150, height: 150, borderRadius: 75 }}
                      />
                    </View>
                  ))}
                </ScrollView>
              </>
            )}
            {pet.prescriptions?.length > 0 && (
              <AppText>Pet Prescriptions:</AppText>
            )}
            {pet.prescriptions?.length > 0 &&
              pet.prescriptions.map((pbm, index) => (
                <View key={index} style={styles.cardBordered}>
                  <AppText>Prescription: {pbm.prescription}</AppText>
                  <AppText>Doctor name: {pbm.docname}</AppText>
                  <AppText>
                    Date: {new Date(pbm.date).toLocaleDateString()}
                  </AppText>
                  <AppText>
                    Time: {new Date(pbm.date).toLocaleTimeString()}
                  </AppText>
                  {pbm.img && (
                    <>
                      <AppText>Prescription Image:</AppText>
                      <Image
                        source={{
                          uri: `http://192.168.43.242:8000/${pbm.img}`,
                        }}
                        // source={{
                        //   uri: `https://vetinstantbe.azurewebsites.net/api/v1/${pbm.img}`,
                        // }}
                        style={{ width: 150, height: 150, borderRadius: 75 }}
                      />
                    </>
                  )}
                </View>
              ))}
            {pet.problems?.length > 0 && <AppText>Pet Problems:</AppText>}
            {pet.problems?.length > 0 &&
              pet.problems.map((pb, index) => (
                <View key={pb._id} style={styles.cardBordered}>
                  <AppText>Problem: {pb.problem}</AppText>
                  <AppText>Doctor name: {pb.docname}</AppText>
                  <AppText>Time Period: {pb.time}</AppText>
                  <AppText>Appetite: {pb.Appetite}</AppText>
                  <AppText>Behaviour: {pb.Behaviour}</AppText>
                  <AppText>Ears: {pb.Ears}</AppText>
                  <AppText>Eyes: {pb.Eyes}</AppText>
                  <AppText>Faces: {pb.Feces}</AppText>
                  <AppText>Gait: {pb.Gait}</AppText>
                  <AppText>Mucous: {pb.Mucous}</AppText>
                  <AppText>Skin: {pb.Skin}</AppText>
                  <AppText>Urine: {pb.Urine}</AppText>
                  <AppText>Comment: {pb.comment}</AppText>
                  {pb?.images?.length > 0 && (
                    <AppText>Pet Problem image</AppText>
                  )}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {pb?.images?.length > 0 &&
                      pb?.images.map((img, i) => (
                        <>
                          <Image
                            key={i + img}
                            source={{
                              uri: `http://192.168.43.242:8000/${img}`,
                            }}
                            // source={{
                            //   uri: `https://vetinstantbe.azurewebsites.net/api/v1/${img}`,
                            // }}
                            style={{
                              width: 150,
                              height: 150,
                              borderRadius: 75,
                              marginHorizontal: 5,
                            }}
                          />
                        </>
                      ))}
                  </ScrollView>
                </View>
              ))}
          </View>
          <AppButton
            title='Chat'
            onPress={() =>
              navigation.navigate('Chat', { pat: route.params.pat })
            }
          />
          <AppButton title='Video Call' onPress={handleVideoCall} />
          <AppButton
            title='Send Prescription'
            onPress={() => navigation.navigate('Prescription')}
          />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: 30,
    marginHorizontal: 30,
    marginVertical: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  cardBordered: {
    borderColor: '#dfd9d9',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
})

export default PatientDetailsScreen
