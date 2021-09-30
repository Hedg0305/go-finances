import React, { useState } from 'react'
import { Alert, ActivityIndicator, Platform } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useTheme } from 'styled-components'

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import SignInSocialButton from '../../components/SigninSocialButton'
import { useAuth } from '../../hooks/auth'

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SigninTitle,
  Footer,
  FooterWrapper,
} from './styles'

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithGoogle, signInWithApple } = useAuth()
  const theme = useTheme()

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true)
      return await signInWithGoogle()
    } catch (err) {
      console.log(err)

      Alert.alert('Não foi possível conectar a conta Google')
      setIsLoading(false)
    }
  }
  const handleSignInWithApple = async () => {
    try {
      setIsLoading(true)
      return await signInWithApple()
    } catch (err) {
      console.log(err)

      Alert.alert('Não foi possível conectar a conta Apple')
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
        </TitleWrapper>
        <Title>
          Controle suas {`\n`} finanças de forma{`\n`} muito simples
        </Title>
        <SigninTitle>
          Faça seu login {`\n`}
          com uma das contas abaixo
        </SigninTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            title='Entrar com google'
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />

          {Platform.OS === 'ios' && (
            <SignInSocialButton
              title='Entrar com apple'
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>

        {isLoading && (
          <ActivityIndicator
            color={theme.colors.primary}
            style={{ marginTop: 18 }}
          />
        )}
      </Footer>
    </Container>
  )
}

export default SignIn
