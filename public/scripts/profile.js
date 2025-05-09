// Debug
// console.log("Loaded user:", user);

window.addEventListener('DOMContentLoaded', () => {
    if (!user) {
        console.warn("User object not found.");
        return;
    }

    // Populate fields
    document.getElementById('name').value = user.username || '';
    document.getElementById('password').value = '';
    document.getElementById('dailyBudget').value = user.budget?.daily ?? '';
    document.getElementById('weeklyBudget').value = user.budget?.weekly ?? '';
    document.getElementById('monthlyBudget').value = user.budget?.monthly ?? '';

    // Field mapping
    const fieldMap = {
        name: 'username',
        password: 'password',
        dailyBudget: 'daily',
        weeklyBudget: 'weekly',
        monthlyBudget: 'monthly'
    };

    // Save button handlers
    document.querySelectorAll('.save-button').forEach(button => {
        const field = button.dataset.field;
        button.addEventListener('click', async () => {
            const confirmed = confirm(`Save changes to ${field}?`);
            if (!confirmed) return;

            const value = document.getElementById(field).value;
            const mapped = fieldMap[field];

            // Create payload with current values, then overwrite the one being edited
            const payload = {
                username: user.username,
                password: '',  // let user set new password if they choose
                daily: user.budget?.daily,
                weekly: user.budget?.weekly,
                monthly: user.budget?.monthly
            };

            // Only update the changed field
            if (mapped === 'username') {
                payload.username = value;
            } else if (mapped === 'password') {
                payload.password = value;
            } else {
                payload[mapped] = value;
            }

            try {
                const response = await fetch('/profile/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert(`${field} saved!`);
                    window.location.reload();
                } else {
                    const { error } = await response.json();
                    alert('Error saving: ' + error);
                }
            } catch (err) {
                alert('Network error: ' + err.message);
            }
        });
    });
});

