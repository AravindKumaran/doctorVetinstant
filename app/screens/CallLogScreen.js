import React, { useState, useEffect, useContext } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Feather } from '@expo/vector-icons'

import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import callLogsApi from '../api/callLog'
import AuthContext from '../context/authContext'
import LoadingIndicator from '../components/LoadingIndicator'

const CallLogScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [missedCall, setMissedCall] = useState([])
  const [completedCall, setCompletedCall] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const getMissedCall = async () => {
      setLoading(true)
      const res = await callLogsApi.getCallLog(user._id)
      if (!res.ok) {
        setLoading(false)
        console.log('Call', res)
        return
      }
      const callLogsArray = res.data.callLogs
      callLogsArray.forEach((log) => {
        if (log.callPending) {
          setMissedCall((prevLog) => [...prevLog, log])
        } else {
          setCompletedCall((prevLog) => [...prevLog, log])
        }
      })
      setLoading(false)
    }

    getMissedCall()
  }, [])
  return (
    <ScrollView>
      <LoadingIndicator visible={loading} />
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <Feather
            style={{ marginLeft: 25 }}
            name='phone-missed'
            size={22}
            color='#af8282'
          />
          <AppText style={{ fontSize: 25, paddingLeft: 5, color: '#000' }}>
            Missed Call
          </AppText>
        </View>

        {missedCall.map((call) => (
          <View style={styles.card} key={call._id}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <AppText
                style={{
                  textTransform: 'capitalize',
                  fontSize: 20,
                  color: '#344247',
                }}
              >
                {call.senderId.name}
              </AppText>
              <AppButton
                title='Schedule'
                onPress={() => navigation.navigate('ScheduleCall', { call })}
                style={{
                  width: 150,
                  marginTop: 5,
                  borderRadius: 100,
                  padding: 7,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather
                  style={{ marginLeft: 15 }}
                  name='calendar'
                  size={22}
                  color='#D1D5da'
                />
                <AppText>
                  {new Date(call.updatedAt).toLocaleDateString()}
                </AppText>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather
                  style={{ marginLeft: 15 }}
                  name='clock'
                  size={22}
                  color='#D1D5da'
                />
                <AppText>
                  {new Date(call.updatedAt).toLocaleTimeString()}
                </AppText>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.titleWrapper}>
          <Feather
            style={{ marginLeft: 25 }}
            name='phone'
            size={22}
            color='#af8282'
          />
          <AppText style={{ fontSize: 25, paddingLeft: 5, color: '#000' }}>
            Completed Call
          </AppText>
        </View>
        {completedCall.map((call) => (
          <View style={styles.card} key={call._id}>
            <AppText
              style={{
                textTransform: 'capitalize',
                fontSize: 20,
                color: '#344247',
              }}
            >
              {call.senderId.name}
            </AppText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather
                  style={{ marginLeft: 15 }}
                  name='calendar'
                  size={22}
                  color='#D1D5da'
                />
                <AppText>
                  {new Date(call.updatedAt).toLocaleDateString()}
                </AppText>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather
                  style={{ marginLeft: 15 }}
                  name='clock'
                  size={22}
                  color='#D1D5da'
                />
                <AppText>
                  {new Date(call.updatedAt).toLocaleTimeString()}
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
})

export default CallLogScreen
