// Fetch achievement data from the server
fetch('/achievements/data')
  .then(res => res.json())
  .then(data => {
    // Get the container where achievements will be displayed
    const container = document.getElementById('achievements-container');
    container.innerHTML = '';

    // Create redeem button on completed achievements
    const createAchievementElement = (a, isActive) => {
      // Calculate completion percentage, capped at 100%
      const percent = Math.min(Math.round((a.progress / a.target) * 100), 100);
      // Determine if it's ready to redeem (complete but not yet claimed)
      const isCompleted = a.progress >= a.target && !a.completed;
      // Determine if it's already claimed
      const isClaimed = a.progress >= a.target && a.completed;
      // Create outer card element
      const div = document.createElement('div');
      div.className = 'flex justify-between items-start bg-white p-4 rounded-lg shadow-sm mb-4';
      // Fill in card content
      div.innerHTML = `
        <div class="flex items-start gap-3 w-full">
          <!-- Achievement Icon -->
          <img src="/images/achievements/${a.type.toLowerCase()}.png" class="size-10 mt-1" alt="${a.type}">

          <!-- Achievement and Progress Bar -->
          <div class="flex-1">
            <p class="text-sm leading-snug">${a.description}</p>
            <div class="bg-gray-300 h-2 rounded-full mt-2">
              <div class="bg-green-600 h-2 rounded-full" style="width: ${percent}%"></div>
            </div>
          </div>

          <!-- Reward / Coin Image and Button -->
          <div class="flex flex-col items-end justify-between text-right min-w-[60px]">
            <div class="flex items-center justify-end gap-1">
              <span class="font-semibold">${a.reward}</span>
              <img src="/images/achievements/coin.png" class="size-6" alt="Coin">
            </div>
            ${isCompleted
          ? `<button class="redeem-btn hover:cursor-pointer bg-yellow-400 border-yellow-500 text-white text-sm px-2 py-1 rounded-xl border-4 font-semibold hover:bg-yellow-300 hover:border-yellow-400 active:bg-yellow-200 transition mt-1" data-id="${a._id}">Redeem</button>`
          : !isActive
            ? `<button class="activate-btn hover:cursor-pointer bg-[#089ddd] border-[#0a67a0] text-white text-sm px-2 py-1 rounded-xl border-4 font-semibold hover:bg-[#44bcf0] hover:border-[#0c79bf] active:bg-[#5edfff] transition mt-1" data-id="${a._id}">Activate</button>`
            : isClaimed
              ? `<span class="text-[10px] text-gray-400 mt-2 leading-tight text-right">Reward<br>claimed</span>`
              : ''
        }
          </div>
        </div>
      `;
      return div;
    };

    // Active section
    const activeHeader = document.createElement('h2');
    activeHeader.textContent = 'Active Achievements';
    activeHeader.className = 'text-xl font-bold mb-2';

    container.appendChild(activeHeader);

    // If there are no active active achievements, show a card reminding user to active a new one
    if (data.active.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'bg-white text-gray-500 p-4 rounded-lg border border-gray-300 text-center italic mb-4';
      emptyCard.textContent = 'You have no active achievements right now. Go ahead and pick a goal for yourself!';
      container.appendChild(emptyCard);
    } else {
      // Render each active achievement card
      data.active.forEach(a => container.appendChild(createAchievementElement(a, true)));
    }

    // Inactive section
    const inactiveHeader = document.createElement('h2');
    inactiveHeader.textContent = 'Inactive Achievements';
    inactiveHeader.className = 'text-xl font-bold mt-6 mb-2';
    container.appendChild(inactiveHeader);
    data.inactive.forEach(a => container.appendChild(createAchievementElement(a, false)));

    // Completed section
    const completedHeader = document.createElement('h2');
    completedHeader.textContent = 'Completed Achievements';
    completedHeader.className = 'text-xl font-bold mt-6 mb-2';
    container.appendChild(completedHeader);

    // Change styling on completed achievements to look dimmed
    data.completed.forEach(a => {
      const card = createAchievementElement(a, true);
      card.classList.add('opacity-50');
      container.appendChild(card);
    });

    // Change header colour to white for achievements game page
    if (window.location.href.includes("game")) {
      document.querySelectorAll("h2").forEach(header => {
        header.classList.add("text-white")
      });
    }

    // Add click listener to activate buttons
    document.querySelectorAll('.activate-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const achievementId = btn.dataset.id;
        // Send activation request to backend
        const response = await fetch('/achievements/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: achievementId })
        });
        const result = await response.json();
        // On success, reload the page to refresh achievement status
        if (result.success) {
          location.reload();
        } else {
          // On error, alert the user with error message
          alert(result.error || 'Failed to activate');
        }
      });
    });

    // Add click listener to redeem buttons
    document.addEventListener('click', async (e) => {
      // Check if element clicked is 'redeem-btn'
      if (e.target.classList.contains('redeem-btn')) {
        // Get achievement ID
        const id = e.target.dataset.id;

        try {
          // Send POST request to server to redeem the achievement
          const res = await fetch('/achievements/redeem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });

          // If request failed, notify user
          if (!res.ok) {
            const errorText = await res.text();
            console.error("Server error:", errorText);
            alert("Failed to redeem reward. Please make sure you're logged in.");
            return;
          }

          // If no error, show success message with coins earned
          const result = await res.json();

          // Modal
          showRewardModal(result.reward);
          // Update coin display without full reload
          const coinDisplay = document.querySelector(".text-4xl.font-bold");
          if (coinDisplay) {
            coinDisplay.textContent = parseInt(coinDisplay.textContent) + result.reward;
          }

        } catch (err) {
          // Handle network or runtime errors
          console.error('Redeem failed:', err);
          alert('Redeem failed. Try again.');
        }
      }
    });
  })


// Modal
function showRewardModal(coins) {
  const modal = document.getElementById("rewardModal");
  const message = document.getElementById("rewardMessage");
  message.textContent = `+${coins} coins earned!`;
  modal.classList.remove("hidden");
}

function closeRewardModal() {
  const modal = document.getElementById("rewardModal");
  modal.classList.add("hidden");
  location.reload();
}
