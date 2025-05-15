fetch('/achievements/data')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('achievements-container');
    container.innerHTML = '';

    // Create redeem button on completed achievements
    const createAchievementElement = (a, isActive) => {
      const percent = Math.min(Math.round((a.progress / a.target) * 100), 100);
      const isCompleted = a.progress >= a.target && !a.completed;
      const isClaimed = a.progress >= a.target && a.completed;

      const div = document.createElement('div');
      div.className = 'flex items-center justify-between bg-gray-50 p-4 rounded-lg drop-shadow-sm mb-4';

      div.innerHTML = `
    <div class="flex items-center mr-2">
      <img src="/images/achievements/${a.type.toLowerCase()}.png" class="size-10 mr-2" alt="${a.type}">
      <div>
        <p>${a.description}</p>
        <div class="max-w-40 bg-gray-300 h-2 rounded mt-1">
          <div class="bg-green-600 h-2 rounded" style="width: ${percent}%"></div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center justify-end">
      <div class="flex items-center">
        <span class="font-semibold m-1">${a.reward}</span>
        <img src="/images/achievements/coin.png" class="size-6" alt="Coin">
      </div>
      ${isCompleted
          ? `<button class="redeem-btn bg-yellow-400 border-yellow-500 text-white text-sm px-2 py-1 rounded-xl border-4 font-semibold hover:cursor-pointer ml-2 hover:bg-yellow-300 hover:border-yellow-400 active:bg-yellow-200 transition" data-id="${a._id}">Redeem</button>`
          : !isActive
            ? `<button class="activate-btn bg-[#089ddd] border-[#0a67a0] text-white text-sm px-2 py-1 rounded-xl border-4 font-semibold hover:cursor-pointer ml-2 hover:bg-[#44bcf0] hover:border-[#0c79bf] active:bg-[#5edfff] transition" data-id="${a._id}">Activate</button>`
            : isClaimed
              ? `<span class="text-xs text-gray-400 mt-1">Reward claimed</span>`
              : ''
        }
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

    // Add click listener to activate buttons
    document.querySelectorAll('.activate-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const achievementId = btn.dataset.id;
        const response = await fetch('/achievements/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: achievementId })
        });
        const result = await response.json();
        if (result.success) {
          location.reload(); // refresh to update sections
        } else {
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
          const res = await fetch('/achievements/redeem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });

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