fetch('/achievements/data')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('achievements-container');
    container.innerHTML = '';

    const createAchievementElement = (a, isActive) => {
      const percent = Math.min(Math.round((a.progress / a.target) * 100), 100);
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
          ${!isActive ? `<button class="bg-[#089ddd] border-[#0a67a0] text-white text-sm px-2 py-1 rounded-xl border-4 font-semibold hover:cursor-pointer ml-2 hover:bg-[#44bcf0] hover:border-[#0c79bf] active:bg-[#5edfff] transition" data-id="${a._id}">Activate</button>` : ''}
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
