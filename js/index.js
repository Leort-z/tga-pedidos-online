import { formatter } from './utils.js'
import items from './items.json' assert { type: 'json' }

/* ======= LocalStorage API ======= */

const getItems = () => {
  return JSON.parse(localStorage.getItem('items'))
}

const handleSaveItems = (items) => {
  const itemsStr = JSON.stringify(items)
  localStorage.setItem('items', itemsStr)
}

/* ======= Items CRUD ======= */

const handleAddItem = (itemId) => {
  const currentItems = getItems() || {}
  const numCurrentItem = currentItems[itemId] ? currentItems[itemId] + 1 : 1

  const items = { ...currentItems, [itemId]: numCurrentItem }

  handleSaveItems(items)
  renderCartList()
}

const handleRemoveItem = (itemId) => {
  const currentItems = getItems() || {}
  const numCurrentItem = currentItems[itemId] - 1

  let items = { ...currentItems }
  if (numCurrentItem > 0) {
    items = { ...items, [itemId]: numCurrentItem }
  } else {
    items = handleDeleteItem(itemId)
  }

  handleSaveItems(items)
  renderCartList()
}

const handleDeleteItem = (itemId) => {
  const currentItems = getItems() || {}
  let items = { ...currentItems }

  delete items[itemId]
  document.getElementById(`list-item-${itemId}`).remove()

  handleSaveItems(items)
  renderCartList()

  return items
}

/* ======= DOM Manipulation ======= */

const renderItemsList = () => {
  const itemsList = document.getElementById('items-list')

  items.forEach(({ id, name, cost }) => {
    const item = document.createElement('li')

    const formattedCost = formatter.format(cost)
    item.innerHTML = `${name} - ${formattedCost}`
    const addButton = document.createElement('button')
    addButton.innerHTML = 'Adicionar ao carrinho'
    addButton.addEventListener('click', () => handleAddItem(id))
    item.append(addButton)
    itemsList.append(item)
  })
}

const renderCartList = () => {
  const cartItems = getItems() || []
  const cartList = document.getElementById('cart-list')

  let totalCost = 0

  for (const [key, quantity] of Object.entries(cartItems)) {
    let item = document.getElementById(`list-item-${key}`)
    const { name, cost } = items.find((item) => item.id == key)
    const formattedCost = formatter.format(cost)
    if (item) {
      item.innerHTML = `${name} - quantidade: ${quantity} - ${formattedCost}`
      appendButtons(item, key)
    } else {
      item = document.createElement('li')
      item.setAttribute('id', `list-item-${key}`)
      item.innerHTML = `${name} - quantidade: ${quantity} - ${formattedCost}`
      cartList.append(item)
      appendButtons(item, key)
    }

    totalCost += cost * quantity
  }

  const totalCostElement = document.getElementById('cart-item-total-cost')
  if (totalCostElement) {
    totalCostElement.innerHTML = `Total do pedido: ${formatter.format(totalCost)}`
  } else {
    const totalCostElement = document.createElement('h4')
    totalCostElement.setAttribute('id', 'cart-item-total-cost')
    totalCostElement.innerHTML = `Total do pedido: ${formatter.format(totalCost)}`
    const cartListHeader = document.getElementById('cart-list-wrapper')
    cartListHeader.append(totalCostElement)
  }
}

const appendButtons = (item, key) => {
  const addButton = document.createElement('button')
  addButton.innerHTML = '+'
  addButton.addEventListener('click', () => handleAddItem(key))
  item.append(addButton)

  const removeButton = document.createElement('button')
  removeButton.innerHTML = '-'
  removeButton.addEventListener('click', () => handleRemoveItem(key))
  item.append(removeButton)

  const deleteButton = document.createElement('button')
  deleteButton.innerHTML = 'X'
  deleteButton.addEventListener('click', () => handleDeleteItem(key))
  item.append(deleteButton)
}

const app = () => {
  renderItemsList()
  renderCartList()
}

app()
