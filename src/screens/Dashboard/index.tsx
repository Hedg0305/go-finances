import React, { useState, useEffect, useCallback } from 'react'
import HighlightCard from '../../components/HighlightCard'
import TransactionCard, {
  TransactionCardProps,
} from '../../components/TransactionCard'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  UserGreeting,
  UserName,
  User,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from './styles'
import { useFocusEffect } from '@react-navigation/core'

export interface DataListProps extends TransactionCardProps {
  id: string
}

export default function Dashboard() {
  const [data, setData] = useState<DataListProps[]>([])

  const loadTransactions = async () => {
    const dataKey = '@gofinance:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    const transactionsFromatted: DataListProps[] = transactions.map(
      (transaction: DataListProps) => {
        const amount = Number(transaction.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(transaction.date))

        return {
          id: transaction.id,
          name: transaction.name,
          amount,
          type: transaction.type,
          category: transaction.category,
          date,
        }
      }
    )

    setData(transactionsFromatted)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadTransactions()
    }, [])
  )

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://github.com/Hedg0305.png' }} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Rodrigo</UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={() => {}}>
            <Icon name='power' />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          title='Entradas'
          amount='R$ 17.400,00'
          lastTransaction='Última entrada dia 13 de Abril de 2021'
          type='up'
        />
        <HighlightCard
          title='Saidas'
          amount='R$ 900,53'
          lastTransaction='Última entrada dia 13 de Abril de 2021'
          type='down'
        />
        <HighlightCard
          title='Total'
          amount='R$ 16.000,00'
          lastTransaction='Última entrada dia 13 de Abril de 2021'
          type='total'
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  )
}
