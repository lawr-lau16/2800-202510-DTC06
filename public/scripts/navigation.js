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

function navigationSidebarToggle() {
    document.getElementById("sidebar").classList.toggle("w-14");
    document.getElementById("sidebar").classList.toggle("w-0");
    document.getElementById("content").classList.toggle("md:ml-14");
    document.querySelectorAll("#sidebar form").forEach(function (elem) {
        elem.classList.toggle("hidden")
    });
    document.querySelector("#navigationToggle i").classList.toggle("fa-flip-horizontal");
}

// execute functions
navigationCurrent()