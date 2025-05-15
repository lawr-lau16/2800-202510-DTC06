function navigationCurrent() {
    let current = window.location.pathname;
    document.querySelectorAll("#nav_highlight form").forEach(function (elem) {
        if (elem.action.includes(current)) {
            elem.classList.add("bg-[#1c9db7]", "hover:bg-[#0b779a]", "text-white", "transition");
        } else {
            elem.classList.add("hover:bg-[#1c9db7]", "transition")
        }
    });
}

// sets sidebar navigation toggle
function navigationSidebar() {
    navigationToggle = document.getElementById("navigation_toggle")
    sidebar = document.getElementById("sidebar")
    content = document.getElementById("content")
    content.style.transition = "0.3s"
    navigationToggle.addEventListener("click", navigationSidebarOpen)
}

// function to open sidebar
function navigationSidebarOpen() {
    sidebar.classList.toggle("open")
    sidebar.style.width = "180px";
    sidebar.style.transitionDelay = "0s";
    content.style.marginLeft = "180px"
    content.style.transitionDelay = "0s";
    document.querySelectorAll("#sidebar .hide").forEach(function (elem) {
        elem.classList.remove("hidden")
    });
    setTimeout(function () {
        document.querySelectorAll("#sidebar .hide").forEach(function (elem) {
            elem.style.opacity = "100"
        });
    }, 200)

    document.querySelector("#navigation_toggle i").classList.add("transition");
    document.querySelector("#navigation_toggle i").classList.remove("fa-flip-horizontal");
    navigationToggle.removeEventListener("click", navigationSidebarOpen)
    navigationToggle.addEventListener("click", navigationSidebarClose)
}

// function to close sidebar
function navigationSidebarClose() {
    sidebar.classList.toggle("open")
    sidebar.style.width = "56px";
    sidebar.style.transitionDelay = "0.2s";
    content.style.marginLeft = "56px"
    content.style.transitionDelay = "0.2s";
    document.querySelectorAll("#sidebar .hide").forEach(function (elem) {
        elem.style.opacity = "0"
    });
    setTimeout(function () {
        document.querySelectorAll("#sidebar .hide").forEach(function (elem) {
            elem.classList.add("hidden")
        });
    }, 200)
    document.querySelector("#navigation_toggle i").classList.toggle("fa-flip-horizontal")
    navigationToggle.removeEventListener("click", navigationSidebarClose)
    navigationToggle.addEventListener("click", navigationSidebarOpen)
}

// function to change main content to 0 if mobile
function resetWidthContent() {
    if (window.screen.width < 768) {
        content.style.marginLeft = "0px"
    }
    else if (window.screen.width > 768) {
        if (sidebar.classList.contains("open"))
            content.style.marginLeft = "180px"
        else if (!sidebar.classList.contains("open"))
            content.style.marginLeft = "56px"
    }
}

// function to get user's coins and Ami's happiness from db
// displays it on navbar
async function navbarStats() {
    try {
        const response = await fetch('/inventory', { method: 'POST' });
        const { coins } = await response.json();
        coinsDiv = document.getElementById("nav-coins")
        coinsDiv.innerHTML = coins
    } catch (err) {
        console.error("Failed to load inventory:", err);
    } try {
        const response = await fetch('/pet', { method: 'POST' });
        const { pet } = await response.json();
        happinessDiv = document.getElementById("nav-happiness")
        happinessDiv.innerHTML = pet.happiness
    } catch (err) {
        console.error("Error loading pet:", err);
    }
}

// execute functions
window.addEventListener('resize', resetWidthContent)
navbarStats()
navigationCurrent()
navigationSidebar()