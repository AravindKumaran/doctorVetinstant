import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import DoctorScreen from '../screens/DoctorScreen'
import PrescriptionScreen from '../screens/PrescriptionScreen'
import AppNavigator from './AppNavigator'

import DrawerContent from '../components/DrawerContent'

import { Feather } from '@expo/vector-icons'

// const Stack = createStackNavigator();
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
    <Drawer.Screen
      name='Doctor'
      component={DoctorScreen}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name='plus-circle' size={size} color={color} />
        ),
        headerShown: true,
        unmountOnBlur: true,
      }}
    />
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
      name='Help'
      component={AppNavigator}
      options={{
        drawerIcon: ({ color, size }) => (
          <Feather name='help-circle' size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
)

export default DrawerNavigator
