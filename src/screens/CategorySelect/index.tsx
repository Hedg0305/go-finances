import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import Button from '../../components/Form/Buttom'
import { categories } from '../../utils/categories'

import {
  Container,
  Header,
  HeaderTitle,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles'

interface Category {
  key: string
  name: string
}

interface Props {
  category: Category
  setCategory: (category: Category) => void
  closeSelectorCategory: () => void
}

const CategorySelect = ({
  category,
  setCategory,
  closeSelectorCategory,
}: Props) => {
  const handleCategorySelect = (category: Category) => {
    setCategory(category)
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Categoria</HeaderTitle>
      </Header>
      <FlatList
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => setCategory(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />

            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <Button title='Selecionar' onPress={closeSelectorCategory} />
      </Footer>
    </Container>
  )
}

export default CategorySelect
