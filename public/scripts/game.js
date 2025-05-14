// Set Ami customization based on user settings
async function setAmi() {
    // This will be replaces with user info from database
    try {
        const response = await fetch('/pet', { method: 'POST' });
        const { pet } = await response.json();
        document.getElementById('ami-base').src = `/images/game/Ami-Base/${pet.base}.png`;
        if (pet.item === '') {
            document.getElementById('ami-item').src = ``
        } else {
            document.getElementById('ami-item').src = `/images/game/Items/${pet.item}.png`;
        }
    } catch (err) {
        console.error("Error loading pet:", err);
    }
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

// Tab to change Ami's colour
function itemMenuBaseTab() {
    itemBaseTab = document.getElementById("items-menu-base");
    itemBaseTab.addEventListener("click", dynamicallyDisplayBase)
}

// Tab to change Ami's item
function itemMenuItemTab() {
    itemItemsTab = document.getElementById("items-menu-item");
    itemItemsTab.addEventListener("click", dynamicallyDisplayItems)
}

async function getInventory() {
    try {
        const response = await fetch('/inventory', { method: 'POST' });
        const { inventory } = await response.json();
        itemsOwned = inventory;
        return itemsOwned
    } catch (err) {
        console.error("Failed to load inventory:", err);
    }
}


// Populates Items menu with available items 
async function dynamicallyDisplayItems() {

    itemsDiv = document.getElementById("items");
    itemsDiv.innerHTML = "";
    // Array must contain items by exact name of the images for items
    // May be replaced by db future on

    const itemsAvailable = ["heart", "sprout", "star"];
    // itemsOwned = [];

    let itemsOwned = await getInventory()

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
            eachItem.classList.add("brightness-85")
            eachItem.innerHTML = `
            <div class="relative flex size-full">
                <div class="size-full flex flex-col z-1">
                    <i class="mx-auto mt-auto fa-solid fa-lock fa-xl"></i>
                    <p class="mx-auto mt-3">50</p>
                </div>
                <img src="images/game/Items/${item}.png" class="absolute">
            </div>
            `;
            eachItem.classList.add("locked")
        }
        itemsDiv.append(eachItem);
    });

    // Creates no item option
    blankItem = document.createElement("div");
    blankItem.classList = "bg-white size-18 m-2 border-4 rounded-lg hover:cursor-pointer"
    blankItem.id = "no-item"
    blankItem.innerHTML = `<div class="relative flex size-full">
            <img src="" class="absolute">
            </div>`
    itemsDiv.prepend(blankItem);

    // Adds clickability for no item option
    removeItem = document.getElementById("no-item");
    removeItem.addEventListener("click", async () => {
        const response = await fetch('/pet', { method: 'POST' });
        const { pet } = await response.json();
        await fetch('/pet/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                base: `${pet.base}`,
                item: '',
                happiness: pet.happiness
            })
        });
        setAmi()
    })


    itemsAvailable.forEach(item => {
        eachItem = document.getElementById(item);

        if (eachItem.classList.contains("locked")) {
            eachItem.addEventListener("click", async () => {

                price = 50
                console.log("locked")
                const res = await fetch('/inventory', { method: 'POST' });
                const { inventory, coins } = await res.json();
                if (coins < price) {
                    return alert("Not enough coins!");
                }
                if (window.confirm(`Buy ${item}?`)) {
                    const updatedInventory = [...inventory, item];
                    const updatedCoins = coins - price;
                    await fetch('/inventory/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ inventory: updatedInventory, coins: updatedCoins })
                    });
                    dynamicallyDisplayItems()
                }
            })
        } else {
            eachItem.addEventListener("click", async () => {
                const response = await fetch('/pet', { method: 'POST' });
                const { pet } = await response.json();
                await fetch('/pet/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        base: `${pet.base}`,
                        item: `${item}`,
                        happiness: pet.happiness
                    })
                });
                setAmi()
            })
        }
    });

}

// Populates Items menu with available items 
async function dynamicallyDisplayBase() {
    itemsDiv = document.getElementById("items");
    itemsDiv.innerHTML = "";
    // May be replaced by db future on
    const baseAvailable = ["white", "black", "blue", "red", "green", "yellow", "camel"];
    const baseAll = ["white", "black", "blue", "red", "green", "yellow", "camel", "gold"];
    // used to see if user has gold
    let itemsOwned = await getInventory()
    amiBase = document.getElementById("ami-base");

    baseAvailable.forEach(base => {
        eachBase = document.createElement("div");
        eachBase.id = base;
        // Sets class list for each new div
        eachBase.classList = "size-18 m-2 border-4 rounded-lg hover:cursor-pointer overflow-hidden";
        eachBase.innerHTML = `<div class="relative flex size-full">
            <img src="images/game/Ami-Base/i-${base}.png" class="mx-auto"></div>`
        itemsDiv.append(eachBase);
    });

    // Special gold base
    goldBase = document.createElement("div");
    goldBase.id = "gold"
    goldBase.classList = "size-18 m-2 border-4 rounded-lg hover:cursor-pointer overflow-hidden";
    if (itemsOwned.includes("gold")) {
        goldBase.innerHTML = `<div class="relative flex size-full">
            <img src="images/game/Ami-Base/i-gold.png" class="mx-auto"></div>`
    } else {
        goldBase.innerHTML = `<div class="relative flex size-full">
            <i class="z-2 my-auto mx-auto fa-solid fa-lock fa-xl"></i>
            <img src="images/game/Ami-Base/i-gold.png" class="absolute size-full"></div>
            `;
        goldBase.classList.add("locked")
    }
    itemsDiv.append(goldBase);

    baseAll.forEach(base => {
        eachBase = document.getElementById(base);

        if (eachBase.classList.contains("locked")) {
            eachBase.addEventListener("click", () => {
                console.log("locked")
            })
        } else {
            eachBase.addEventListener("click", async () => {
                const response = await fetch('/pet', { method: 'POST' });
                const { pet } = await response.json();
                await fetch('/pet/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        base: `${base}`,
                        item: `${pet.item}`,
                        happiness: pet.happiness
                    })
                });
                setAmi()
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
// dynamicallyDisplayBase()
itemMenuItemTab()
itemMenuBaseTab()
gameButtonItems()
gameButtonAchievement()
getLocation()
