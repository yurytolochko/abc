(function () {
  const STORAGE_KEY = 'abc-reader.selectedCategories';

  function loadSelection() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set(window.DEFAULT_SELECTION);
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set(window.DEFAULT_SELECTION);
      return new Set(parsed.filter((id) => window.SYLLABLE_CATEGORIES[id]));
    } catch (e) {
      return new Set(window.DEFAULT_SELECTION);
    }
  }

  function saveSelection(set) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  }

  function showSaved() {
    const note = document.getElementById('savedNote');
    if (!note) return;
    note.classList.add('show');
    clearTimeout(showSaved._t);
    showSaved._t = setTimeout(() => note.classList.remove('show'), 1500);
  }

  function buildList(selection) {
    const list = document.getElementById('categoryList');
    list.innerHTML = '';
    for (const [id, cat] of Object.entries(window.SYLLABLE_CATEGORIES)) {
      const label = document.createElement('label');
      label.className = 'category';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = id;
      checkbox.checked = selection.has(id);
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selection.add(id);
        else selection.delete(id);
      });

      const info = document.createElement('div');
      info.className = 'category-info';
      const name = document.createElement('div');
      name.className = 'category-name';
      name.textContent = cat.name;
      const example = document.createElement('div');
      example.className = 'category-example';
      example.textContent = `Например: ${cat.example}`;
      info.appendChild(name);
      info.appendChild(example);

      const count = document.createElement('div');
      count.className = 'category-count';
      count.textContent = `${cat.items.length} шт.`;

      label.appendChild(checkbox);
      label.appendChild(info);
      label.appendChild(count);
      list.appendChild(label);
    }
  }

  function init() {
    const selection = loadSelection();
    buildList(selection);

    document.getElementById('saveBtn').addEventListener('click', () => {
      saveSelection(selection);
      showSaved();
    });

    document.getElementById('selectAllBtn').addEventListener('click', () => {
      Object.keys(window.SYLLABLE_CATEGORIES).forEach((id) => selection.add(id));
      buildList(selection);
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
      selection.clear();
      buildList(selection);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
