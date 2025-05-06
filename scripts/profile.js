console.log("Loaded user:", user);

window.addEventListener('DOMContentLoaded', () => {
    if (!user) {
        console.warn("User object not found.");
        return;
    }

    document.getElementById('name').value = user.username || '';
    document.getElementById('dailyBudget').value = user.Budget?.daily ?? '';
    document.getElementById('weeklyBudget').value = user.Budget?.weekly ?? '';
    document.getElementById('monthlyBudget').value = user.Budget?.monthly ?? '';
});
