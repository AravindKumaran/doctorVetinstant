import React, { useState, useEffect, useContext } from 'react'
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

import AppText from '../components/AppText'
import AuthContext from '../context/authContext'
import LoadingIndicator from '../components/LoadingIndicator'
import roomsApi from '../api/room'
import socket from '../components/utils/socket'

function getRandColor(brightness) {
  var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256]
  var mix = [brightness * 51, brightness * 51, brightness * 51]
  var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(
    function (x) {
      return Math.round(x / 2.0)
    }
  )
  return 'rgb(' + mixedrgb.join(',') + ')'
}

const PatientListScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getPatients = async () => {
      setLoading(true)
      const res = await roomsApi.getReceiverRoom(user._id)
      console.log(res.data.room)
      if (!res.ok) {
        setLoading(false)
        console.log(res)
        return
      }

      setPatients(res.data.room)
      setLoading(false)
    }
    getPatients()
  }, [])

  useEffect(() => {
    socket.on('pickCall', (data) => {
      console.log('home', data)
    })
    // socket.emit('callStart', user)
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        <LoadingIndicator visible={loading} />
        {patients.length === 0 && (
          <AppText>
            No Patients Have Contacted You!Please Comeback After Some Time
          </AppText>
        )}
        {patients.length > 0 &&
          patients.map((pat) => (
            <TouchableOpacity
              key={pat._id}
              style={styles.card}
              onPress={() => navigation.navigate('PatientDetails', { pat })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText style={styles.cardImg}>{pat.senderName[0]}</AppText>
                <AppText style={styles.cardText}>{pat.senderName}</AppText>
              </View>

              <Feather name='chevron-right' size={22} />
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 30,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 5,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardImg: {
    backgroundColor: `${getRandColor(Math.random() * 10)}`,
    color: `${getRandColor(Math.random() * 5)}`,
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: 'center',
    textTransform: 'capitalize',
    padding: 5,
    paddingTop: 6,
    fontWeight: 'bold',
  },
  cardText: {
    textTransform: 'capitalize',
    fontSize: 20,
  },
})

export default PatientListScreen
