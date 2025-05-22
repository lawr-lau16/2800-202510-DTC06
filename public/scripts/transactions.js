// Grab budget-related data embedded in HTML via data-* attributes

const budgetEl = document.getElementById("budget-data");
const spent = Number(budgetEl.dataset.spent);
const monthlyBudget = Number(budgetEl.dataset.budget);
const percentUsed = Math.min((spent / monthlyBudget) * 100, 100);

// Set the progress bar width visually based on budget percentage used
document.getElementById("progressBar").style.width =
  budgetEl.dataset.percent + "%";

//Function to toggle dropdowns for income/expense category filters
function showDropdown(type) {
  const incomeDropdown = document.getElementById("incomeDropdown");
  const expenseDropdown = document.getElementById("expenseDropdown");

  // Safety check if either dropdown is missing
  if (!incomeDropdown || !expenseDropdown) return;

  // Hide both dropdowns initially
  incomeDropdown.classList.add("hidden");
  expenseDropdown.classList.add("hidden");

  // Show the appropriate dropdown based on the selected type
  if (type === "income") {
    incomeDropdown.classList.remove("hidden");
  } else if (type === "expense") {
    expenseDropdown.classList.remove("hidden");
  }
}

//Fetch pre-processed chart data from backend (via /transactions/chart-data)
axios
  .get("/transactions/chart-data")
  .then((response) => {
    // Destructure data sent by the server
    const { category, monthly, weekly } = response.data;

    // ---------------------------
    // Donut Chart - Category-wise for current month (Expenses only)
    // ---------------------------
    new Chart(document.getElementById("transactionsPieChart"), {
      type: "pie",
      data: {
        labels: category.labels, // e.g., Food, Rent, etc.

        datasets: [
          {
            data: category.values, // Amounts per category

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
            hoverOffset: 25, // Adds spacing effect on hover
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false }, // Allows flexible resizing
    });

    // ---------------------------
    //  Bar Chart - Monthly totals (all expenses grouped by month)
    // ---------------------------

    new Chart(document.getElementById("monthlyBarChart"), {
      type: "bar",
      data: {
        labels: monthly.labels, // e.g., Jan, Feb, Mar
        datasets: [
          {
            label: "Expenses",
            data: monthly.values, // Total per month

            backgroundColor: "#4BC0C0", // Solid teal color
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

    // ---------------------------
    //Line Chart - Weekly totals over time
    // ---------------------------

    new Chart(document.getElementById("weeklyLineChart"), {
      type: "line",
      data: {
        labels: weekly.labels, // e.g., "Week of 2025-05-06"
        datasets: [
          {
            label: "Weekly Expenses",
            data: weekly.values, // Weekly totals

            borderColor: "#4BC0C0",
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Weekly Expense Trend" }, // Chart title
        },
      },
    });
  })

  //Catch and log any errors from the Axios GET request
  .catch((error) => {
    console.error("Error loading chart data:", error);
  });
