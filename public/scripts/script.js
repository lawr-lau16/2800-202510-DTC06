// makes all buttons have cursor pointer when hovered
function hoverButton() {
    const allButtons = document.querySelectorAll("button")
    allButtons.forEach(button => {
        button.classList.add("hover:cursor-pointer")
    });
}

hoverButton()