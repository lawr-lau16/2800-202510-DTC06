// Debug
// console.log("Loaded user:", user);

// This object connects each input field's ID to the matching name used on the server
const fieldMap = {
    name: 'username',
    password: 'password',
    weeklyBudget: 'weekly',
    monthlyBudget: 'monthly'
};

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

    // Add a click event to each save button
    document.querySelectorAll('.save-button').forEach(button => {
        // Get the name field save button
        const field = button.dataset.field;

        button.addEventListener('click', () => {
            showConfirmModal(field);
        });
    });

    setAmi()
});


let pendingField = null; // Temporarily store field name for confirmation

function showConfirmModal(field) {
    pendingField = field;
    const confirmModal = document.getElementById("confirmModal");
    const confirmMessage = document.getElementById("confirmMessage");
    confirmMessage.textContent = `Save changes to ${field}?`;
    confirmModal.classList.remove("hidden");
}

function cancelConfirm() {
    document.getElementById("confirmModal").classList.add("hidden");
    pendingField = null;
}

async function confirmSave() {
    document.getElementById("confirmModal").classList.add("hidden");

    if (!pendingField) return;

    const field = pendingField;
    const input = document.getElementById(field);
    const value = input.value;
    const payload = {};

    if (fieldMap[field]) {
        payload[fieldMap[field]] = (field === 'weeklyBudget' || field === 'monthlyBudget') ? Number(value) : value;
    }

    const response = await fetch('/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        showSaveModal(`${field} saved!`);
    } else {
        const { error } = await response.json();
        alert('Error saving: ' + error);
    }

    pendingField = null;
}


function showSaveModal(message) {
    const modal = document.getElementById("saveModal");
    const messageBox = document.getElementById("saveModalMessage");
    messageBox.textContent = message;
    modal.classList.remove("hidden");
}

function closeSaveModal() {
    const modal = document.getElementById("saveModal");
    modal.classList.add("hidden");
    window.location.reload();
}

document.getElementById('weeklyBudget').addEventListener('keypress', function (event) {
    if (event.key === '-' || event.key === 'e') {
        event.preventDefault();
    }
});

document.getElementById('monthlyBudget').addEventListener('keypress', function (event) {
    if (event.key === '-' || event.key === 'e') {
        event.preventDefault();
    }
});