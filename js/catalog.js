(() => {
  const {searchKits, money} = window.RentKit;
  const grid = document.getElementById('catalog-grid');
  const controls = document.getElementById('catalog-controls');
  const query = document.getElementById('search');
  const category = document.getElementById('category');
  const sort = document.getElementById('sort');
  const budget = document.getElementById('budget');
  function node(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    if (text) element.textContent = text;
    return element;
  }
  function render() {
    const results = searchKits({query: query.value, category: category.value, sort: sort.value, maxPrice: Number(budget.value)});
    grid.replaceChildren();
    for (const kit of results) {
      const card = node('article', 'card kit-card catalog-card');
      card.id = kit.id;
      const image = node('img', 'kit-image');
      image.src = `images/${kit.image}-kit.svg`;
      image.alt = `${kit.category} equipment family illustration; included items are listed below`;
      image.width = 800; image.height = 560; image.loading = 'lazy';
      const body = node('div', 'card-body');
      body.append(node('span', 'tag', kit.category.toUpperCase()), node('h3', '', kit.name), node('p', 'card-text', kit.description), node('p', 'contents-line', kit.contents.join(' · ')), node('p', 'small-note', `You bring: ${kit.bring}`));
      const bottom = node('div', 'card-bottom');
      bottom.append(node('span', 'price', `${money(kit.prices[1])} / day`));
      const actions = node('div', 'catalog-actions');
      for (const [text, href, style] of [['See contents', `kit-details.html#${kit.id}`, 'btn-outline'], ['Book this kit', `order.html?kit=${kit.id}`, 'btn-primary']]) {
        const link = node('a', `btn ${style}`, text);
        link.href = href; link.setAttribute('aria-label', `${text}: ${kit.name}`); actions.append(link);
      }
      body.append(bottom, actions); card.append(image, body); grid.append(card);
    }
    document.getElementById('result-count').textContent = `${results.length} ${results.length === 1 ? 'kit' : 'kits'} found`;
    document.getElementById('catalog-empty').hidden = results.length > 0;
  }
  controls.addEventListener('submit', event => event.preventDefault());
  controls.addEventListener('input', render);
  controls.addEventListener('change', render);
  document.querySelectorAll('[data-reset-catalog]').forEach(button => button.addEventListener('click', () => {
    controls.reset(); render(); query.focus();
  }));
  // Task shortcuts remain useful even after a filter has hidden their target card.
  document.querySelectorAll('.anchor-nav a').forEach(link => link.addEventListener('click', () => {
    controls.reset(); render();
  }));
  render();
  const requested = document.getElementById(location.hash.slice(1));
  if (requested) requestAnimationFrame(() => requested.scrollIntoView());
})();
