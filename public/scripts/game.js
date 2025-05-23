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
    amiSad()
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

// updates data in 
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
    petButton.classList.toggle("border-[#22899e]");
    petButton.classList.toggle("border-[#5edfff]");
    petButton.classList.toggle("scale-105");
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
        if (pet.happiness < 25) {
            amiExpression.src = "/images/game/Ami-Expressions/sad.png";
            gameButton.classList.add("animate-[wiggle_1s_ease-in-out_infinite]")
        }
        else {
            amiExpression.src = "/images/game/Ami-Expressions/default.png"
            gameButton.classList.remove("animate-[wiggle_1s_ease-in-out_infinite]")
        }
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

// if Ami's happiness is below 30, they become sad :( 
async function amiSad() {
    const response = await fetch('/pet', { method: 'POST' });
    const { pet } = await response.json();
    amiExpression = document.getElementById("ami-expression");
    gameButton = document.getElementById("game-pet");
    if (pet.happiness < 25) {
        amiExpression.src = "/images/game/Ami-Expressions/sad.png";
        gameButton.classList.add("animate-[wiggle_1s_ease-in-out_infinite]")
    }
    else {
        amiExpression.src = "/images/game/Ami-Expressions/default.png"
        gameButton.classList.remove("animate-[wiggle_1s_ease-in-out_infinite]")
    }
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

// hide buttons
function hideButtons() {
    menuButtons = document.getElementById("menu-buttons")
    menuButtons.classList.replace("opacity-100", "opacity-0")
}

// show buttons
function showButtons() {
    menuButtons = document.getElementById("menu-buttons")
    menuButtons.classList.replace("opacity-0", "opacity-100")
}

// Open Items menu
function clickItemButton() {
    itemsMenu.classList.replace("rotate-x-270", "rotate-x-0");
    itemsMenu.classList.replace("ease-in", "ease-out");
    hideButtons()
}

// Close Items menu
function clickItemCloseButton() {
    itemsMenu.classList.replace("rotate-x-0", "rotate-x-270");
    itemsMenu.classList.replace("ease-in", "ease-out");
    itemsMenu.classList.replace("ease-out", "ease-in");
    showButtons()
}

// Tab to change Ami's colour
function itemMenuBaseTab() {
    itemBaseTab.addEventListener("click", currentBaseTab)
}

// sets current item tab + styling to base tab
function currentBaseTab() {
    itemBaseTab = document.getElementById("items-menu-base");
    itemItemsTab = document.getElementById("items-menu-item");
    itemText = document.getElementById("item-text")
    baseText = document.getElementById("base-text")
    itemBaseTab.classList = "bg-[#31afc9] border-[#0c4049] text-white text-sm px-2 py-1 rounded-xl border-4 font-bold hover:cursor-pointer m-1 hover:bg-[#3EC3DE] active:bg-[#5edfff] transition outline-2 outline-[#3EC3DE]"
    itemItemsTab.classList = "border-[#0c4049] text-white px-2 py-1 text-sm rounded-xl border-4 font-bold hover:cursor-pointer m-1 hover:bg-[#31afc9]/50 active:border-[#5edfff] hover:text-white active:bg-[#5edfff] transition"
    itemText.classList = "text-current"
    baseText.classList = "text-white"
    dynamicallyDisplayBase()
}

// Tab to change Ami's item
function itemMenuItemTab() {
    itemItemsTab.addEventListener("click", currentItemTab)
}

// sets current item tab + styling to items tab
function currentItemTab() {
    itemBaseTab = document.getElementById("items-menu-base");
    itemItemsTab = document.getElementById("items-menu-item");
    itemText = document.getElementById("item-text")
    baseText = document.getElementById("base-text")
    itemItemsTab.classList = "bg-[#31afc9] border-[#0c4049] text-white text-sm px-2 py-1 rounded-xl border-4 font-bold hover:cursor-pointer m-1 hover:bg-[#3EC3DE] active:bg-[#5edfff] transition outline-2 outline-[#3EC3DE]"
    itemBaseTab.classList = "border-[#0c4049] text-white px-2 py-1 text-sm rounded-xl border-4 font-bold hover:cursor-pointer m-1 hover:bg-[#31afc9]/50 active:border-[#5edfff] hover:text-white active:bg-[#5edfff] transition"
    baseText.classList = "text-current"
    itemText.classList = "text-white"
    dynamicallyDisplayItems()
}

// Gets inventory from db
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
        currentItemTab()
    else if (currentTab === "base")
        currentBaseTab()
}

// Function to select current item/base
async function itemSelected() {
    // Gets user item/base from db
    const response = await fetch('/pet', { method: 'POST' });
    const { pet } = await response.json();
    itemsDiv = document.getElementById("items");
    // Makes sure all the options are unselected before styling the active button
    for (let child of document.getElementById("items").children) {
        if (child.classList.contains("border-[#3EC3DE]")) {
            currentItem.classList.replace("border-[#3EC3DE]", "border-black")
            currentItem.classList.remove("scale-105")
        }
    }
    // Style active button
    if (itemsDiv.classList.contains("items-tab"))
        if (pet.item === '')
            currentItem = document.getElementById("no-item")
        else
            currentItem = document.getElementById(pet.item)
    else if (itemsDiv.classList.contains("base-tab"))
        currentItem = document.getElementById(pet.base)
    currentItem.classList.replace("border-black", "border-[#3EC3DE]")
    currentItem.classList.add("scale-105")
}

