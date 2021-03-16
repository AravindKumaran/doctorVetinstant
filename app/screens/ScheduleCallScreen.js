import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'
import { Feather } from '@expo/vector-icons'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import scheduledCallsApi from '../api/scheduledCall'
import pendingsApi from '../api/callPending'

const ScheduleCallScreen = ({ navigation, route }) => {
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  console.log('Ddd', route?.params?.sdata)

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
  }

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode('date')
  }

  const showTimepicker = () => {
    showMode('time')
  }

  const handlePress = async () => {
    if (route?.params?.scheduled) {
      const npCall = {
        ...route?.params?.sdata,
        status: 'scheduled',
        extraInfo: `${date}`,
      }
      // console.log('Callssd', npCall)
      setLoading(true)
      const pRes = await pendingsApi.updateCallPending(
        route?.params?.sdata._id,
        npCall
      )
      if (!pRes.ok) {
        console.log('Error', pRes)
        setLoading(false)
        return
      }
      const data = {
        date,
        userId: route?.params?.sdata.userId,
        doctorId: route?.params?.sdata.docId,
        doctorName: route?.params?.sdata.docName,
      }

      const res = await scheduledCallsApi.createScheduledCall(data)
      if (!res.ok) {
        setLoading(false)
        console.log('Res', res)
        return
      }
      alert('Your call has been scheduled!')
      setLoading(false)
      navigation.navigate('CallLog')
    } else {
      const data = {
        date,
        userId: route.params.call.senderId._id,
        doctorId: route.params.call.receiverId._id,
        doctorName: route.params.call.receiverId.name,
      }

      // console.log('Data', data)

      setLoading(true)

      const res = await scheduledCallsApi.createScheduledCall(data)
      if (!res.ok) {
        setLoading(false)
        console.log('Res', res)
        return
      }

      console.log('res', res)
      setLoading(false)

      alert('Your call has been scheduled!')
      navigation.goBack()
    }
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <AppText>Choose Date</AppText>
        <TouchableOpacity onPress={showDatepicker} style={styles.dateTime}>
          <Feather
            name='calendar'
            size={25}
            color='#6e6969'
            style={styles.icon}
          />
          <AppText style={styles.text}>{date.toLocaleDateString()}</AppText>
        </TouchableOpacity>

        <AppText>Choose Time</AppText>

        <TouchableOpacity onPress={showTimepicker} style={styles.dateTime}>
          <Feather name='clock' size={25} color='#6e6969' style={styles.icon} />
          <AppText style={styles.text}>{date.toLocaleTimeString()}</AppText>
        </TouchableOpacity>

        <AppText style={{ fontSize: 15, marginBottom: 15, color: '#DC143C' }}>
          *Time must be greater than current time for successful reminder
        </AppText>

        {show && (
          <DateTimePicker
            testID='dateTimePicker'
            value={date}
            mode={mode}
            is24Hour={true}
            display='default'
            onChange={onChange}
            neutralButtonLabel='clear'
            minimumDate={new Date()}
            // dateFormat={ShowCurrentDate}
            // dateFormat='dd/MM/yyyy'
          />
        )}

        <AppButton title='Schedule Call' onPress={handlePress} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    marginVertical: 30,
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
  },
  icon: {
    marginRight: 20,
    marginLeft: 10,
  },
  text: {
    fontSize: 20,
    color: '#0c0c0c',
    flex: 1,
  },
})

export default ScheduleCallScreen
