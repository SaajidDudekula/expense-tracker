const API = {
  async getExpenses() {
    const r = await fetch('/api/expenses');
    if (!r.ok) throw new Error('Failed to fetch expenses');
    return r.json();
  },
  async addExpense(expense) {
    const r = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    const body = await r.json();
    if (!r.ok) throw new Error((body && body.errors) ? body.errors.join(', ') : 'Failed to add expense');
    return body;
  },
  async deleteExpense(id) {
    const r = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      const body = await r.json().catch(()=>({}));
      throw new Error(body && body.error ? body.error : 'Failed to delete');
    }
    return r.json();
  },
  async getSummary() {
    const r = await fetch('/api/summary');
    if (!r.ok) throw new Error('Failed to fetch summary');
    return r.json();
  }
};

function fmt(num) {
  return Number(num).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function rowHTML(e) {
  return `
    <tr data-id="${e.id}">
      <td>${e.date}</td>
      <td>${e.category}</td>
      <td>${e.description || ''}</td>
      <td class="right">${fmt(e.amount)}</td>
      <td class="right"><button class="action delete">Delete</button></td>
    </tr>
  `;
}

async function render() {
  try {
    const expenses = await API.getExpenses();
    const tbody = document.getElementById('expenses-body');
    tbody.innerHTML = expenses.map(rowHTML).join('');
    const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
    document.getElementById('total-amount').textContent = fmt(total);

    const summary = await API.getSummary();
    const sbody = document.getElementById('summary-body');
    const keys = Object.keys(summary).sort();
    sbody.innerHTML = keys.length ? keys.map(k => `<tr><td>${k}</td><td class="right">${fmt(summary[k])}</td></tr>`).join('') :
      '<tr><td colspan="2">No data</td></tr>';
  } catch (err) {
    console.error(err);
  }
}

function todayISO(){
  const d = new Date();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${d.getFullYear()}-${m}-${day}`;
}

async function setup(){
  document.getElementById('date').value = todayISO();
  const form = document.getElementById('expense-form');
  const errorEl = document.getElementById('form-error');

  form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    errorEl.textContent = '';

    const formData = new FormData(form);
    const expense = {
      amount: formData.get('amount'),
      category: formData.get('category'),
      description: formData.get('description'),
      date: formData.get('date')
    };

    if (!expense.amount || Number(expense.amount) <= 0) {
      errorEl.textContent = 'Amount must be greater than 0';
      return;
    }
    if (!expense.category) {
      errorEl.textContent = 'Category is required';
      return;
    }
    if (!expense.date) {
      errorEl.textContent = 'Date is required';
      return;
    }

    try {
      await API.addExpense(expense);
      form.reset();
      document.getElementById('date').value = todayISO();
      await render();
    } catch (err) {
      errorEl.textContent = err.message || 'Failed to add expense';
    }
  });

  document.getElementById('expenses-body').addEventListener('click', async (e)=>{
    if (e.target.classList.contains('delete')) {
      const tr = e.target.closest('tr');
      const id = tr.getAttribute('data-id');
      try {
        await API.deleteExpense(id);
        await render();
      } catch (err) {
        console.error(err);
      }
    }
  });

  await render();
}

setup();
