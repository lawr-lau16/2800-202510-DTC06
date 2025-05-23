## Project Name

EconAmi

---

## Project Description

Econami is a gamified budget management web app that turns saving into a fun, goal-driven experience which supports a better world by promoting financial wellness and empowering users to build healthy money habits.

---

## Features

- add transactions such as expenses or income
- display transactions and your allocated budget for the week and month
- adjust weekly or monthly budget as life changes your savings goals
- see your transactions trends
- complete achievements to gain coins to buy items for your friend the app mascot Ami
- check the weather for your location on the home page background or the game page window
- let Ami tell you a funny joke

---

## Project Structure

```

EconAmi/
├── .vscode
│   └── settings.json
├── archive
│   ├── about.html
│   ├── achievements.html
│   ├── expense_log.html
│   ├── expense_template.html
│   ├── expense.html
│   ├── game.html
│   ├── home.html
│   ├── index.html
│   ├── profile.html
│   └── skeleton.js
├── models
│   └── transaction.js
├── public
│   ├── images
│       ├── achievements
│           ├── add_achievement.png
│           ├── ami_happiness.png
│           ├── coffee.png
│           ├── coin.png
│           ├── coins.png
│           ├── daily.png
│           ├── input_expense.png
│           ├── login.png
│           ├── monthly_budget.png
│           ├── monthly.png
│           ├── pet_ami.png
│           ├── weekly_budget.png
│           ├── weekly.png
│           └── welcome.png
│       ├── game
│           ├── Ami-Base
│               ├── black.png
│               ├── blue.png
│               ├── camel.png
│               ├── gold.png
│               ├── green.png
│               ├── i-black.png
│               ├── i-blue.png
│               ├── i-camel.png
│               ├── i-gold.png
│               ├── i-green.png
│               ├── i-red.png
│               ├── i-white.png
│               ├── i-yellow.png
│               ├── red.png
│               ├── white.png
│               └── yellow.png
│           ├── Ami-Expressions
│               ├── default.png
│               ├── happy.png
│               ├── sad.png
│               └── talk.png
│           ├── Items
│               ├── bow.png
│               ├── bowtie.png
│               ├── flower.png
│               ├── headband.png
│               ├── heart.png
│               ├── i-bow.png
│               ├── i-bowtie.png
│               ├── i-flower.png
│               ├── i-headband.png
│               ├── i-heart.png
│               ├── i-partyhat.png
│               ├── i-sprout.png
│               ├── i-star.png
│               ├── partyhat.png
│               ├── sprout.png
│               └── star.png
│           ├── Other
│               ├── ami-blank.png
│               ├── pet.png
│               ├── star.png
│               └── wall_polkadot.png
│           ├── weather
│               ├── g-Atmosphere.png
│               ├── g-Clear.png
│               ├── g-Clouds.png
│               ├── g-Drizzle.png
│               ├── g.Rain.png
│               ├── g-Snow.png
│               ├── g-Thunderstorm.png
│               ├── m-Atmosphere.png
│               ├── m-Clear.png
│               ├── m-Clouds.png
│               ├── m-Drizzle.png
│               ├── m-Rain.png
│               ├── m-Snow.png
│               └── m-Thunderstorm.png
│       ├── misc_assets
│           ├── ami-2.png
│           ├── ami-3.png
│           └── ami.png
│       ├── navbar
│           ├── achievement_notification.png
│           ├── achievement.png
│           ├── coin.png
│           ├── game-icon.png
│           └── heart.png
│       └── favicon.png
│   └── scripts
│           ├── achievements.js
│           ├── ai.mjs
│           ├── game.js
│           ├── home_charts.js
│           ├── home.js
│           ├── navigation.js
│           ├── profile.js
│           └── script.js
├── routes
│   └── achievements.js
├── views
│   ├── partials
│       ├── expense_log.ejs
│       ├── nav_bottom.ejs
│       ├── nav_top_non_user.ejs
│       └── nav_top.ejs
│   ├── 404.ejs
│   ├── achievements.ejs
│   ├── dashboard.ejs
│   ├── game.ejs
│   ├── home.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   └── transactions.ejs
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── server.js
├── style_guide.html
└── tailwind.config.js

```

---

## About Us

Team Name: DTC-06
Team Members: 
- Lawrence Lau
- Tiffany Wong
- Gurpreet Singh
- Tin Trinh
- Alexander Ingles

---

## Technologies

- EJS view engine
- MongoDB
- Mongoose
- BCrypt
- Express
- Express Session
- Serve Favicon
- OpenAi (The Chat Gpt API)
- Axios

# Frontend

- HTML 5
- Tailwind CSS 3.4.3
- EJS 3.1.9
- JavaScript 
- chart.js 4.4.3

# Backend

- Node.js 20.12.2
- Express.js 4.19.2

# Database

- MongoDB

# APIs

- ChatGPT API
- HTML Geolocation API
- OpenWeather API

---

## Attributions

<a href="https://www.flaticon.com/free-icons/heart" title="heart icons">Heart icons created by Good Ware - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/star" title="star icons">Star icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/open-hands" title="open hands icons">Open hands icons created by Icon Mart - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/coin" title="coin icons">Coin icons created by Good Ware - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/goal" title="goal icons">Goal icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/phone" title="phone icons">Phone icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/happy" title="happy icons">Happy icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/7-days" title="7 days icons">7 days icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/month" title="month icons">Month icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/friendship" title="friendship icons">Friendship icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/accounting" title="accounting icons">Accounting icons created by Eucalyp - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/food" title="food icons">Food icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/welcome" title="welcome icons">Welcome icons created by bearicons - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/select" title="select icons">Select icons created by Freepik - Flaticon</a>

---

## Limitations and Future Work

- users cannot currently add their own categories for their transactions
- there are no accessibility accomodations (eg. dark mode)

---

##
- For the API we used the chatgpt api forums for the request and learning how to implement it, because of which we have attributed our modified versions to OpenAI!
- When using generative tools for our production we made sure that generated content was properly identified and credited in our code, mostly however we used AI as a teacher or a resource for learning rather than just copying and pasting, because of this almost all code is our own!

## Contact Us!
- Lawrence @ llau66@my.bcit.ca
- Tiffany @ twong402@my.bcit.ca
- Tin @ ttrinh25@my.bcit.ca
- Gurpreet @ gsingh739@my.bcit.ca
- Alex @ aingles@my.bcit.ca