// Debug
// console.log("Loaded user:", user);

// Wait for the whole page to finish loading before running this code
window.addEventListener('DOMContentLoaded', () => {

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

    // This object connects each input field's ID to the matching name used on the server
    const fieldMap = {
        name: 'username',
        password: 'password',
        weeklyBudget: 'weekly',
        monthlyBudget: 'monthly'
    };

    // Add a click event to each save button
    document.querySelectorAll('.save-button').forEach(button => {
        // Get the name field save button
        const field = button.dataset.field;

        button.addEventListener('click', async () => {
            // Popuo asking to confirm before saving the change
            const confirmed = confirm(`Save changes to ${field}?`);
            if (!confirmed) return;

            // Get the new value from input box
            const input = document.getElementById(field);
            const value = input.value;

            // Create the data to send to the server
            const payload = {};

            // Only include the field we are updating
            if (fieldMap[field]) {
                // If it's a number (like budgets), convert the text to a number
                if (field === 'weeklyBudget' || field === 'monthlyBudget') {
                    payload[fieldMap[field]] = Number(value);
                    // Else, just use the text as-is
                } else {
                    payload[fieldMap[field]] = value;
                }
            }

            // Send the updated data to the server using fetch
            const response = await fetch('/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // If the update worked, show a message and reload the page
            if (response.ok) {
                alert(`${field} saved!`);
                window.location.reload();
                // Else, show the error
            } else {
                const { error } = await response.json();
                alert('Error saving: ' + error);
            }
        });
    });

    setAmi()
});