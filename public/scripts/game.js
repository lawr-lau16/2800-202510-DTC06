// Set Ami customization based on user settings
function setAmi() {
    // This will be replaces with user info from database
    userBase = "blue";
    userItem = "heart";
    amiBase = document.getElementById("ami-base");
    amiItem = document.getElementById("ami-item");
    amiBase.src = `/images/game/Ami-Base/${userBase}.png`
    amiItem.src = `/images/game/Items/${userItem}.png`
}

// Add pet button functionality
function gameButtonPet() {
    petButton = document.getElementById("game-pet");
    ami = document.getElementById("ami");
    amiExpression = document.getElementById("ami-expression");
    petButton.addEventListener("click", clickPetButton);
}

// Function to be executed when pet button is selected
function clickPetButton() {
    petButton.classList.toggle("border-blue-400");
    ami.classList.toggle("hover:cursor-pointer");
    // Ami becomes interactable
    ami.addEventListener("click", amiPetHappy);
    // event listener to remove interactability when user clicks button again
    petButton.addEventListener("click", removePetEventListener);
}

// changes Ami's expression temporarily
function amiPetHappy() {
    amiExpression.src = "images/game/Ami-Expressions/happy.png";
    setTimeout(() => {
        amiExpression.src = "images/game/Ami-Expressions/default.png";
    }, 700);
}

// Function to remove Ami clickability
function removePetEventListener() {
    ami.removeEventListener("click", amiPetHappy);
    petButton.removeEventListener("click", removePetEventListener);
}

// Add Items button functionality
function gameButtonItems() {
    itemsButton = document.getElementById("game-items");
    ami = document.getElementById("ami");
    amiItem = document.getElementById("ami-item");
    itemsMenu = document.getElementById("items-menu");
    itemsCloseMenu = document.getElementById("close-menu");

    itemsButton.addEventListener("click", clickItemButton);
    itemsCloseMenu.addEventListener("click", clickItemCloseButton);
}

// Open Items menu
function clickItemButton() {
    itemsMenu.classList.toggle("hidden");
}

// Close Items menu
function clickItemCloseButton() {
    itemsMenu.classList.toggle("hidden");
}

// Populates Items menu with available items 
function dynamicallyDisplayItems() {
    itemsDiv = document.getElementById("items");
    itemsDiv.innerHTML = "";
    // Array must contain items by exact name of the images for items
    // May be replaced by db future on
    const itemsAvailable = ["heart", "sprout", "star"];
    const itemsOwned = ["heart", "sprout"];
    amiItem = document.getElementById("ami-item");

    itemsAvailable.forEach(item => {
        eachItem = document.createElement("div");
        eachItem.id = item;
        // Sets class list for each new div
        eachItem.classList = "bg-white size-18 m-2 border-4 rounded-lg hover:cursor-pointer";
        // Goes through which items the user owns
        // If they don't have the item, it will be locked in the menu
        if (itemsOwned.includes(item)) {
            eachItem.innerHTML = `<div class="relative flex size-full">
            <img src="images/game/Items/${item}.png" class="absolute"></div>`
        } else {
            eachItem.innerHTML = `<div class="relative flex size-full"><i class="mx-auto my-auto fa-solid fa-lock fa-xl"></i>
            <img src="images/game/Items/${item}.png" class="absolute"></div>
            `;
            eachItem.classList.add("locked")
        }
        itemsDiv.append(eachItem);
    });

    itemsAvailable.forEach(item => {
        eachItem = document.getElementById(item);

        if (eachItem.classList.contains("locked")) {
            eachItem.addEventListener("click", () => {
                console.log("locked")
            })
        } else {
            eachItem.addEventListener("click", () => {
                // update db DO LATER
                userItem = item
                // changes Ami's Item
                amiItem.src = `images/game/Items/${item}.png`;
            })
        }
    });

}

// Add Achievement button functionality
function gameButtonAchievement() {
    achievementButton = document.getElementById("game-achievements");
    achievementMenu = document.getElementById("achievements-menu");
    itemsCloseMenu = document.getElementById("close-menu-achievement");

    achievementButton.addEventListener("click", clickAchievementButton);
    itemsCloseMenu.addEventListener("click", clickAchievementCloseButton);
}

// Open Items menu
function clickAchievementButton() {
    achievementMenu.classList.toggle("hidden");
}

// Close Items menu
function clickAchievementCloseButton() {
    achievementMenu.classList.toggle("hidden");
}

// For the weather
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
    gameWindow = document.getElementById("game-window")
    try {
        const response = await axios.get(`/weather?lat=${lat}&lon=${lon}`);
        const weatherData = response.data.weather[0].main;
        gameWindow.src = `/images/game/weather/g-${weatherData}.png`
        console.log(weatherData)
    }
    catch (error) {
        console.log("Error fetching weather data:", error)
    }
}

function fail() {
    alert("Weather for your location not available at this time.")
}


// execute functions
setAmi()
gameButtonPet()
dynamicallyDisplayItems()
gameButtonItems()
gameButtonAchievement()
getLocation()
