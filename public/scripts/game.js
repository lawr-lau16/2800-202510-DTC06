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

// Get pet data from server

let pet;
document.addEventListener("DOMContentLoaded", async () => {
    pet = await getPetData();
});
async function getPetData() {
    try {
        const response = await fetch("/user/pet");
        const petData = await response.json();
        console.log(petData);
        return petData;
    } catch (err) {
        console.error(err);
    }
}

async function navbarStats() {
    try {
        const response = await fetch('/inventory', { method: 'POST' });
        const { coins } = await response.json();
        coinsStat = document.getElementById("coin-stat")
        coinsStat.innerHTML = 10

    } catch (err) {
        console.error("Failed to load inventory:", err);
    } try {
        const response = await fetch('/pet', { method: 'POST' });
        const { pet } = await response.json();
        happinessStat = document.getElementById("happiness-stat")
        happinessStat.innerHTML = pet.happiness
    } catch (err) {
        console.error("Error loading pet:", err);
    }
}

async function updatePetData(updatedPet) {
    try {
        const response = await fetch('/user/pet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPet),
        });
        if (!response.ok) {
            throw new Error('Failed to update pet data');
        }
        const updatedPetFromServer = await response.json();
        console.log('Updated pet data:', updatedPetFromServer);
        happinessStat = document.getElementById("happiness-stat")
        happinessStat.innerHTML = pet.happiness
    } catch (err) {
        console.error(err);
    }
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

// changes Ami's expression temporarily and +1 to happiness
function amiPetHappy() {
    amiExpression.src = "images/game/Ami-Expressions/happy.png";
    setTimeout(() => {
        amiExpression.src = "images/game/Ami-Expressions/default.png";
    }, 700);
    pet.happiness += 1;

    // Cap off at 100
    pet.happiness = Math.min(100, pet.happiness);

    const newDate = new Date();
    pet.lastPetted = newDate;
    console.log("Happiness +1 after pet", pet.happiness)

    // Live replace the happy value with the new one
    updatePetData(pet);

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

// Keep current menu in local storage
function currentMenu() {
    currentTab = localStorage.getItem("tab-menu");
    console.log(currentTab)
    if (currentTab === null || currentTab === "item")
        dynamicallyDisplayItems()
    else if (currentTab === "base")
        dynamicallyDisplayBase()
}

// Function to select current item/base
async function itemSelected() {
    const response = await fetch('/pet', { method: 'POST' });
    const { pet } = await response.json();
    for (let child of document.getElementById("items").children) {
        if (child.classList.contains("border-[#3EC3DE]")) {
            currentItem.classList.replace("border-[#3EC3DE]", "border-black")
            currentItem.classList.remove("outline-1", "outline-[#3EC3DE]")
        }
    }
    if (pet.item == "") {
        currentItem = document.getElementById("no-item")
        currentItem.classList.replace("border-black", "border-[#3EC3DE]")
        currentItem.classList.add("outline-1", "outline-[#3EC3DE]")
    } else {

        currentItem = document.getElementById(pet.item)
        currentItem.classList.replace("border-black", "border-[#3EC3DE]")
        currentItem.classList.add("outline-1", "outline-[#3EC3DE]")
    }
}

// Populates Items menu with available items 
async function dynamicallyDisplayItems() {

    itemsDiv = document.getElementById("items");
    
    localStorage.setItem("tab-menu", "item");

    itemsDiv.innerHTML = "";

    // Array must contain items by exact name of the images for items
    // May be replaced by db future on

    const itemsAvailable = ["heart", "sprout", "star", "flower", "bow", "bowtie", "headband", "partyhat"];
    // itemsOwned = [];

    let itemsOwned = await getInventory()

    amiItem = document.getElementById("ami-item");

    itemsAvailable.forEach(item => {
        eachItem = document.createElement("div");
        eachItem.id = item;
        // Sets class list for each new div
        eachItem.classList = "bg-white size-18 m-2 border-4 rounded-lg hover:cursor-pointer group border-black hover:border-[#026475] transition";
        // Goes through which items the user owns
        // If they don't have the item, it will be locked in the menu
        if (itemsOwned.includes(item)) {
            eachItem.innerHTML = `<div class="relative flex size-full">
            <img src="images/game/Items/i-${item}.png" class="absolute"></div>`
        } else {
            eachItem.classList.replace("bg-white", "bg-[#d9d9d9]")
            eachItem.innerHTML = `
            <div class="relative flex size-full">
                <div class="size-full flex flex-col z-1">
                    <i class="mx-auto mt-auto mb-2 fa-solid fa-lock fa-xl group-hover:opacity-80"></i>
                    <div class="text-[#0a67a0] rounded-lg border-[#026475] h-6 w-12 mx-auto border-3 font-bold flex items-center justify-center select-none bg-[#026475] translate-y-4">
                        <img src="/images/navbar/coin.png" alt="" class="size-4 mx-1">
                        <p class="items-center text-white tracking-wide drop-shadow-sm mr-1">10</p>
                    </div>
                </div>
                <img src="images/game/Items/i-${item}.png" class="absolute brightness-85 group-hover:brightness-100 transition">
            </div>
            `;
            eachItem.classList.add("locked")
        }
        itemsDiv.append(eachItem);
    });

    // Creates no item option
    blankItem = document.createElement("div");
    blankItem.classList = "bg-white size-18 m-2 border-4 rounded-lg hover:cursor-pointer border-black hover:border-[#3EC3DE] transition"
    blankItem.id = "no-item"
    blankItem.innerHTML = `<div class="relative flex size-full">
            <img src="" class="absolute">
            </div>`
    itemsDiv.prepend(blankItem);
    itemSelected()

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
        itemSelected()
    })

    itemsAvailable.forEach(item => {
        eachItem = document.getElementById(item);

        if (eachItem.classList.contains("locked")) {
            eachItem.addEventListener("click", async () => {

                price = 10
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
                    navbarStats()
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
                itemSelected()
            })
        }
    });

}

// Populates Items menu with available base 
async function dynamicallyDisplayBase() {
    itemsDiv = document.getElementById("items");

    localStorage.setItem("tab-menu", "base");

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
        goldBase.innerHTML = ` <div class="relative flex size-full">
                <div class="size-full flex flex-col z-1">
                    <i class="mx-auto mt-auto fa-solid fa-lock fa-xl"></i>
                    <p class="mx-auto mt-3">999</p>
                </div>
                <img src="images/game/Ami-Base/i-gold.png" class="absolute size-full">
            </div>
            `;
        goldBase.classList.add("locked")
    }
    itemsDiv.append(goldBase);
    itemSelected()
    baseAll.forEach(base => {
        eachBase = document.getElementById(base);

        if (eachBase.classList.contains("locked")) {
            eachBase.addEventListener("click", async () => {

                price = 999
                console.log("locked")
                const res = await fetch('/inventory', { method: 'POST' });
                const { inventory, coins } = await res.json();
                if (coins < price) {
                    return alert("Not enough coins!");
                }
                if (window.confirm(`Buy ${base}?`)) {
                    const updatedInventory = [...inventory, base];
                    const updatedCoins = coins - price;
                    await fetch('/inventory/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ inventory: updatedInventory, coins: updatedCoins })
                    });
                    dynamicallyDisplayBase()
                    navbarStats()
                }
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
                itemSelected()
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
currentMenu()
// dynamicallyDisplayBase()
itemMenuItemTab()
itemMenuBaseTab()
gameButtonItems()
gameButtonAchievement()
getLocation()
getPetData()