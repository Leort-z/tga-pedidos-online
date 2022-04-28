import { formatter } from "./utils.js";
import items from "./items.json" assert { type: "json" };

/* ======= LocalStorage API ======= */

const getItems = () => {
  return JSON.parse(localStorage.getItem("items"));
};

const handleSaveItems = (items) => {
  const itemsStr = JSON.stringify(items);
  localStorage.setItem("items", itemsStr);
};

/* ======= Items CRUD ======= */

const handleAddItem = (itemId) => {
  const currentItems = getItems() || {};
  const numCurrentItem = currentItems[itemId] ? currentItems[itemId] + 1 : 1;

  const items = { ...currentItems, [itemId]: numCurrentItem };

  handleSaveItems(items);
  renderCartList();
};

const handleRemoveItem = (itemId) => {
  const currentItems = getItems() || {};
  const numCurrentItem = currentItems[itemId] - 1;

  let items = { ...currentItems };
  if (numCurrentItem > 0) {
    items = { ...items, [itemId]: numCurrentItem };
  } else {
    items = handleDeleteItem(itemId);
  }

  handleSaveItems(items);
  renderCartList();
};

const handleDeleteItem = (itemId) => {
  const currentItems = getItems() || {};
  let items = { ...currentItems };

  delete items[itemId];
  document.getElementById(`list-item-${itemId}`).remove();

  handleSaveItems(items);
  renderCartList();

  return items;
};

/* ======= DOM Manipulation ======= */

const renderItemsList = () => {
  const itemsList = document.getElementById("items-list");

  items.forEach(({ id, name, cost, img }) => {
    const item = document.createElement("li");

    const formattedCost = formatter.format(cost);
    item.innerHTML = `
      <div class="img-prod-wrapper">
        <img src="${img}" class="img-prod" />
      </div>
    `;

    const divHeader = document.createElement("div");
    divHeader.className = "header-prod-wrapper";

    const divTitle = document.createElement("div");
    divTitle.className = "title-prod-wrapper";

    const spanTitle = document.createElement("span");
    spanTitle.className = "title-prod";
    spanTitle.innerHTML = name;
    divTitle.append(spanTitle);

    const spanCost = document.createElement("span");
    spanCost.className = "cost-prod";
    spanCost.innerHTML = formattedCost;
    divTitle.append(spanCost);

    divHeader.append(divTitle);

    const divButton = document.createElement("div");
    divButton.className = "actions-prod-wrapper";

    const addButton = document.createElement("button");
    addButton.innerHTML = "ADICIONAR AO CARRINHO";
    addButton.addEventListener("click", () => handleAddItem(id));

    divButton.append(addButton);
    divHeader.append(divButton);

    item.append(divHeader);

    itemsList.append(item);
  });
};

const renderCartList = () => {
  const cartItems = getItems() || [];
  const cartList = document.getElementById("cart-list");

  let totalCost = 0;

  for (const [key, quantity] of Object.entries(cartItems)) {
    let item = document.getElementById(`list-item-${key}`);
    const { name, cost } = items.find((item) => item.id == key);
    const formattedCost = formatter.format(cost);
    if (item) {
      item.innerHTML = `<strong>${name}</strong><br>Quantidade: ${quantity}<br>${formattedCost}`;
      appendButtons(item, key);
    } else {
      item = document.createElement("li");
      item.setAttribute("id", `list-item-${key}`);
      item.innerHTML = `<strong>${name}</strong><br>Quantidade: ${quantity}<br>${formattedCost}`;
      cartList.append(item);
      appendButtons(item, key);
    }

    totalCost += cost * quantity;
  }

  const totalCostElement = document.getElementById("cart-item-total-cost");
  if (totalCostElement) {
    totalCostElement.innerHTML = `Total do pedido: ${formatter.format(
      totalCost
    )}`;
  } else {
    const totalCostElement = document.createElement("h4");
    totalCostElement.setAttribute("id", "cart-item-total-cost");
    totalCostElement.innerHTML = `Total do pedido: ${formatter.format(
      totalCost
    )}`;
    const cartListHeader = document.getElementById("cart-list-wrapper");
    cartListHeader.append(totalCostElement);
  }
};

const appendButtons = (item, key) => {
  const div = document.createElement("div");
  div.className = "actions-wrapper";

  const addButton = document.createElement("button");
  addButton.innerHTML = "+";
  addButton.className = "btn-prod btn-add-prod";
  addButton.title = "Adicionar 1";
  addButton.addEventListener("click", () => handleAddItem(key));
  div.append(addButton);

  const removeButton = document.createElement("button");
  removeButton.innerHTML = "-";
  removeButton.className = "btn-prod btn-remove-prod";
  removeButton.title = "Remover 1";
  removeButton.addEventListener("click", () => handleRemoveItem(key));
  div.append(removeButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "x";
  deleteButton.className = "btn-prod btn-delete-prod";
  deleteButton.title = "Deletar produto";
  deleteButton.addEventListener("click", () => handleDeleteItem(key));
  div.append(deleteButton);

  item.append(div);
};

const app = () => {
  renderItemsList();
  renderCartList();
};

app();
