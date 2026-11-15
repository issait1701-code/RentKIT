(() => {
  const R = window.RentKit;
  const target = document.getElementById('extra-details');
  const el = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  // Kits 5–8 use the same layout as the hand-written sections, including their own illustration.
  R.kits.slice(4).forEach((kit, index) => {
    const section = el('section', 'detail-section');
    section.id = kit.id;
    const number = String(index + 5).padStart(2, '0');
    section.append(el('p', 'eyebrow', `KIT ${number} / ${kit.uses[0]}`));

    const heading = el('div', 'detail-heading');
    const titleBox = el('div');
    const title = el('h2', '', kit.name);
    title.id = `${kit.id}-title`;
    section.setAttribute('aria-labelledby', title.id);
    titleBox.append(title, el('p', 'muted mb-0', kit.description));
    const price = el('span', 'price', `${R.money(kit.prices[1])} `);
    price.append(el('small', '', '/ 1 day'));
    heading.append(titleBox, price);

    const layout = el('div', 'detail-layout');
    const figure = el('figure', 'detail-visual');
    const image = el('img');
    image.src = `images/${kit.image}-kit.svg`;
    image.alt = `${kit.name}: ${kit.contents.join(', ')}`;
    image.width = 800; image.height = 560; image.loading = 'lazy';
    figure.append(image, el('figcaption', '', `Illustrated kit contents · ⏱ about ${kit.setup} min to set up · ★ ${kit.rating} (${kit.reviews} reviews)`));

    const text = el('div');
    const listTitle = el('h3', 'setup-heading', 'Included in your kit');
    const list = el('dl', 'equipment-list');
    kit.contents.forEach(item => {
      const row = el('div');
      row.append(el('dt', '', item), el('dd', '', 'Checked, cleaned and packed before every rental.'));
      list.append(row);
    });
    const bringProvide = el('div', 'bring-provide');
    const provide = el('div'); provide.append(el('h3', '', 'We provide'), el('p', '', `${kit.contents.join(' · ')}.`));
    const bring = el('div'); bring.append(el('h3', '', 'You bring'), el('p', '', kit.bring));
    bringProvide.append(provide, bring);
    const stepsTitle = el('h3', 'setup-heading', 'Your quick setup checklist');
    const steps = el('ol', 'setup-list');
    kit.steps.forEach(step => steps.append(el('li', '', step)));
    const link = el('a', 'btn btn-primary', 'Book this kit ');
    link.href = `order.html?kit=${kit.id}`;
    link.setAttribute('aria-label', `Book ${kit.name}`);
    const arrow = el('span', '', '↗'); arrow.setAttribute('aria-hidden', 'true'); link.append(arrow);
    text.append(listTitle, list, bringProvide, stepsTitle, steps, link);

    layout.append(figure, text);
    section.append(heading, layout);
    target.append(section);
  });

  // Jump links for the generated sections, inserted before "Compare prices".
  const nav = document.querySelector('.anchor-nav');
  const pricesLink = nav?.querySelector('a[href="#prices"]');
  R.kits.slice(4).forEach(kit => {
    const link = el('a', '', kit.name);
    link.href = `#${kit.id}`;
    nav?.insertBefore(link, pricesLink);
  });

  // Price table from the shared data; the cheapest per-day option in each row is marked.
  const rows = document.getElementById('price-rows');
  rows.replaceChildren();
  for (const kit of R.kits) {
    const row = el('tr');
    const name = el('th', '', kit.name);
    name.scope = 'row';
    row.append(name);
    for (const days of [1, 3, 7]) {
      const cell = el('td', '', R.money(kit.prices[days]));
      if (days > 1) cell.append(el('small', 'per-day', ` ≈ ${R.money(Math.round(kit.prices[days] / days))}/day`));
      row.append(cell);
    }
    rows.append(row);
  }
  // Direct catalogue links can target sections added by JavaScript.
  const requested = document.getElementById(location.hash.slice(1));
  if (requested) requestAnimationFrame(() => requested.scrollIntoView());
})();
