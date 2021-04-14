import React, { useState, useEffect, useContext, useRef } from 'react'
import RBSheet from 'react-native-raw-bottom-sheet'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter)

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native'

import AppText from '../components/AppText'
import AppButton from '../components/AppButton'

import pendingsApi from '../api/callPending'
import roomsApi from '../api/room'
import usersApi from '../api/users'
import petsApi from '../api/pets'
import LoadingIndicator from '../components/LoadingIndicator'
import AuthContext from '../context/authContext'

const CallPendingScreen = ({ navigation }) => {
  const refRBSheet = useRef()
  const { user } = useContext(AuthContext)
  const [pendingCalls, setPendingCalls] = useState([])
  const [currentProblem, setCurrentProblem] = useState(null)
  const [previousProblem, setPreviousProblem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pet, setPet] = useState(null)

  const getUserPendingCalls = async () => {
    setLoading(true)
    const pres = await pendingsApi.getCallPendingByDoctor(user._id)
    if (!pres.ok) {
      console.log('Error', pres)
      setLoading(false)
      setRefreshing(false)
      return
    }
    console.log('Ress', pres.data)
    setPendingCalls(pres.data.calls)
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    getUserPendingCalls()
  }, [])

  const handleBtns = async (item, str) => {
    const allPCalls = [...pendingCalls]
    const pCall = allPCalls.find((p) => p._id === item._id)
    if (pCall) {
      pCall.status = str
    }
    setLoading(true)
    const pRes = await pendingsApi.updateCallPending(item._id, pCall)
    if (!pRes.ok) {
      console.log('Error', pRes)
      setLoading(false)
      return
    }
    setLoading(false)
    setPendingCalls(allPCalls)
  }

  const handleVideo = async (item) => {
    const roomRes = await roomsApi.createRoom({
      name: `${item.userId}-${item.docId}`,
      senderName: item.userName,
      receiverId: item.docId,
      petId: item.petId,
    })
    if (!roomRes.ok) {
      console.log(roomRes)
      setLoading(false)
      return
    }
    const tokenRes = await usersApi.getVideoToken({
      userName: user.name,
      roomName: roomRes.data.room.name,
    })
    console.log('Video Token', tokenRes)
    if (!tokenRes.ok) {
      setLoading(false)
      console.log('Error', tokenRes)
    }
    setLoading(false)

    navigation.navigate('Home', {
      screen: 'VideoCall',
      params: {
        name: user.name,
        token: tokenRes.data,
        item,
      },
    })
  }

  const getPetDetails = async (id) => {
    setPet(null)
    refRBSheet.current.open()
    setLoading(true)
    const petRes = await petsApi.getPetDetails(id)
    if (!petRes.ok) {
      console.log('Error', petRes)
      alert('Pet Not Found!')
      setPet(null)
      setLoading(false)
      refRBSheet.current.close()
      return
    }
    setLoading(false)
    setPet(petRes.data.exPet)
    if (petRes.data.exPet.problems?.length > 0) {
      const allProb = petRes.data.exPet.problems.reverse()
      const curProbIndex = allProb.findIndex(
        (prob) => prob.docname === user.name
      )
      if (curProbIndex !== -1) {
        const cur = allProb[curProbIndex]
        setCurrentProblem(cur)
        allProb.splice(curProbIndex, 1)
        setPreviousProblem(allProb)
      } else {
        setPreviousProblem(allProb)
      }
    }
  }

  const _renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <AppText
          style={{
            textTransform: 'capitalize',
            fontSize: 22,
            color: '#344247',
          }}
        >
          {item.userName}
        </AppText>
        <AppButton
          title='Pet Details'
          btnStyle={{
            width: '50%',
            marginRight: 5,
            borderRadius: 30,
            backgroundColor: 'transparent',
            borderColor: '#fc5c65',
            borderWidth: 2,
          }}
          txtStyle={{ textAlign: 'center', width: '-100%', color: '#706868' }}
          onPress={() => getPetDetails(item.petId)}
        />
      </View>
      {item.status === 'requested' && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>Patient Requested</AppText>
          <AppButton
            title='Schedule'
            onPress={() =>
              navigation.navigate('ScheduleCall', {
                sdata: item,
                scheduled: true,
              })
            }
          />
          <View style={{ flexDirection: 'row' }}>
            <AppButton
              title='Deny'
              btnStyle={{ width: '50%', marginRight: 5 }}
              txtStyle={{ textAlign: 'center', width: '-100%' }}
              onPress={() => handleBtns(item, 'deny')}
            />
            <AppButton
              title='Accept'
              btnStyle={{ width: '50%', marginRight: 5 }}
              txtStyle={{ textAlign: 'center', width: '-100%' }}
              onPress={() => handleBtns(item, 'accepted')}
            />
          </View>
        </>
      )}
      {item.status === 'accepted' && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>Waiting for payment</AppText>
        </>
      )}
      {item.status === 'paymentDone' && item.paymentDone && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>Payment Done Successfully.</AppText>
          <AppText>Please join the call</AppText>
          <AppButton title='Join Now' onPress={() => handleVideo(item)} />
        </>
      )}
      {item.status === 'scheduled' && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>Waiting for payment</AppText>
          <AppText>You have scheduled the call at</AppText>
          <AppText>
            <AppText style={{ fontWeight: 'bold' }}>
              {dayjs(item.extraInfo).format('hh:mm A')}
            </AppText>
            on
            <AppText style={{ fontWeight: 'bold' }}>
              {dayjs(item.extraInfo).format('DD/MM/YYYY')}
            </AppText>
          </AppText>
        </>
      )}
      {item.status === 'scheduledPayment' && item.paymentDone && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status:</AppText>
          <AppText>Payment Done</AppText>
          <AppText>
            Call Scheduled at
            <AppText style={{ fontWeight: 'bold' }}>
              {dayjs(item.extraInfo).format('hh:mm A')}
            </AppText>
            on
            <AppText style={{ fontWeight: 'bold' }}>
              {dayjs(item.extraInfo).format('DD/MM/YYYY')}
            </AppText>
          </AppText>
          <AppButton title='Join Now' onPress={() => handleVideo(item)} />
          {/* {dayjs().isSameOrAfter(dayjs(item.extraInfo)) && (

          )} */}
        </>
      )}
      {item.status === 'deny' && (
        <>
          <AppText style={{ fontWeight: 'bold' }}>Status: </AppText>
          <AppText>Call has been denied</AppText>
        </>
      )}
    </View>
  )

  const handleRefresh = () => {
    setRefreshing(true)
    getUserPendingCalls()
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingIndicator visible={loading} />}
      {pendingCalls.length === 0 && (
        <AppText style={{ textAlign: 'center', fontSize: 25 }}>
          No Pending Calls
        </AppText>
      )}
      <FlatList
        data={pendingCalls}
        renderItem={_renderItem}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <RBSheet
        ref={refRBSheet}
        height={Dimensions.get('window').height - 150}
        animationType='fade'
        closeOnDragDown={false}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,.6)',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            backgroundColor: '#fff',
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
          },
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginHorizontal: 20,
            marginBottom: 10,
          }}
        >
          {loading && <LoadingIndicator visible={loading} />}
          <AppText
            style={{
              fontSize: 24,
              fontWeight: '500',
              marginVertical: 20,
              textAlign: 'center',
            }}
          >
            Pet Details :-
          </AppText>
          {pet && (
            <>
              <View style={styles.card2}>
                <AppText>
                  Date: {new Date(pet.createdAt).toLocaleDateString()}
                </AppText>
                <AppText>
                  Time: {new Date(pet.createdAt).toLocaleTimeString()}
                </AppText>
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
                            //   uri: `https://vetinstantbe.azurewebsites.net/img/${img}`,
                            // }}
                            source={{
                              uri: `${img}`,
                            }}
                            style={{
                              width: 150,
                              height: 150,
                              borderRadius: 75,
                            }}
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
                            // source={{
                            //   uri: `http://192.168.43.242:8000/img/${pbm.img}`,
                            // }}
                            source={{
                              uri: `${pbm.img}`,
                            }}
                            style={{
                              width: 150,
                              height: 150,
                              borderRadius: 75,
                            }}
                          />
                        </>
                      )}
                    </View>
                  ))}
                {currentProblem && <AppText>Current Pet Problem:</AppText>}
                {currentProblem && (
                  <View style={styles.cardBordered}>
                    <AppText>Problem: {currentProblem.problem}</AppText>
                    <AppText>Doctor name: {currentProblem.docname}</AppText>
                    <AppText>Time Period: {currentProblem.time}</AppText>
                    <AppText>Appetite: {currentProblem.Appetite}</AppText>
                    <AppText>Behaviour: {currentProblem.Behaviour}</AppText>
                    <AppText>Eyes: {currentProblem.Eyes}</AppText>
                    <AppText>Gait: {currentProblem.Gait}</AppText>
                    <AppText>Mucous: {currentProblem.Mucous}</AppText>
                    <AppText>Comment: {currentProblem.comment}</AppText>
                    {currentProblem.Ears?.length > 0 && (
                      <AppText style={{ fontSize: 22 }}>Ears: </AppText>
                    )}

                    {currentProblem.Ears?.length > 0 &&
                      currentProblem.Ears.map((er, i) => (
                        <AppText key={`${i}-Ears`}> {er}</AppText>
                      ))}

                    {currentProblem.Feces?.length > 0 && (
                      <AppText style={{ fontSize: 22 }}>Faces: </AppText>
                    )}

                    {currentProblem.Feces?.length > 0 &&
                      currentProblem.Feces.map((fc, i) => (
                        <AppText key={`Feces ${i}`}> {fc}</AppText>
                      ))}
                    {currentProblem.Urine?.length > 0 && (
                      <AppText style={{ fontSize: 22 }}>Urines: </AppText>
                    )}

                    {currentProblem.Urine?.length > 0 &&
                      currentProblem.Urine.map((ur, i) => (
                        <AppText key={`Urines ${i}`}> {ur}</AppText>
                      ))}
                    {currentProblem.Skin?.length > 0 && (
                      <AppText style={{ fontSize: 22 }}>Skins: </AppText>
                    )}

                    {currentProblem.Skin?.length > 0 &&
                      currentProblem.Skin.map((sk, i) => (
                        <AppText key={`Skins ${i}`}> {sk}</AppText>
                      ))}

                    {currentProblem?.images?.length > 0 && (
                      <AppText>Pet Problem image</AppText>
                    )}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {currentProblem?.images?.length > 0 &&
                        currentProblem?.images.map((img, i) => (
                          <>
                            <Image
                              key={i + img}
                              // source={{
                              //   uri: `http://192.168.43.242:8000/img/${img}`,
                              // }}
                              source={{
                                uri: `${img}`,
                              }}
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
                )}
                {previousProblem?.length > 0 && (
                  <AppText>Previous Pet Problems:</AppText>
                )}
                {previousProblem?.length > 0 &&
                  previousProblem.map((pb, index) => (
                    <View key={pb._id} style={styles.cardBordered}>
                      <AppText>Problem: {pb.problem}</AppText>
                      <AppText>Doctor name: {pb.docname}</AppText>
                      <AppText>Time Period: {pb.time}</AppText>
                      <AppText>Appetite: {pb.Appetite}</AppText>
                      <AppText>Behaviour: {pb.Behaviour}</AppText>
                      <AppText>Eyes: {pb.Eyes}</AppText>
                      <AppText>Gait: {pb.Gait}</AppText>
                      <AppText>Mucous: {pb.Mucous}</AppText>
                      <AppText>Comment: {pb.comment}</AppText>
                      {pb.Ears?.length > 0 && (
                        <AppText style={{ fontSize: 22 }}>Ears: </AppText>
                      )}

                      {pb.Ears?.length > 0 &&
                        pb.Ears.map((er, i) => (
                          <AppText key={`${i}-Ears`}> {er}</AppText>
                        ))}

                      {pb.Feces?.length > 0 && (
                        <AppText style={{ fontSize: 22 }}>Faces: </AppText>
                      )}

                      {pb.Feces?.length > 0 &&
                        pb.Feces.map((fc, i) => (
                          <AppText key={`Feces ${i}`}> {fc}</AppText>
                        ))}
                      {pb.Urine?.length > 0 && (
                        <AppText style={{ fontSize: 22 }}>Urines: </AppText>
                      )}

                      {pb.Urine?.length > 0 &&
                        pb.Urine.map((ur, i) => (
                          <AppText key={`Urines ${i}`}> {ur}</AppText>
                        ))}
                      {pb.Skin?.length > 0 && (
                        <AppText style={{ fontSize: 22 }}>Skins: </AppText>
                      )}

                      {pb.Skin?.length > 0 &&
                        pb.Skin.map((sk, i) => (
                          <AppText key={`Skins ${i}`}> {sk}</AppText>
                        ))}

                      {pb?.images?.length > 0 && (
                        <AppText>Pet Problem image</AppText>
                      )}
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      >
                        {pb?.images?.length > 0 &&
                          pb?.images.map((img, i) => (
                            <>
                              <Image
                                key={i + img}
                                // source={{
                                //   uri: `http://192.168.43.242:8000/img/${img}`,
                                // }}
                                source={{
                                  uri: `${img}`,
                                }}
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
            </>
          )}
          <AppButton title='Close' onPress={() => refRBSheet.current.close()} />
        </ScrollView>
      </RBSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  card2: {
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

export default CallPendingScreen
