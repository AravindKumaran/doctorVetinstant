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

const ScheduleCallScreen = ({ navigation, route }) => {
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  // const [currentDate, setCurrentDate] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setShow(Platform.OS === 'ios')
    setDate(currentDate)
    // moment(selectedDate).format('YYYY-MM-DD')
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

  // useEffect(() => {
  //   var date = new Date().getDate();
  //   var month = new Date().getMonth() + 1;
  //   var year = new Date().getFullYear();
  //   setDate(
  //     date + '/' + month + '/' + year 
  //   );
  // }, []);

  // const ShowCurrentDate = () => {
  //   var date = new Date().getDate();
  //   var month = new Date().getMonth() + 1;
  //   var year = new Date().getFullYear();
  //   console.log(date + '/' + month + '/' + year);
  //  }

  const handlePress = async () => {
    const data = {
      date,
      userId: route.params.call.senderId._id,
      doctorId: route.params.call.receiverId._id,
      doctorName: route.params.call.receiverId.name,
    }

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
