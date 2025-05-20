// Sliding Panel Logic
//DOM Elements
const panel = document.getElementById("slideUpPanel");
const openBtn = document.getElementById("openSlideUp");
const closeBtn = document.getElementById("closeSlideUp");
const overlay = document.getElementById("overlay");
const dynamicFormContainer = document.getElementById("dynamicFormContainer");
const backBtn = document.getElementById("backToDashboard");

// Open the slide-up panel
function openPanel() {
  panel.classList.remove(
    "translate-y-full",
    "opacity-0",
    "pointer-events-none"
  );
  panel.classList.add("translate-y-0", "opacity-100");

  //Center on desktop
  panel.classList.add("md:translate-y-[-50%]", "md:translate-x-[-50%]");
  overlay.classList.remove("hidden");
}
//close the slide up panel
function closePanel() {
  panel.classList.remove("translate-y-0", "opacity-100");
  panel.classList.add("translate-y-full", "opacity-0", "pointer-events-none");

  // Also remove the desktop-specific transform override if open
  panel.classList.remove("md:translate-y-[-50%]", "md:translate-x-[-50%]");
  overlay.classList.add("hidden");

  //clear form content
  dynamicFormContainer.innerHTML = "";
}
//event listeners for opening and closing the panel
openBtn.onclick = () => {
  openPanel();
  loadAndShowAddForm("expense"); //default form
};

closeBtn.onclick = overlay.onclick = () => {
  closePanel();
  dynamicFormContainer.innerHTML = "";
};

backBtn.addEventListener("click", () => {
  closePanel();
  dynamicFormContainer.innerHTML = "";
});

//load the add-expense form from the server and intialize it.
async function loadAndShowAddForm(type = "expense") {
  try {
    const response = await fetch("/add-expense");
    const html = await response.text();
    dynamicFormContainer.innerHTML = html;
    initAddForm(type);
  } catch (err) {
    console.error("Failed to load form:", err);
  }
}

//intialize form controls, button, and category salect based on type
function initAddForm(defaultType = "expense") {
  const expenseBtn = document.getElementById("expenseBtn");
  const incomeBtn = document.getElementById("incomeBtn");
  const typeInput = document.getElementById("typeInput");
  const categorySelect = document.getElementById("categorySelect");

  if (!expenseBtn || !incomeBtn || !typeInput || !categorySelect) return;

  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Home & Utilities",
    "Entertainment & Lifestyle",
    "Personal & Health",
    "Bills & Fees",
    "Pet",
    "Car",
    "Shopping & Gifts",
    "Work & Education",
    "Travel",
    "Other",
  ];

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Bonus",
    "Interest/Dividends",
    "Refunds/Reimbursements",
    "Other Income",
  ];

  function populateCategories(categories) {
    categorySelect.innerHTML = '<option value="">Select a category</option>';
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  expenseBtn.addEventListener("click", () => {
    typeInput.value = "expense";
    populateCategories(expenseCategories);
    expenseBtn.classList.add("bg-black", "text-white");
    expenseBtn.classList.remove("bg-white", "text-black");
    incomeBtn.classList.add("bg-white", "text-black");
    incomeBtn.classList.remove("bg-black", "text-white");
  });

  incomeBtn.addEventListener("click", () => {
    typeInput.value = "income";
    populateCategories(incomeCategories);
    incomeBtn.classList.add("bg-black", "text-white");
    incomeBtn.classList.remove("bg-white", "text-black");
    expenseBtn.classList.add("bg-white", "text-black");
    expenseBtn.classList.remove("bg-black", "text-white");
  });

  // Initialize with the default type
  if (defaultType === "income") {
    incomeBtn.click();
  } else {
    // Default to expense
    expenseBtn.click();
  }
}

// Budget Overview Toggle
function toggleBudget() {
  const budget = document.getElementById("budgetOverview");
  const arrow = document.getElementById("arrowIcon");
  const toggleBtn = document.getElementById("toggleBudgetBtn");
  const btnText = toggleBtn.querySelector("span");

  const isOpen = !budget.classList.contains("max-h-0");

  if (isOpen) {
    budget.classList.remove("max-h-[1000px]", "opacity-100");
    budget.classList.add("max-h-0", "opacity-0");
    arrow.classList.remove("rotate-180");
    btnText.textContent = "Show Transactions";
  } else {
    budget.classList.remove("max-h-0", "opacity-0");
    budget.classList.add("max-h-[1000px]", "opacity-100");
    arrow.classList.add("rotate-180");
    btnText.textContent = "Hide Transactions";
  }
}

