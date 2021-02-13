import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import DoctorScreen from '../screens/DoctorScreen'
import PrescriptionScreen from '../screens/PrescriptionScreen'
import ScheduleCallScreen from '../screens/ScheduleCallScreen'
import CallLogScreen from '../screens/CallLogScreen'

import AppNavigator from './AppNavigator'

import DrawerContent from '../components/DrawerContent'

const Stack = createStackNavigator()

const CallLogNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#d8d8d8',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name='CallLog'
        component={CallLogScreen}
        options={{
          title: 'Call Log',

          headerTintColor: 'black',
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
      <Stack.Screen name='ScheduleCall' component={ScheduleCallScreen} />
    </Stack.Navigator>
  )
}

const Drawer = createDrawerNavigator()

const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#d8d8d8',
        paddingLeft: 20,
      },
      headerTitleAlign: 'center',
    }}
    backBehavior={'order'}
    // drawerType={"slide"}
    drawerContentOptions={{
      activeBackgroundColor: '#f2f2f2',
      activeTintColor: '#000000',
      labelStyle: { fontSize: 18 },
      itemStyle: {
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 10,
      },
    }}
    drawerStyle={{
      borderTopRightRadius: 30,
      borderBottomRightRadius: 30,
    }}
    drawerContent={(props) => <DrawerContent {...props} />}
  >
    <Drawer.Screen
      name='Home'
      component={AppNavigator}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name='home' size={size} color={color} />
        ),
      }}
    />
    {/* <Drawer.Screen
      name='Doctor'
      component={DoctorScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name='plus-circle' size={size} color={color} />
        ),
        headerShown: true,
        unmountOnBlur: true,
      }}
    /> */}
    <Drawer.Screen
      name='Prescription'
      component={PrescriptionScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name='dollar-sign' size={size} color={color} />
        ),
        headerShown: true,
        unmountOnBlur: true,
      }}
    />
    <Drawer.Screen
      name='CallLog'
      component={CallLogNavigator}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name='phone' size={size} color={color} />
        ),
        headerShown: false,
        unmountOnBlur: true,
      }}
    />
    {/* <Drawer.Screen
      name='Help'
      component={AppNavigator}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name='help-circle' size={size} color={color} />
        ),
      }}
    /> */}
  </Drawer.Navigator>
)

export default DrawerNavigator
