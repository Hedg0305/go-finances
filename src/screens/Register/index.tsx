import React, { useState, useEffect } from 'react'
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import uuid from 'react-native-uuid'
import { useNavigation } from '@react-navigation/native'

import Button from '../../components/Form/Buttom'
import CategorySelectButton from '../../components/Form/CategorySelectButton'
import InputForm from '../../components/Form/InputForm'

import TransactionTypeButton from '../../components/Form/TransactionTypeButton'
import CategorySelect from '../CategorySelect'

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface FormData {
  name: string
  amount: number
}

type NavigationProps = {
  navigate: (screen: string) => void
}

const schema = Yup.object()
  .shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number()
      .typeError('Informe um valor numérico')
      .positive('O valor não pode ser nagativo')
      .required('Valor obrigatório'),
  })
  .required()

const Register = () => {
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })
  const navigation = useNavigation<NavigationProps>()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) })

  function handleTransactionTypesSelect(type: 'positive' | 'negative') {
    setTransactionType(type)
  }

  function handleCloseSelectCategory() {
    setCategoryModalOpen(false)
  }

  function handleOpenSelectCategory() {
    setCategoryModalOpen(true)
  }

  const handleRegister = async (form: FormData) => {
    const dataKey = '@gofinance:transactions'

    if (!transactionType) return Alert.alert('Selecione o tipo da transação')

    if (category.key === 'category')
      return Alert.alert('Selecione uma categoria')

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const data = await AsyncStorage.getItem(dataKey)
      const currentData = data ? JSON.parse(data) : []

      const dataFormatted = [...currentData, newTransaction]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

      reset()
      setTransactionType('')
      setCategory({ key: 'category', name: 'Categoria' })
      navigation.navigate('Listagem')
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível salvar')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              control={control}
              name='name'
              placeholder='Nome'
              autoCapitalize='sentences'
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              control={control}
              name='amount'
              placeholder='Preço'
              keyboardType='numeric'
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                type='up'
                title='Income'
                isActive={transactionType === 'positive'}
                onPress={() => handleTransactionTypesSelect('positive')}
              />
              <TransactionTypeButton
                type='down'
                title='Outcome'
                isActive={transactionType === 'negative'}
                onPress={() => handleTransactionTypesSelect('negative')}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategory}
            />
          </Fields>
          <Button title='Enviar' onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectorCategory={handleCloseSelectCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}

export default Register
