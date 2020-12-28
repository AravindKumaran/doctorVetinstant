import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import AppButton from '../components/AppButton'
import AppText from '../components/AppText'
import AuthContext from '../context/authContext'
import authStorage from '../components/utils/authStorage'

const HomeScrren = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext)

  const handleLogout = () => {
    setUser()
    authStorage.removeToken()
  }

  return (
    <View style={styles.container}>
      <AppText>Welcome Doctor {user ? user.name.split(' ')[0] : ''}</AppText>
      <AppButton title='Logout' onPress={handleLogout} />
      <AppButton
        title='View History'
        onPress={() => navigation.navigate('Patient')}
      />
      <AppButton
        title='View Doctor Details'
        onPress={() => navigation.navigate('DoctorDetails')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
})

export default HomeScrren
