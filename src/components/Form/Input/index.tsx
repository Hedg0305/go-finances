import React from 'react'
import { TextInputProps } from 'react-native'

import { Container } from './styles'

type Props = TextInputProps

const Input = ({ ...rest }: Props) => {
  return <Container {...rest} />
}

export default Input
