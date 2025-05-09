// Function to load HTML component into an element
function loadComponent(url, element) {
    fetch(url)
        .then(response => {
            return response.text();
        })
        .then(body => {
            element.innerHTML = body;
        });
};

// Function to style that element
function styleComponentContainer() {
    // Get component container
    navBottom = document.getElementById("nav_bottom")
    navTop = document.getElementById("nav_top")
    // Change the class list for the container
    navBottom.classList = "sticky bottom-0 justify-around flex bg-blue-300 md:hidden"
    navTop.classList = "sticky top-0 md:justify-between flex bg-blue-300 p-4"
}

// Execute functions
loadComponent("/components/nav_top.html", document.getElementById("nav_top"))
loadComponent("/components/nav_bottom.html", document.getElementById("nav_bottom"))
styleComponentContainer()