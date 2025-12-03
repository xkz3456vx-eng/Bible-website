// Global State
const state = {
    view: 'readings', // 'readings' or 'bible'
    bible: {
        bookIndex: 0,
        chapterIndex: 0
    }
};

// DOM Elements
const views = {
    readings: document.getElementById('view-readings'),
    bible: document.getElementById('view-bible')
};
const btns = {
    readings: document.getElementById('btn-readings'),
    bible: document.getElementById('btn-bible')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initBible();
    loadReadings();
});

// --- View Switching ---
function switchView(viewName) {
    state.view = viewName;

    // Toggle Sections
    Object.keys(views).forEach(key => {
        views[key].style.display = key === viewName ? 'block' : 'none';
        views[key].classList.toggle('active', key === viewName);
    });

    // Toggle Buttons
    Object.keys(btns).forEach(key => {
        btns[key].classList.toggle('active', key === viewName);
    });
}

// --- Liturgy (Readings) Logic ---
async function loadReadings() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const displayDate = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }).format(today);

    document.getElementById('liturgy-date').textContent =
        displayDate.charAt(0).toUpperCase() + displayDate.slice(1);

    const container = document.getElementById('readings-container');
    const badge = document.getElementById('liturgy-color-badge');

    try {
        // Fetch from AELF
        // Note: Direct fetch might fail if opened as file:// due to CORS if the API doesn't support it for null origin.
        // We add a fallback message.
        const response = await fetch(`https://api.aelf.org/v1/messes/${dateStr}/france`);

        if (!response.ok) throw new Error('Erreur réseau');

        const data = await response.json();
        const info = data.informations;
        const lectures = data.messes[0].lectures;

        // Update Header Info
        document.getElementById('liturgy-date').innerHTML =
            `<div>${info.semaine || info.jour_liturgique_nom}</div><div style="font-size:1rem; margin-top:0.5rem; color:#666">${displayDate}</div>`;

        badge.textContent = info.couleur;
        badge.style.display = 'inline-block';

        // Clear Loading
        container.innerHTML = '';

        lectures.forEach(lecture => {
            const card = document.createElement('div');
            card.className = `reading-card ${info.couleur}`;

            const typeLabel = formatReadingType(lecture.type);

            card.innerHTML = `
                <div class="reading-header">
                    <h3 class="reading-type">${typeLabel}</h3>
                    <span class="reading-ref">${lecture.ref}</span>
                </div>
                ${lecture.titre ? `<h4 style="margin-bottom:1rem;">${lecture.titre}</h4>` : ''}
                <div class="reading-content">
                    ${lecture.contenu}
                </div>
                ${lecture.verset_evangile ? `
                    <div class="acclamation">
                        <strong>Acclamation :</strong> ${lecture.verset_evangile}
                    </div>
                ` : ''}
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="error">
                <p>Impossible de charger les lectures.</p>
                <p>Si vous ouvrez ce fichier localement, votre navigateur bloque peut-être la connexion à l'API AELF (CORS).</p>
                <p>Essayez de le lancer via un serveur local ou utilisez la Bible.</p>
            </div>
        `;
    }
}

function formatReadingType(type) {
    if (type === 'evangile') return 'Évangile';
    if (type === 'psaume') return 'Psaume';
    if (type === 'lecture_1') return 'Première Lecture';
    if (type === 'lecture_2') return 'Deuxième Lecture';
    return type;
}

// --- Bible Logic ---
function initBible() {
    if (!window.BIBLE_DATA) {
        document.getElementById('bible-text-display').innerHTML = '<div class="error">Données bibliques introuvables (bible-data.js manquant).</div>';
        return;
    }

    const bookSelect = document.getElementById('bible-book-select');

    // Populate Books
    window.BIBLE_DATA.forEach((book, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = book.name;
        bookSelect.appendChild(option);
    });

    // Init first view
    updateChapters();
    renderBibleText();
}

function updateChapters() {
    const bookIndex = parseInt(document.getElementById('bible-book-select').value);
    const chapterSelect = document.getElementById('bible-chapter-select');
    chapterSelect.innerHTML = '';

    const chapters = window.BIBLE_DATA[bookIndex].chapters;

    chapters.forEach((_, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Chapitre ${index + 1}`;
        chapterSelect.appendChild(option);
    });

    // Reset to chap 1 if we changed book
    state.bible.chapterIndex = 0;
}

function onBookChange() {
    state.bible.bookIndex = parseInt(document.getElementById('bible-book-select').value);
    updateChapters();
    renderBibleText();
}

function onChapterChange() {
    state.bible.chapterIndex = parseInt(document.getElementById('bible-chapter-select').value);
    renderBibleText();
}

function renderBibleText() {
    const bookIndex = state.bible.bookIndex;
    const chapIndex = state.bible.chapterIndex;

    const book = window.BIBLE_DATA[bookIndex];
    const verses = book.chapters[chapIndex];

    const display = document.getElementById('bible-text-display');
    const title = document.createElement('h2');
    title.style.textAlign = 'center';
    title.style.marginBottom = '2rem';
    title.style.fontFamily = 'Cinzel, serif';
    title.textContent = `${book.name} ${chapIndex + 1}`;

    let textHTML = '';
    verses.forEach((verse, i) => {
        textHTML += `<span class="verse"><span class="verse-num">${i + 1}</span>${verse} </span>`;
    });

    display.innerHTML = '';
    display.appendChild(title);

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = textHTML;
    display.appendChild(contentDiv);

    // Update nav buttons
    document.getElementById('btn-prev-chap').disabled = (bookIndex === 0 && chapIndex === 0);
    const isLastBook = bookIndex === window.BIBLE_DATA.length - 1;
    const isLastChap = chapIndex === book.chapters.length - 1;
    document.getElementById('btn-next-chap').disabled = (isLastBook && isLastChap);

    window.scrollTo(0,0);
}

function prevChapter() {
    if (state.bible.chapterIndex > 0) {
        state.bible.chapterIndex--;
    } else if (state.bible.bookIndex > 0) {
        state.bible.bookIndex--;
        const prevBookChaps = window.BIBLE_DATA[state.bible.bookIndex].chapters.length;
        state.bible.chapterIndex = prevBookChaps - 1;
    }
    syncSelects();
    renderBibleText();
}

function nextChapter() {
    const currentBookChaps = window.BIBLE_DATA[state.bible.bookIndex].chapters.length;

    if (state.bible.chapterIndex < currentBookChaps - 1) {
        state.bible.chapterIndex++;
    } else if (state.bible.bookIndex < window.BIBLE_DATA.length - 1) {
        state.bible.bookIndex++;
        state.bible.chapterIndex = 0;
    }
    syncSelects();
    renderBibleText();
}

function syncSelects() {
    document.getElementById('bible-book-select').value = state.bible.bookIndex;
    // We might need to refresh chapter list if book changed
    updateChapters();
    document.getElementById('bible-chapter-select').value = state.bible.chapterIndex;
}

// Attach global functions for HTML inline events
window.switchView = switchView;
window.onBookChange = onBookChange;
window.onChapterChange = onChapterChange;
window.prevChapter = prevChapter;
window.nextChapter = nextChapter;
