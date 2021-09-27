import React from 'react'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import HighlightCard from '../../components/HighlightCard'
import TransactionCard, {
  TransactionCardProps,
} from '../../components/TransactionCard'

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

export interface DataListProps extends TransactionCardProps {
  id: string
}

export default function Dashboard() {
  const data: DataListProps[] = [
    {
      id: '1',
      amount: 'R$ 16.000',
      title: 'Desenvolvimento de site',
      category: { name: 'vendas', icon: 'dollar-sign' },
      date: '13/04/2020',
      type: 'positive',
    },
    {
      id: '2',
      amount: 'R$ 59,00',
      title: 'Hamburger pix',
      category: { name: 'Alimentação', icon: 'coffee' },
      date: '13/04/2020',
      type: 'negative',
    },
    {
      id: '3',
      amount: 'R$ 1.200,00',
      title: 'Aluguel do apartamento',
      category: { name: 'Casa', icon: 'shopping-bag' },
      date: '13/04/2020',
      type: 'negative',
    },
  ]

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
