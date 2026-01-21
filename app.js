const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const template = document.getElementById("expenseTemplate");
const totalAmount = document.getElementById("totalAmount");
const searchInput = document.getElementById("search");
const emptyState = document.getElementById("emptyState");

let expenses = loadExpenses();

/* ---------- STORAGE ---------- */

function loadExpenses() {
  return JSON.parse(localStorage.getItem("expenses")) || [];
}

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

/* ---------- RENDER ---------- */

function renderExpenses(data) {
  list.innerHTML = "";
  const fragment = document.createDocumentFragment();

  emptyState.style.display = data.length === 0 ? "block" : "none";

  data.forEach(exp => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".expense").dataset.id = exp.id;
    clone.querySelector(".title").textContent = exp.title;
    clone.querySelector(".category").textContent = exp.category;
    clone.querySelector(".amount").textContent = `₹${exp.amount}`;
    fragment.appendChild(clone);
  });

  list.appendChild(fragment);
  updateSummary();
}

function updateSummary() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalAmount.textContent = total;
}

/* ---------- EVENTS ---------- */

form.addEventListener("submit", e => {
  e.preventDefault();

  const title = form.title.value.trim();
  const amount = Number(form.amount.value);
  const category = form.category.value;

  if (!title || amount <= 0 || !category) {
    alert("Please enter valid expense details.");
    return;
  }

  expenses.push({
    id: crypto.randomUUID(),
    title,
    amount,
    category
  });

  saveExpenses();
  renderExpenses(expenses);
  form.reset();
});

list.addEventListener("click", e => {
  if (!e.target.classList.contains("delete")) return;

  const id = e.target.closest(".expense").dataset.id;
  expenses = expenses.filter(exp => exp.id !== id);
  saveExpenses();
  renderExpenses(expenses);
});

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = expenses.filter(exp =>
    exp.title.toLowerCase().includes(value) ||
    exp.category.toLowerCase().includes(value)
  );
  renderExpenses(filtered);
});

/* ---------- INIT ---------- */

renderExpenses(expenses);
