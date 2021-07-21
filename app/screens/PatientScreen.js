import React, { useState, useEffect, useContext } from 'react'

import { ScrollView, StyleSheet, View } from 'react-native'

import doctorsApi from '../api/doctors'
import AppText from '../components/AppText'
import AuthContext from '../context/authContext'
import LoadingIndicator from '../components/LoadingIndicator'

const PatientScreen = () => {
  const { user } = useContext(AuthContext)

  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getAllPatients = async () => {
      setLoading(true)
      const res = await doctorsApi.getLoggedInDoctor(user._id)
      if (!res.ok) {
        setLoading(false)
        // console.log(res);
        return
      }
      setPatients(res.data.doctor.patientDetails)
      setLoading(false)
    }

    getAllPatients()
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        <LoadingIndicator visible={loading} />
        {patients.length === 0 ? (
          <AppText style={{ textAlign: 'center' }}>No Patients Found!</AppText>
        ) : (
          <>
            <AppText
              style={{ textAlign: 'center', fontSize: 22, marginBottom: 20 }}
            >
              Your Patients Details
            </AppText>
            {patients.map((pat, index) => (
              <View key={index} style={styles.card}>
                <AppText>Name: {pat.name}</AppText>
                <AppText>Problem: {pat.problem}</AppText>
                <AppText>PetName: {pat.petname}</AppText>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 20,
    borderRadius: 5,
  },
})

export default PatientScreen
