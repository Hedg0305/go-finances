import React from 'react'
import { RFValue } from 'react-native-responsive-fontsize'

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import SignInSocialButton from '../../components/SigninSocialButton'

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
          <SignInSocialButton title='Entrar com google' svg={GoogleSvg} />
          <SignInSocialButton title='Entrar com apple' svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  )
}

export default SignIn
