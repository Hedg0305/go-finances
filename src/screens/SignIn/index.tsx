import React from 'react'
import { Alert } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

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
  const { signInWithGoogle, signInWithApple } = useAuth()

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      console.log(err)

      Alert.alert('Não foi possível conectar a conta Google')
    }
  }
  const handleSignInWithApple = async () => {
    try {
      await signInWithApple()
    } catch (err) {
      console.log(err)

      Alert.alert('Não foi possível conectar a conta Apple')
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
          <SignInSocialButton
            title='Entrar com apple'
            svg={AppleSvg}
            onPress={handleSignInWithApple}
          />
        </FooterWrapper>
      </Footer>
    </Container>
  )
}

export default SignIn
