fetch('/achievements/data')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('achievements-container');
    container.innerHTML = '';

    const createAchievementElement = (a, isActive) => {
      const percent = Math.min(Math.round((a.progress / a.target) * 100), 100);
      const div = document.createElement('div');
      div.className = 'flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm mb-4';
      div.innerHTML = `
        <div class="flex items-center space-x-3">
          <img src="/images/achievements/${a.type.toLowerCase()}.png" class="w-12 h-12" alt="${a.type}">
          <div>
            <p class="font-medium">${a.description}</p>
            <div class="w-40 bg-gray-300 h-2 rounded mt-1">
              <div class="bg-green-600 h-2 rounded" style="width: ${percent}%"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-lg font-semibold">${a.reward}</span>
          <img src="/images/achievements/coin.png" class="w-6 h-6" alt="Coin">
          ${!isActive ? `<button class="bg-blue-500 text-white text-sm px-3 py-1 rounded activate-btn" data-id="${a._id}">Activate</button>` : ''}
        </div>`;
      return div;
    };

    // Active section
    const activeHeader = document.createElement('h2');
    activeHeader.textContent = 'Active Achievements';
    activeHeader.className = 'text-xl font-bold mb-2';
    container.appendChild(activeHeader);
    data.active.forEach(a => container.appendChild(createAchievementElement(a, true)));

    // Inactive section
    const inactiveHeader = document.createElement('h2');
    inactiveHeader.textContent = 'Inactive Achievements';
    inactiveHeader.className = 'text-xl font-bold mt-6 mb-2';
    container.appendChild(inactiveHeader);
    data.inactive.forEach(a => container.appendChild(createAchievementElement(a, false)));

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
  })
  .catch(err => console.error('Failed to load achievements:', err));
