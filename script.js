const slotGames = [
 { name: "Gates of Olympus 1000", provider: "Pragmatic", img: "https://img.viva88athenae.com/pp/images/vs20olympx.png" },
    { name: "Mahjong Wins 2", provider: "Pragmatic", img: "https://img.viva88athenae.com/pp/images/vswaysmahwin2.png" },
    { name: "Starlight Princess Super Scatter", provider: "Pragmatic", img: "https://img.viva88athenae.com/pp/images/vs20starprss.png" },
    { name: "Sweet Bonanza 1000", provider: "Pragmatic", img: "https://img.viva88athenae.com/pp/images/vs20fruitswx.png" }
];

const STORAGE_KEY = 'bukit4d_rtp_data';
const UPDATE_INTERVAL = 10 * 60 * 1000; // 10 Menit dalam milidetik

function getRTPData() {
    const cachedData = localStorage.getItem(STORAGE_KEY);
    const now = new Date().getTime();

    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        // Jika data belum kadaluarsa (kurang dari 10 menit), gunakan data lama
        if (now - parsedData.timestamp < UPDATE_INTERVAL) {
            return parsedData.games;
        }
    }

    // Jika tidak ada data atau sudah lewat 10 menit, buat data baru
    const newGamesData = slotGames.map(game => ({
        ...game,
        rtp: Math.floor(Math.random() * (99 - 89 + 1)) + 89
    }));

    const dataToStore = {
        timestamp: now,
        games: newGamesData
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    return newGamesData;
}

function renderTable() {
    const tableBody = document.getElementById('rtp-table-body');
    const lastUpdateElement = document.getElementById('last-update');
    const gamesData = getRTPData();
    const cachedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    tableBody.innerHTML = '';

    gamesData.forEach(game => {
        let statusClass = "gacor";
        let statusText = "GACOR";
        let color = "#00ff00";

        if (game.rtp < 93) {
            statusClass = "sedang";
            statusText = "SEDANG";
            color = "#ff4d4d";
        } else if (game.rtp < 96) {
            statusClass = "stabil";
            statusText = "STABIL";
            color = "#ffd700";
        }

        tableBody.innerHTML += `
            <tr>
                <td>
                    <div class="game-info">
                        <img src="${game.img}" class="game-img-small" alt="${game.name}">
                        <span>${game.name}</span>
                    </div>
                </td>
                <td>${game.provider}</td>
                <td>
                    <strong>${game.rtp}%</strong>
                    <div class="bar-wrap">
                        <div class="bar-fill" style="width: ${game.rtp}%; background: ${color}"></div>
                    </div>
                </td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });

    // Menampilkan waktu update terakhir dari storage
    const date = new Date(cachedData.timestamp);
    lastUpdateElement.innerText = date.toLocaleTimeString('id-ID');
}

document.addEventListener('DOMContentLoaded', () => {
    renderTable();

    // Cek setiap 1 menit apakah perlu update (agar tidak perlu refresh manual)
    setInterval(() => {
        renderTable();
    }, 60000);

    // FAQ Toggle
    document.querySelectorAll('.faq-card').forEach(f => {
        f.addEventListener('click', () => f.classList.toggle('active'));
    });
});