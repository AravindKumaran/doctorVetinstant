import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Image } from 'react-native'
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
    <ScrollView style={styles.container}>
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
            <AppText>Pet Type: {pet.type} </AppText>
            {pet.petHistoryImages.length > 0 && (
              <>
                <AppText>Pet History Images: </AppText>
                <ScrollView horizontal style={{ marginVertical: 20 }}>
                  {pet.petHistoryImages.map((img, i) => (
                    <View key={`${img}-${i}`} style={{ marginRight: 20 }}>
                      <Image
                        source={{
                          uri: `https://vetinstantbe.azurewebsites.net/api/v1${img}`,
                        }}
                        style={{ width: 150, height: 150, borderRadius: 75 }}
                      />
                    </View>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
          <AppButton
            title='Chat'
            onPress={() =>
              navigation.navigate('Chat', { pat: route.params.pat })
            }
          />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
    marginHorizontal: 30,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
})

export default PatientDetailsScreen
