import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthRouts from './auth.routes'
import { useAuth } from '../hooks/auth'
import AppRoutes from './app.routes'

const Routes = () => {
  const { user } = useAuth()

  return (
    <NavigationContainer>
      {user.id ? <AppRoutes /> : <AuthRouts />}
    </NavigationContainer>
  )
}

export default Routes
