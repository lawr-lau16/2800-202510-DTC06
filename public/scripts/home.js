window.addEventListener("DOMContentLoaded", () => {

  // First time user message
  fetch('/navbar')
    .then(response => response.json())
    .then(data => {
      const achievements = data.achievements;
      console.log(achievements)

      const welcomeAchievement = achievements.find(achievement => achievement.type === "welcome" && achievement.completed === false);
      if (welcomeAchievement) {
        document.getElementById('speechBubble').textContent = 'Please take a look at the achievements page ★ to redeem some coins!';
      }
    })
    .catch(error => {
      console.error('Error fetching achievements:', error);
    });


  // Set Ami customization based on user settings
  async function setAmi() {

    const response = await fetch("/pet", { method: "POST" });
    const { pet } = await response.json();
    amiBase = document.querySelectorAll("#ami-base");
    amiItem = document.querySelectorAll("#ami-item");
    console.log(amiItem[0])
    for (i in amiBase) {
      try {
        amiBase[i].src = `/images/game/Ami-Base/${pet.base}.png`;
        if (pet.item === "") {
          amiItem[i].src = ``;
        } else {
          amiItem[i].src = `/images/game/Items/${pet.item}.png`;
          console.log(amiItem[0])
        }
      }
      catch (err) {
        console.error("Error loading pet:", err);
      }
    }
  }



  // budget donut
  // const canvas = document.getElementById("canvas");
  // const ctx = canvas.getContext("2d");

  function drawAnimatedChart(values, duration = 500) {
    const colors = ["#e66f6f", "#8ce66f"];
    const start = performance.now();
    const img = new Image();
    img.src = "/images/misc_assets/ami.png";

    img.onload = function () {
      function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1); // range [0,1]

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dmbChart(150, 150, 115, 35, values, colors, img, progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    };
  }

  function dmbChart(
    cx,
    cy,
    radius,
    arcwidth,
    values,
    colors,
    img,
    progress = 1
  ) {
    const PI = Math.PI;
    const PI2 = 2 * PI;
    const offset = PI / 2;

    ctx.lineWidth = arcwidth;

    const total = values.reduce((a, b) => a + b, 0);
    let accum = 0;
    let drawn = 0;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const startAngle = offset + PI2 * (accum / total);
      const endAngle = offset + PI2 * ((accum + value) / total);
      const arcSpan = endAngle - startAngle;
      const maxSpan = PI2 * progress;

      if (drawn >= maxSpan) break;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, Math.min(endAngle, offset + maxSpan));
      ctx.strokeStyle = colors[i];
      ctx.stroke();

      drawn += arcSpan;
      accum += value;
    }
  }

  // Ami in the center
  // const imageSize = innerRadius * 2;
  // const scale = imageSize / Math.max(img.width, img.height);
  // const drawWidth = img.width * scale;
  // const drawHeight = img.height * scale;
  // ctx.drawImage(img, cx - drawWidth / 2, cy - drawHeight / 2, drawWidth, drawHeight);

  // function dailyTransactions(transactionDate) {
  //     const itemDate = new Date(transactionDate);
  //     const today = new Date();

  //     return (
  //         itemDate.getUTCFullYear() === today.getUTCFullYear()
  //         &&
  //         itemDate.getUTCMonth() === today.getUTCMonth()
  //         &&
  //         itemDate.getUTCDate() === today.getUTCDate()
  //     );
  // }

  function weeklyTransactions(transactionDate) {
    const itemDate = new Date(transactionDate);
    const today = new Date();

    // Get local day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = today.getDay();
    const daysSinceMonday = (currentDay + 6) % 7; // Monday = 0, Sunday = 6

    // Start of the week (Monday 00:00:00 local time)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysSinceMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // End of the week (Sunday 23:59:59 local time)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return itemDate >= startOfWeek && itemDate <= endOfWeek;
  }

  function monthlyTransactions(transactionDate) {
    const itemDate = new Date(transactionDate);
    const today = new Date();
    return (
      itemDate.getUTCFullYear() === today.getUTCFullYear() &&
      itemDate.getUTCMonth() === today.getUTCMonth()
    );
  }

  // sum transaction amounts depending on daily/weekly/monthly
  function sumAmounts(items, filterFunction) {
    return items
      .filter((item) => item.type === "expense" && filterFunction(item.date))
      .reduce((total, item) => total + item.amount, 0);
  }

  async function updateSpending(timeframe) {
    try {
      const transactionsResponse = await fetch("/transactions/fetch", {
        method: "POST",
      });
      const transactionsData = await transactionsResponse.json();
      const transactions = transactionsData.transactions;

      const budgetResponse = await fetch("/budget", {
        method: "POST",
      });
      const budgetData = await budgetResponse.json();
      const budget = budgetData.budget;
      const selectedBudget = budget[timeframe];

      let total = 0;

      // if (timeframe === "daily") {
      //     total = sumAmounts(transactions, dailyTransactions);
      // }

      if (timeframe === "weekly") {
        total = sumAmounts(transactions, weeklyTransactions);
      }

      if (timeframe === "monthly") {
        total = sumAmounts(transactions, monthlyTransactions);
      }

      document.getElementById(
        "spentVsBudget"
      ).innerHTML = `$${total} / $${selectedBudget}`;

      const values = [
        (total / selectedBudget) * 100,
        ((selectedBudget - total) / selectedBudget) * 100,
      ];
      drawAnimatedChart(values);
    } catch (err) {
      console.error("Error:", err);
      document.getElementById("spentVsBudget").innerHTML =
        "Error loading data.";
    }
  }

  const buttons = {
    // daily: document.getElementById("dailyButton"),
    weekly: document.getElementById("weeklyButton"),
    monthly: document.getElementById("monthlyButton"),
  };
  // buttons.daily.addEventListener('click', () => {
  //     updateSpending("daily");
  //     selectedButton("daily");
  // })

  buttons.weekly.addEventListener("click", () => {
    updateSpending("weekly");
    selectedButton("weekly");
  });

  buttons.monthly.addEventListener("click", () => {
    updateSpending("monthly");
    selectedButton("monthly");
  });

  function selectedButton(selected) {
    for (const key in buttons) {
      if (key === selected) {
        buttons[key].classList.add(
          "bg-[#089ddd]",
          "border-[#0a67a0]",
          "text-white",
          "hover:bg-[#44bcf0]",
          "hover:border-[#0c79bf]"
        );
        buttons[key].classList.remove(
          "border-[#089ddd]",
          "text-[#089ddd]",
          "bg-white",
          "hover:bg-[#089ddd]",
          "hover:text-white",
          "active:bg-[#5edfff]"
        );
      } else {
        buttons[key].classList.add(
          "border-[#089ddd]",
          "text-[#089ddd]",
          "bg-white",
          "hover:bg-[#089ddd]",
          "hover:text-white",
          "active:bg-[#5edfff]"
        );
        buttons[key].classList.remove(
          "bg-[#089ddd]",
          "border-[#0a67a0]",
          "text-white",
          "hover:bg-[#44bcf0]",
          "hover:border-[#0c79bf]"
        );
      }
    }
  }

  // GEOLOCATION

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, fail);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  async function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    mainCard = document.getElementById("main-card");

    try {
      const response = await axios.get(`/weather?lat=${lat}&lon=${lon}`);
      const weatherData = response.data.weather[0].main;
      console.log(weatherData);
      mainCard.classList.replace(
        "bg-[url(/images/game/weather/m-Clear.jpg)]",
        `bg-[url(/images/game/weather/m-${weatherData}.jpg)]`
      );
    } catch (error) {
      console.log("Error fetching weather data:", error);
    }
  }

  function fail() {
    alert("Weather for your location not available at this time.");
  }

  setAmi();
  updateSpending("weekly");
  selectedButton("weekly");
  getLocation();
});
