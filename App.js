import 'react-native-gesture-handler'
import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'

import AuthContext from './app/context/authContext'
import authStorage from './app/components/utils/authStorage'
import usersApi from './app/api/users'

import AuthNavigator from './app/navigation/AuthNavigator'
import DrawerNavigator from './app/navigation/DrawerNavigator'

const App = () => {
  const [user, setUser] = useState()

  const restoreToken = async () => {
    const token = await authStorage.getToken()
    if (!token) return

    const userRes = await usersApi.getLoggedInUser()
    if (!userRes.ok) {
      setUser()
      return
    }
    setUser(userRes.data.user)
  }

  useEffect(() => {
    restoreToken()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        {user && user.role === 'doctor' && user.block === false ? (
          <DrawerNavigator />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default App
