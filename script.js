// Pages
const welcomePage = document.getElementById('welcome-page');
const trackerPage = document.getElementById('tracker-page');
const startBtn = document.getElementById('start-btn');

// Buttons and Inputs
const addBtn = document.getElementById('add-expense-btn');
const clearBtn = document.getElementById('clear-all-btn');
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const expenseCategory = document.getElementById('expense-category');
const expenseMonth = document.getElementById('expense-month');
const tableBody = document.querySelector('#expense-table tbody');
const totalExpenseEl = document.getElementById('total-expense');
const suggestionEl = document.getElementById('suggestion');

// Expense Data
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Show tracker page
startBtn.addEventListener('click', () => {
    welcomePage.classList.add('hidden');
    trackerPage.classList.remove('hidden');
    renderExpenses();
});

// Add Expense
addBtn.addEventListener('click', () => {
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;
    const month = expenseMonth.value;

    if (name === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter valid name and amount!');
        return;
    }

    const expense = { name, amount, category, month };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    expenseName.value = '';
    expenseAmount.value = '';
    renderExpenses();
});

// Clear All
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all expenses?')) {
        expenses = [];
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
    }
});

// Delete single expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
}

// Render Expenses
function renderExpenses() {
    tableBody.innerHTML = '';
    let total = 0;

    expenses.forEach((exp, index) => {
        total += exp.amount;
        const tr = document.createElement('tr');

        if (exp.amount > 10000) { // highlight big expenses
            tr.classList.add('highlight');
        }

        tr.innerHTML = `
            <td>${exp.name}</td>
            <td>₹${exp.amount.toFixed(2)}</td>
            <td>${exp.category}</td>
            <td>${exp.month}</td>
            <td><button onclick="deleteExpense(${index})">Delete</button></td>
        `;
        tableBody.appendChild(tr);
    });

    totalExpenseEl.textContent = `Total Expense: ₹${total.toFixed(2)}`;

    // Suggestion
    if (total > 45000) {
        suggestionEl.textContent = 'Warning: Monthly expenses are high!';
        suggestionEl.style.color = 'red';
    } else {
        suggestionEl.textContent = 'Good! You are within budget.';
        suggestionEl.style.color = 'green';
    }
}
