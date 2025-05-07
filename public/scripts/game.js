// Add pet button functionality
function gameButtonPet() {
    petButton = document.getElementById("game-pet");
    ami = document.getElementById("ami");
    amiExpression = document.getElementById("ami-expression")
    petButton.addEventListener("click", clickPetButton)
}

// Function to be executed when pet button is selected
function clickPetButton() {
    petButton.classList.toggle("border-blue-400")
    ami.classList.toggle("hover:cursor-pointer")
    // Ami becomes interactable
    ami.addEventListener("click", amiPetHappy)
    // event listener to remove interactability when user clicks button again
    petButton.addEventListener("click", removePetEventListener)
}

// changes Ami's expression temporarily
function amiPetHappy() {
    amiExpression.src = "images/game/Ami-Expressions/happy.png";
    setTimeout(() => {
        amiExpression.src = "images/game/Ami-Expressions/default.png"
    }, 700);
}

// Function to remove Ami clickability
function removePetEventListener() {
    ami.removeEventListener("click", amiPetHappy)
    petButton.removeEventListener("click", removePetEventListener)
}

// Add Items button functionality
function gameButtonItems() {
    itemsButton = document.getElementById("game-items");
    ami = document.getElementById("ami");
    amiItem = document.getElementById("ami-item")
    itemsMenu = document.getElementById("items-menu")
    itemsCloseMenu = document.getElementById("close-menu")

    itemsButton.addEventListener("click", clickItemButton)
    itemsCloseMenu.addEventListener("click", clickItemCloseButton)
}
// Open Items menu
function clickItemButton() {
    itemsButton.classList.toggle("border-blue-400")
    itemsMenu.classList.toggle("hidden")
}

// Close Items menu
function clickItemCloseButton() {
    itemsButton.classList.toggle("border-blue-400")
    itemsMenu.classList.toggle("hidden")
}

// Populates Items menu with available items 
function dynamicallyDisplayItems() {
    itemsDiv = document.getElementById("items")
    itemsDiv.innerHTML = ""
    // Array must contain items by exact name of the images for items
    // May be replaced by db future on
    const itemsAvailable = ["heart", "sprout", "star"]
    amiItem = document.getElementById("ami-item")

    itemsResult = ""
    itemsAvailable.forEach(item => {
        eachItem = document.createElement("div")
        eachItem.id = item
        eachItem.classList = "bg-white size-18 m-4 border-4 rounded-lg hover:cursor-pointer"
        eachItem.innerHTML = `<img src="images/game/Items/${item}.png" class=""></img>`
        itemsDiv.append(eachItem)
    });

    // itemsAvailable.forEach(item => {
    //     eachItem = document.getElementById(item)
    //     // console.log(itemsDiv.children[i])
    //     eachItem.addEventListener("click", () => {
    //         document.getElementById(item).classList.toggle("border-blue-400")
    //         // amiItem = none
    //     })
    // });

}


// execute functions
gameButtonPet()
dynamicallyDisplayItems()
gameButtonItems()