// Populates Items menu with available items 
async function dynamicallyDisplayItems() {

    itemsDiv = document.getElementById("items");

    itemsDiv.classList.add("items-tab")
    itemsDiv.classList.remove("base-tab")

    localStorage.setItem("tab-menu", "item");

    itemsDiv.innerHTML = "";

    // Array must contain items by exact name of the images for items
    const itemsAvailable = ["heart", "sprout", "star", "flower", "bow", "bowtie", "headband", "partyhat"];

    let itemsOwned = await getInventory()

    amiItem = document.getElementById("ami-item");

    itemsAvailable.forEach(item => {
        eachItem = document.createElement("div");
        eachItem.id = item;
        // Sets class list for each new div
        eachItem.classList = "bg-white size-18 m-2 border-4 outline-2 outline-white rounded-lg hover:cursor-pointer group border-black transition hover:scale-105";
        // Goes through which items the user owns
        // If they don't have the item, it will be locked in the menu
        if (itemsOwned.includes(item)) {
            eachItem.innerHTML = `<div class="relative flex size-full">
            <img src="images/game/Items/i-${item}.png" class="absolute rounded-sm"></div>`
        } else {
            eachItem.classList.replace("bg-white", "bg-[#d9d9d9]")
            eachItem.innerHTML = `
            <div class="relative flex size-full">
                <div class="size-full flex flex-col z-1">
                    <i class="mx-auto mt-auto mb-2 fa-solid fa-lock fa-xl transition group-hover:opacity-80 group-hover:scale-110"></i>
                    <div class="text-[#0a67a0] rounded-lg border-[#026475] h-6 w-12 mx-auto border-3 font-bold flex items-center justify-center select-none bg-[#3EC3DE] translate-y-4 transition group-hover:scale-105">
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
    blankItem.classList = "bg-white size-18 m-2 border-4 outline-2 outline-white rounded-lg hover:cursor-pointer border-black transition hover:scale-105"
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

    // adds the button function
    itemsAvailable.forEach(item => {
        eachItem = document.getElementById(item);

        // adds the locked item function
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
            // Adds the unlocked items
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

    itemsDiv.classList.remove("items-tab")
    itemsDiv.classList.add("base-tab")

    localStorage.setItem("tab-menu", "base");

    itemsDiv.innerHTML = "";

    const baseAvailable = ["white", "black", "blue", "red", "green", "yellow", "camel"];
    const baseAll = ["white", "black", "blue", "red", "green", "yellow", "camel", "gold"];
    // used to see if user has gold
    let itemsOwned = await getInventory()
    amiBase = document.getElementById("ami-base");

    baseAvailable.forEach(base => {
        eachBase = document.createElement("div");
        eachBase.id = base;
        // Sets class list for each new div
        eachBase.classList = "bg-white size-18 m-2 border-4 outline-2 outline-white rounded-lg hover:cursor-pointer group border-black transition overflow-hidden hover:scale-105";
        eachBase.innerHTML = `<div class="relative flex size-full">
            <img src="images/game/Ami-Base/i-${base}.png" class="mx-auto"></div>`
        itemsDiv.append(eachBase);
    });

    // Special gold base
    goldBase = document.createElement("div");
    goldBase.id = "gold"
    goldBase.classList = "bg-white size-18 m-2 border-4 outline-2 outline-white rounded-lg hover:cursor-pointer group border-black transition hover:scale-105";
    if (itemsOwned.includes("gold")) {
        goldBase.innerHTML = `<div class="relative flex size-full">
            <img src="images/game/Ami-Base/i-gold.png" class="mx-auto"></div>`
    } else {
        goldBase.innerHTML = `
            <div class="relative flex size-full">
                <div class="size-full flex flex-col z-1">
                    <i class="mx-auto mt-auto mb-2 fa-solid fa-lock fa-xl group-hover:opacity-80 transition group-hover:scale-110"></i>
                    <div class="text-[#0a67a0] rounded-lg border-[#026475] outline-2 outline-white h-6 w-15 mx-auto border-3 font-bold flex items-center justify-center select-none bg-[#3EC3DE] translate-y-4 transition group-hover:scale-105">
                        <img src="/images/navbar/coin.png" alt="" class="size-4 mx-1">
                        <p class="items-center text-white drop-shadow-sm mr-1">999</p>
                    </div>
                </div>
                <img src="images/game/Ami-Base/i-gold.png" class="rounded-sm size-full absolute brightness-85 group-hover:brightness-100 transition">
            </div>
            `;
        goldBase.classList.add("locked")
    }

    itemsDiv.append(goldBase);
    itemSelected()
    baseAll.forEach(base => {
        eachBase = document.getElementById(base);

        // Adds locked base function
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
            // Adds unlocked base function
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
    achievementMenu.classList.replace("rotate-x-270", "rotate-x-0");
    achievementMenu.classList.replace("ease-in", "ease-out");
    hideButtons()
}

// Close Items menu
function clickAchievementCloseButton() {
    achievementMenu.classList.replace("rotate-x-0", "rotate-x-270");
    achievementMenu.classList.replace("ease-out", "ease-in");
    showButtons()
}


// Open items from achievements tab
function openItemsFromAchievemnts() {
    clickAchievementCloseButton()
    setTimeout(() => {
        clickItemButton()
    }, 100)
}

// Open items from achievements tab
function openAchievemntsFromItems() {
    clickItemCloseButton()
    setTimeout(() => {
        clickAchievementButton()
    }, 100)
}


// For the weather
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, fail);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// Gets user location and fetches the weather
async function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    gameWindow = document.getElementById("game-window")
    try {
        const response = await axios.get(`/weather?lat=${lat}&lon=${lon}`);
        const weatherData = response.data.weather[0].main;
        // changes the image depending on the weather
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
itemMenuItemTab()
itemMenuBaseTab()
gameButtonItems()
gameButtonAchievement()
getLocation()
getPetData()