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

function clickItemButton() {
    itemsButton.classList.toggle("border-blue-400")
    itemsMenu.classList.toggle("hidden")
}

function clickItemCloseButton() {
    itemsButton.classList.toggle("border-blue-400")
    itemsMenu.classList.toggle("hidden")
}

// execute functions
gameButtonPet()
gameButtonItems()