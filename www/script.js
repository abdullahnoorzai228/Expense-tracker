const themeToggle = document.getElementById("theme-toggle");
const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transaction")) || [];
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  
  if (currentTheme === "dark") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  }
});
transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();

  const description = descriptionEl.value.trim();

  const amount = parseFloat(amountEl.value);


  transactions.push({
    id: Date.now(),
    description,
    amount
  });

  localStorage.setItem("transaction", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();

  transactionFormEl.reset();
}

function updateTransactionList() {
  transactionListEl.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}


function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction")
  li.classList.add(transaction.amount > 0 ? "income" : "expenses");

  li.innerHTML = `
    <span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">🗑</button>
    ${formatCurrency(transaction.amount)}
    </span>
    <span>${transaction.description}</span>
  `;


  return li;
}

function updateSummary() {

  const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  const income = transactions
    .filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expense = transactions
    .filter(transaction => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);


  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expense);
}

function formatCurrency(number) {
  return "؋" + new Intl.NumberFormat("en-US").format(number);
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id)

  localStorage.setItem("transaction", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();
}

updateTransactionList();
updateSummary();
