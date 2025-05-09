window.addEventListener('DOMContentLoaded', () => {

    // budget donut
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    function drawChart(values) {
        // e66f6f = red, 8ce66f = green
        const colors = ['#e66f6f', '#8ce66f'];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const img = new Image();
        img.src = "/images/misc_assets/ami.png";


        img.onload = function () {
            dmbChart(150, 150, 115, 35, values, colors, img);
        };
    }

    function dmbChart(cx, cy, radius, arcwidth, values, colors, img) {
        const PI = Math.PI;
        const PI2 = 2 * PI;
        const offset = PI / 2; // red starts from the bottom

        ctx.lineWidth = arcwidth;

        const total = values.reduce((a, b) => a + b, 0);
        let accum = 0;

        for (let i = 0; i < values.length; i++) {
            ctx.beginPath();
            ctx.arc(
                cx,
                cy,
                radius,
                offset + PI2 * (accum / total),
                offset + PI2 * ((accum + values[i]) / total)
            );
            ctx.strokeStyle = colors[i];
            ctx.stroke();
            accum += values[i];
        }

        // Inner "cutout"
        const innerRadius = radius - arcwidth - 3;
        ctx.beginPath();
        ctx.arc(cx, cy, innerRadius, 0, PI2);
        ctx.fillStyle = "transparent";
        ctx.fill();

        // Ami in the center
        // const imageSize = innerRadius * 2;
        // const scale = imageSize / Math.max(img.width, img.height);
        // const drawWidth = img.width * scale;
        // const drawHeight = img.height * scale;
        // ctx.drawImage(img, cx - drawWidth / 2, cy - drawHeight / 2, drawWidth, drawHeight);
    }


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
        // set start of week to sunday
        const startOfWeek = new Date(today);
        startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDate());
        startOfWeek.setUTCHours(0, 0, 0, 0);
        // set end of week to saturday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 990);

        return itemDate >= startOfWeek && itemDate <= endOfWeek;
    }


    function monthlyTransactions(transactionDate) {
        const itemDate = new Date(transactionDate);
        const today = new Date();
        return (
            itemDate.getUTCFullYear() === today.getUTCFullYear()
            &&
            itemDate.getUTCMonth() === today.getUTCMonth()
        );
    }

    // sum transaction amounts depending on daily/weekly/monthly
    function sumAmounts(items, filterFunction) {
        return items
            .filter(item => filterFunction(item.date))
            .reduce((total, item) => total + item.amount, 0);
    }


    async function updateSpending(timeframe) {
        try {
            const transactionsResponse = await fetch('/transactions/fetch', {
                method: 'POST'
            });
            const transactionsData = await transactionsResponse.json();
            const transactions = transactionsData.transactions;

            const budgetResponse = await fetch('/budget', {
                method: 'POST'
            });
            const budgetData = await budgetResponse.json();
            const budget = budgetData.budget;
            const selectedBudget = budget[timeframe];
            console.log(budget)


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

            document.getElementById("spentVsBudget").innerHTML = `$${total} / $${selectedBudget}`;

            const values = [(total / selectedBudget) * 100, ((selectedBudget - total) / selectedBudget) * 100]
            drawChart(values);
        }
        catch (err) {
            console.error("Error:", err)
            document.getElementById("spentVsBudget").innerHTML = "Error loading data."
        }
    }


    const buttons = {
        // daily: document.getElementById("dailyButton"),
        weekly: document.getElementById("weeklyButton"),
        monthly: document.getElementById("monthlyButton"),

    }
    // buttons.daily.addEventListener('click', () => {
    //     updateSpending("daily");
    //     selectedButton("daily");
    // })

    buttons.weekly.addEventListener('click', () => {
        updateSpending("weekly");
        selectedButton("weekly");
    })

    buttons.monthly.addEventListener('click', () => {
        updateSpending("monthly");
        selectedButton("monthly");
    })

    function selectedButton(selected) {
        for (const key in buttons) {
            if (key === selected) {
                buttons[key].classList.add("bg-[#089ddd]", "border-[#0a67a0]", "text-white", "hover:bg-[#44bcf0]", "hover:border-[#0c79bf]")
                buttons[key].classList.remove("border-[#089ddd]", "text-[#089ddd]", "bg-white", "hover:bg-[#089ddd]", "hover:text-white", "active:bg-[#5edfff]")
            }
            else {
                buttons[key].classList.add("border-[#089ddd]", "text-[#089ddd]", "bg-white", "hover:bg-[#089ddd]", "hover:text-white", "active:bg-[#5edfff]")
                buttons[key].classList.remove("bg-[#089ddd]", "border-[#0a67a0]", "text-white", "hover:bg-[#44bcf0]", "hover:border-[#0c79bf]")
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
        mainCard = document.getElementById("main-card")

        try {
            const response = await axios.get(`/weather?lat=${lat}&lon=${lon}`);
            const weatherData = response.data.weather[0].main;
            console.log(weatherData)
            mainCard.classList.replace("bg-[url(/images/game/weather/m-Clear.jpg)]", `bg-[url(/images/game/weather/m-${weatherData}.jpg)]`)
        }
        catch (error) {
            console.log("Error fetching weather data:", error)
        }
    }

    function fail() {
        alert("Weather for your location not available at this time.")
    }

    updateSpending("weekly");
    selectedButton("weekly");
    getLocation();
})