document
  .getElementById("toggleBudgetBtn")
  .addEventListener("click", toggleBudget);

// Initialize Chart (placeholder - will be replaced by your actual chart logic)

let chart; // Make chart accessible globally

// fetch transaction data from the backend for the chart.
async function fetchChartData() {
  try {
    const response = await fetch("/transactions/chart-data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return {
      category: { labels: [], values: [] },
      weekly: { labels: [], values: [] },
      monthly: { labels: [], values: [] },
    };
  }
}

//updates the budget progress bar and labels
function updateProgressBar(used, total, period) {
  const percent = Math.min(100, ((used / total) * 100).toFixed(0));
  const progressFill = document.querySelector(".progress-fill");
  const budgetText = document.getElementById("budgetUsedText");
  const spentVsBudget = document.getElementById("spentVsBudget");

  // Remove existing color classes
  progressFill.classList.remove("bg-green-500", "bg-yellow-500", "bg-red-500");

  // Add color based on percentage
  if (percent < 50) {
    progressFill.classList.add("bg-green-500");
  } else if (percent < 90) {
    progressFill.classList.add("bg-yellow-500");
  } else {
    progressFill.classList.add("bg-red-500");
  }

  // Animate and update width
  progressFill.style.setProperty("--progress-width", percent + "%");
  progressFill.classList.remove("progress-fill");
  void progressFill.offsetWidth; // force reflow to trigger animation
  progressFill.classList.add("progress-fill");

  // Update text
  budgetText.textContent = `${percent}% of ${period} budget used`;
  spentVsBudget.innerHTML = `$${used} / $${total}`;
}

//style the toggle button based on selected mode
function styleToggleButtons(mode) {
  const weeklyBtn = document.getElementById("weeklyButton");
  const monthlyBtn = document.getElementById("monthlyButton");

  if (mode === "weekly") {
    weeklyBtn.classList.add("bg-[#089ddd]", "text-white");
    weeklyBtn.classList.remove("bg-white", "text-[#089ddd]");
    monthlyBtn.classList.add("bg-white", "text-[#089ddd]");
    monthlyBtn.classList.remove("bg-[#089ddd]", "text-white");
  } else {
    monthlyBtn.classList.add("bg-[#089ddd]", "text-white");
    monthlyBtn.classList.remove("bg-white", "text-[#089ddd]");
    weeklyBtn.classList.add("bg-white", "text-[#089ddd]");
    weeklyBtn.classList.remove("bg-[#089ddd]", "text-white");
  }
}

// On page load, initialize the chart
document.addEventListener("DOMContentLoaded", async () => {
  const ctx = document.getElementById("canvas").getContext("2d");
  const chartData = await fetchChartData();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: chartData.category.labels,
      datasets: [
        {
          data: chartData.category.values,
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
          borderWidth: 1,
          hoverOffset: 25,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
    },
  });

  updateProgressBar(
    window.EconAmiData.spentThisMonth,
    window.EconAmiData.monthlyBudget,
    "monthly"
  );

  styleToggleButtons("monthly");
});

//toggle to weekely chart

document.getElementById("weeklyButton").addEventListener("click", async () => {
  const data = await fetchChartData();

  chart.data.labels = Object.keys(data.weeklyCategory);
  chart.data.datasets[0].data = Object.values(data.weeklyCategory);
  chart.update();

  updateProgressBar(
    window.EconAmiData.spentThisWeek,
    window.EconAmiData.weeklyBudget,
    "weekly"
  );

  styleToggleButtons("weekly");
});

//toggle to monthly chart

document.getElementById("monthlyButton").addEventListener("click", async () => {
  const data = await fetchChartData();
  chart.data.labels = data.category.labels;
  chart.data.datasets[0].data = data.category.values;
  chart.update();
  updateProgressBar(
    window.EconAmiData.spentThisMonth,
    window.EconAmiData.monthlyBudget,
    "monthly"
  );

  styleToggleButtons("monthly");
});
