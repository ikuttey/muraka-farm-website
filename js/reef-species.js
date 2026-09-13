(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primaryNav');

  if (nav && !nav.querySelector('a[href="reef-species.html"]')) {
    const list = nav.querySelector('ul');
    const dharavandhooLink = list && list.querySelector('a[href="dharavandhoo.html"]');
    if (list && dharavandhooLink) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = 'reef-species.html';
      link.textContent = 'House Reef Species';
      link.setAttribute('aria-current', 'page');
      item.appendChild(link);
      dharavandhooLink.closest('li').insertAdjacentElement('afterend', item);
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
  }

  const search = document.getElementById('speciesSearch');
  const buttons = Array.from(document.querySelectorAll('.filter-button'));
  const cards = Array.from(document.querySelectorAll('.species-card'));
  const count = document.getElementById('speciesCount');
  const empty = document.getElementById('speciesEmpty');
  let activeFilter = 'all';

  const normalise = value => (value || '').toLowerCase().trim();

  function render() {
    const term = normalise(search && search.value);
    let visible = 0;

    cards.forEach(card => {
      const groupMatch = activeFilter === 'all' || card.dataset.group === activeFilter;
      const searchText = normalise(`${card.dataset.search} ${card.textContent}`);
      const termMatch = !term || searchText.includes(term);
      const show = groupMatch && termMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      buttons.forEach(item => item.classList.toggle('active', item === button));
      render();
    });
  });

  if (search) search.addEventListener('input', render);
  render();
})();
