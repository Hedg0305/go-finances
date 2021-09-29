import 'react-native-gesture-handler'
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import React from 'react'
import { ThemeProvider } from 'styled-components'
import AppLoading from 'expo-app-loading'
import { StatusBar } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'

import Dashboard from './src/screens/Dashboard'
import theme from './src/global/styles/theme'
import Register from './src/screens/Register'
import CategorySelect from './src/screens/CategorySelect'
import AppRoutes from './src/routes/app.routes'

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle='light-content' />
        <AppRoutes />
      </NavigationContainer>
    </ThemeProvider>
  )
}
