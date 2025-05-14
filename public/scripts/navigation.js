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


function navigationSidebar() {
    navigationToggle = document.getElementById("navigation_toggle")
    sidebar = document.getElementById("sidebar")
    content = document.getElementById("content")
    content.style.transition = "0.3s"
    navigationToggle.addEventListener("click", navigationSidebarOpen)
}

function navigationSidebarOpen() {
    sidebar.style.width = "180px";
    sidebar.style.transitionDelay = "0s";
    content.style.marginLeft = "180px"
    content.style.transitionDelay = "0s";
    // content.style.transitionDelay = "0.3s";
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

function navigationSidebarClose() {
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

// execute functions
navigationCurrent()
navigationSidebar()