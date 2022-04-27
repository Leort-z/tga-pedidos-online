const handleSaveItems = (items) => {
  const itemsStr = JSON.stringify(items)
  localStorage.setItem('items', itemsStr)
}

const handleAddItem = (itemId) => {
  const items = getItems() || []
  items.push(itemId)
  handleSaveItems(items)
}

const getItems = () => {
  return JSON.parse(localStorage.getItem('items'))
}
