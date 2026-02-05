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

// Expense Data (from localStorage or empty array)
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
        alert('Please enter a valid name and amount!');
        return;
    }

    // Add new expense
    const expense = { name, amount, category, month };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Clear input fields
    expenseName.value = '';
    expenseAmount.value = '';

    renderExpenses();
});

// Clear All Expenses
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

// Render Expenses Table & Totals
function renderExpenses() {
    tableBody.innerHTML = '';
    const monthTotals = {}; // Total per month

    // Render table rows
    expenses.forEach((exp, index) => {
        // Track totals by month
        if (!monthTotals[exp.month]) monthTotals[exp.month] = 0;
        monthTotals[exp.month] += exp.amount;

        const tr = document.createElement('tr');

        // Highlight large expenses (>10000)
        if (exp.amount > 10000) tr.classList.add('highlight');

        tr.innerHTML = `
            <td>${exp.name}</td>
            <td>₹${exp.amount.toFixed(2)}</td>
            <td>${exp.category}</td>
            <td>${exp.month}</td>
            <td><button onclick="deleteExpense(${index})">Delete</button></td>
        `;
        tableBody.appendChild(tr);
    });

    // Show totals for all months
    let totalText = '';
    for (const month in monthTotals) {
        totalText += `${month}: ₹${monthTotals[month].toFixed(2)}  `;
    }
    totalExpenseEl.textContent = totalText || 'Total Expense: ₹0';

    // Suggestion for the currently selected month
    const selectedMonth = expenseMonth.value;
    const monthTotal = monthTotals[selectedMonth] || 0;
    if (monthTotal > 45000) {
        suggestionEl.textContent = `Warning: Expenses for ${selectedMonth} are high!`;
        suggestionEl.style.color = 'red';
    } else if (monthTotal > 0) {
        suggestionEl.textContent = `Good! You are within budget for ${selectedMonth}.`;
        suggestionEl.style.color = 'green';
    } else {
        suggestionEl.textContent = '';
    }
}
