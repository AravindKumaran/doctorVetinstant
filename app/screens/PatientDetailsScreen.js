import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, ScrollView, Image, Alert } from 'react-native'
import AppButton from '../components/AppButton'

import petsApi from '../api/pets'

import LoadingIndicator from '../components/LoadingIndicator'
import AppText from '../components/AppText'

const PatientDetailsScreen = ({ navigation, route }) => {
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(false)

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
                        // source={{
                        //   uri: `http://192.168.43.242:8000/img/${pbm.img}`,
                        // }}
                        source={{
                          uri: `${pbm.img}`,
                        }}
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
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
          <AppButton
            title='Chat'
            onPress={() =>
              navigation.navigate('Chat', { pat: route.params.pat })
            }
          />
          {/* <AppButton title='Video Call' onPress={handleVideoCall} /> */}
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
