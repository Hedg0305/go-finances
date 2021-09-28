import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HistoryCard from '../../components/HistoryCard'

import { Container, Header, Title, Content } from './styles'
import { categories } from '../../utils/categories'

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
  total: string
  color: string
}

const Resume = () => {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const loadData = async () => {
    const dataKey = '@gofinance:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const responseFormatted = response ? JSON.parse(response) : []

    const expensives = responseFormatted.filter(
      (expensives: TransactionData) => expensives.type === 'negative'
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
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
        totalByCategory.push({
          name: category.name,
          total,
          color: category.color,
          key: category.key,
        })
      }
    })

    setTotalByCategories(totalByCategory)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      <Content>
        {totalByCategories.map((item) => {
          return (
            <HistoryCard
              title={item.name}
              amount={item.total}
              color={item.color}
              key={item.key}
            />
          )
        })}
      </Content>
    </Container>
  )
}

export default Resume
