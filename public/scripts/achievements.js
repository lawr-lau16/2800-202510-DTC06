fetch('/achievements-data')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('achievements-container');
        container.innerHTML = '';

        data.achievements.forEach(a => {
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
                <div class="flex items-center space-x-1">
                    <span class="text-lg font-semibold">${a.reward}</span>
                    <img src="/images/achievements/coin.png" class="w-6 h-6" alt="Coin">
                </div>`;
            container.appendChild(div);
        });
    })
    .catch(err => console.error('Failed to load achievements:', err));