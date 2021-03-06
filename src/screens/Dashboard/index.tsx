import React, { useState, useEffect, useCallback } from 'react'
import HighlightCard from '../../components/HighlightCard'
import TransactionCard, {
  TransactionCardProps,
} from '../../components/TransactionCard'
import { ActivityIndicator } from 'react-native'

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
  LoadContainer,
} from './styles'
import { useFocusEffect } from '@react-navigation/core'
import { useTheme } from 'styled-components'
import { useAuth } from '../../hooks/auth'

interface HighlightProps {
  amount: string
  lastTransaction: string
}

interface Highlightdata {
  entries: HighlightProps
  expensives: HighlightProps
  total: HighlightProps
}
export interface DataListProps extends TransactionCardProps {
  id: string
}

export default function Dashboard() {
  const { signOut, user } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<DataListProps[]>([])
  const [highlightdata, setHighlightData] = useState({} as Highlightdata)

  const loadTransactions = async () => {
    const dataKey = `@gofinance:transactions_user:${user.id}`
    const response = await AsyncStorage.getItem(dataKey)

    const transactions = response ? JSON.parse(response) : []

    let entriesTotal = 0
    let expensiveTotal = 0

    const getLastTransactionDate = (
      collection: DataListProps[],
      type: 'positive' | 'negative'
    ) => {
      const collectionFiltered = collection.filter(
        (transaction) => transaction.type === type
      )

      if (collectionFiltered.length === 0) {
        return 0
      }

      const lastTransaction = new Date(
        Math.max.apply(
          Math,
          collection.map((transaction) => new Date(transaction.date).getTime())
        )
      )

      return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
        'pt-BR',
        { month: 'long' }
      )}`
    }

    const transactionsFromatted: DataListProps[] = transactions.map(
      (transaction: DataListProps) => {
        if (transaction.type === 'positive') {
          entriesTotal += Number(transaction.amount)
        } else {
          expensiveTotal += Number(transaction.amount)
        }
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
    setTransactions(transactionsFromatted)

    const lasTransactionEntries = getLastTransactionDate(
      transactions,
      'positive'
    )

    const lasTransactionExpensives = getLastTransactionDate(
      transactions,
      'negative'
    )

    const totalInterval =
      lasTransactionExpensives === 0
        ? 'N??o h?? transa????es'
        : `01 a ${lasTransactionExpensives}`

    const total = entriesTotal - expensiveTotal
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lasTransactionEntries === 0
            ? 'N??o h?? transa????es'
            : `??ltima entrada dia ${lasTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction:
          lasTransactionExpensives === 0
            ? 'N??o h?? transa????es'
            : `??ltima sa??da dia ${lasTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `??ltima sa??da dia ${totalInterval}`,
      },
    })

    setIsLoading(false)
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
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={useTheme().colors.primary} size='large' />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Ol??,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name='power' />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              title='Entradas'
              amount={highlightdata?.entries?.amount}
              lastTransaction={highlightdata?.entries?.lastTransaction}
              type='up'
            />
            <HighlightCard
              title='Saidas'
              amount={highlightdata?.expensives?.amount}
              lastTransaction={highlightdata?.expensives?.lastTransaction}
              type='down'
            />
            <HighlightCard
              title='Total'
              amount={highlightdata?.total?.amount}
              lastTransaction={highlightdata?.total?.lastTransaction}
              type='total'
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  )
}
