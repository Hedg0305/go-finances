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
import { LastTransaction } from '../../components/HighlightCard/styles'

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
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<DataListProps[]>([])
  const [highlightdata, setHighlightData] = useState({} as Highlightdata)

  const loadTransactions = async () => {
    const dataKey = '@gofinance:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    let entriesTotal = 0
    let expensiveTotal = 0

    const getLastTransactionDate = (
      collection: DataListProps[],
      type: 'positive' | 'negative'
    ) => {
      const lastTransactionEntrie = Math.max.apply(
        Math,
        collection
          .filter((transaction: DataListProps) => transaction.type === type)
          .map((transaction: DataListProps) =>
            new Date(transaction.date).getTime()
          )
      )

      return Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
      }).format(new Date(lastTransactionEntrie))
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

    const totalInterval = `01 a ${lasTransactionExpensives}`

    const total = entriesTotal - expensiveTotal
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última entrada dia ${lasTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última saída dia ${lasTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última saída dia ${totalInterval}`,
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
