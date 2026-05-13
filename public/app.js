(function () {
  const STORAGE_KEY = 'abc-reader.selectedCategories';
  const COUNT = 15;

  function getSelectedCategories() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return window.DEFAULT_SELECTION.slice();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return window.DEFAULT_SELECTION.slice();
      return parsed.filter((id) => window.SYLLABLE_CATEGORIES[id]);
    } catch (e) {
      return window.DEFAULT_SELECTION.slice();
    }
  }

  function getPool(selected) {
    const pool = [];
    for (const id of selected) {
      const cat = window.SYLLABLE_CATEGORIES[id];
      if (cat) pool.push(...cat.items);
    }
    return pool;
  }

  function pickRandom(pool, count) {
    if (pool.length === 0) return [];
    const result = [];
    // если пул маленький — допускаем повторы, но стараемся избегать соседних дублей
    let last = null;
    for (let i = 0; i < count; i++) {
      let pick;
      let attempts = 0;
      do {
        pick = pool[Math.floor(Math.random() * pool.length)];
        attempts++;
      } while (pick === last && attempts < 5 && pool.length > 1);
      result.push(pick);
      last = pick;
    }
    return result;
  }

  function renderEmpty() {
    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="empty">
        Не выбрана ни одна категория слогов.<br>
        Перейди в <a href="/settings.html">Настройки</a> и отметь хотя бы одну.
      </div>
    `;
  }

  function render() {
    const selected = getSelectedCategories();
    const pool = getPool(selected);
    if (pool.length === 0) {
      renderEmpty();
      return;
    }
    const container = document.getElementById('syllables');
    if (!container) return;
    const picks = pickRandom(pool, COUNT);
    container.innerHTML = '';
    for (const s of picks) {
      const span = document.createElement('span');
      span.className = 'syllable';
      span.textContent = s;
      container.appendChild(span);
    }
  }

  function init() {
    const btn = document.getElementById('nextBtn');
    if (btn) btn.addEventListener('click', render);

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        render();
      }
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
