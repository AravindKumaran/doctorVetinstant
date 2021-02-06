import React from 'react'
import { TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from '../screens/HomeScreen'
import DoctorScreen from '../screens/DoctorScreen'
import DoctorDetailsScreen from '../screens/DoctorDetailsScreen'
import PatientScreen from '../screens/PatientScreen'
import ChatScreen from '../screens/ChatScreen'
import PatientListScreen from '../screens/PatientListScreen'
import PatientDetailsScreen from '../screens/PatientDetailsScreen'
import VideoCallScreen from '../screens/VideoCallScreen'

import { Feather } from '@expo/vector-icons'

const Stack = createStackNavigator()

const AppNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#d8d8d8', //Set Header color
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          title: 'Home', //Set Header Title

          headerTintColor: 'black', //Set Header text color
          headerTitleStyle: {
            fontSize: 22,
          },

          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Feather
                name='menu'
                size={25}
                color='#000'
                style={{
                  marginLeft: 10,
                  paddingLeft: 20,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name='Doctor' component={DoctorScreen} />
      <Stack.Screen name='DoctorDetails' component={DoctorDetailsScreen} />
      <Stack.Screen name='Patient' component={PatientScreen} />
      <Stack.Screen name='PatientDetails' component={PatientDetailsScreen} />
      <Stack.Screen name='Chat' component={ChatScreen} />
      <Stack.Screen name='PatientList' component={PatientListScreen} />
      <Stack.Screen name='VideoCall' component={VideoCallScreen} />
    </Stack.Navigator>
  )
}

export default AppNavigator
