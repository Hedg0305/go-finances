import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SignIn from '../screens/SignIn'

const { Navigator, Screen } = createStackNavigator()

const AuthRouts = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name='SignIn' component={SignIn} />
    </Navigator>
  )
}

export default AuthRouts
