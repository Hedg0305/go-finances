import React, { useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HistoryCard from '../../components/HistoryCard'
import { VictoryPie } from 'victory-native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from './styles'
import { categories } from '../../utils/categories'
import { RFValue } from 'react-native-responsive-fontsize'
import { useTheme } from 'styled-components'
import { ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth'

interface TransactionData {
  type: 'positive' | 'negative'
  name: string
  amount: string
  category: string
  date: string
}

interface CategoryData {
  key: string
  name: string
  totalFormatted: string
  total: number
  color: string
  percent: string
}

const Resume = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const { user } = useAuth()

  const handleDateChange = (action: 'next' | 'previous') => {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1))
    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  const loadData = async () => {
    setIsLoading(true)

    const dataKey = `@gofinance:transactions_user:${user.id}`
    const response = await AsyncStorage.getItem(dataKey)
    const responseFormatted = response ? JSON.parse(response) : []

    const expensives = responseFormatted.filter(
      (expensives: TransactionData) =>
        expensives.type === 'negative' &&
        new Date(expensives.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensives.date).getFullYear() === selectedDate.getFullYear()
    )

    const expensiveTotal = expensives.reduce(
      (acumulator: number, expensive: TransactionData) => {
        return acumulator + Number(expensive.amount)
      },
      0
    )

    const totalByCategory: CategoryData[] = []

    categories.forEach((category) => {
      let categorySum = 0

      expensives.forEach((exp: TransactionData) => {
        if (exp.category === category.key) {
          categorySum += Number(exp.amount)
        }
      })
      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })

        const percent = `${((categorySum / expensiveTotal) * 100).toFixed(0)}%`

        totalByCategory.push({
          name: category.name,
          total: categorySum,
          color: category.color,
          key: category.key,
          totalFormatted,
          percent,
        })
      }
    })

    setTotalByCategories(totalByCategory)
    setIsLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [selectedDate])
  )

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={useTheme().colors.primary} size='large' />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('previous')}>
              <MonthSelectIcon name='chevron-left' />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name='chevron-right' />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x='percent'
              y='total'
              colorScale={totalByCategories.map((category) => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: useTheme().colors.shape,
                },
              }}
              labelRadius={50}
            />
          </ChartContainer>

          {totalByCategories.map((item) => {
            return (
              <HistoryCard
                title={item.name}
                amount={item.totalFormatted}
                color={item.color}
                key={item.key}
              />
            )
          })}
        </Content>
      )}
    </Container>
  )
}

export default Resume
