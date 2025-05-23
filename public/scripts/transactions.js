const budgetEl = document.getElementById("budget-data");
const spent = Number(budgetEl.dataset.spent);
const monthlyBudget = Number(budgetEl.dataset.budget);
const percentUsed = Math.min((spent / monthlyBudget) * 100, 100);
document.getElementById("progressBar").style.width =
  budgetEl.dataset.percent + "%";

function showDropdown(type) {
  const incomeDropdown = document.getElementById("incomeDropdown");
  const expenseDropdown = document.getElementById("expenseDropdown");

  if (!incomeDropdown || !expenseDropdown) return;

  incomeDropdown.classList.add("hidden");
  expenseDropdown.classList.add("hidden");

  if (type === "income") {
    incomeDropdown.classList.remove("hidden");
  } else if (type === "expense") {
    expenseDropdown.classList.remove("hidden");
  }
}
axios
  .get("/transactions/chart-data")
  .then((response) => {
    const { category, monthly, weekly } = response.data;

    new Chart(document.getElementById("transactionsPieChart"), {
      type: "pie",
      data: {
        labels: category.labels,
        datasets: [
          {
            data: category.values,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#8E44AD",
              "#3498DB",
              "#1ABC9C",
              "#E74C3C",
              "#F39C12",
              "#2ECC71",
            ],
            hoverOffset: 25,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    new Chart(document.getElementById("monthlyBarChart"), {
      type: "bar",
      data: {
        labels: monthly.labels,
        datasets: [
          {
            label: "Expenses",
            data: monthly.values,
            backgroundColor: "#4BC0C0",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Monthly Spending Overview" },
        },
      },
    });

    new Chart(document.getElementById("weeklyLineChart"), {
      type: "line",
      data: {
        labels: weekly.labels,
        datasets: [
          {
            label: "Weekly Expenses",
            data: weekly.values,
            borderColor: "#4BC0C0",
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Weekly Expense Trend" },
        },
      },
    });
  })
  .catch((error) => {
    console.error("Error loading chart data:", error);
  });
