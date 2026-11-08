(() => {
  const R = window.RentKit;
  const target = document.getElementById('extra-details');
  for (const kit of R.kits.slice(4)) {
    const section = document.createElement('section');
    section.id = kit.id; section.className = 'detail-section';
    const heading = document.createElement('h2'); heading.id = `${kit.id}-title`; heading.textContent = kit.name;
    section.setAttribute('aria-labelledby', heading.id);
    const intro = document.createElement('p'); intro.textContent = kit.description;
    const subheading = document.createElement('h3'); subheading.textContent = 'Included in your kit';
    const list = document.createElement('ul');
    for (const item of kit.contents) { const li = document.createElement('li'); li.textContent = item; list.append(li); }
    const bring = document.createElement('p'); bring.textContent = `You bring: ${kit.bring}`;
    const setup = document.createElement('p'); setup.textContent = 'Before use: check your connections, connect the equipment to your device, and run a short test. Before return: power down, disconnect and count each included item.';
    const price = document.createElement('p'); price.className = 'price'; price.textContent = `${R.money(kit.prices[1])} / day`;
    const link = document.createElement('a'); link.className = 'btn btn-primary'; link.href = `order.html?kit=${kit.id}`; link.textContent = `Book ${kit.name}`;
    section.append(heading, intro, subheading, list, bring, setup, price, link); target.append(section);
  }
  const rows = document.getElementById('price-rows');
  rows.replaceChildren();
  for (const kit of R.kits) {
    const row = document.createElement('tr'); const name = document.createElement('th'); name.scope = 'row'; name.textContent = kit.name; row.append(name);
    for (const days of [1, 3, 7]) { const cell = document.createElement('td'); cell.textContent = R.money(kit.prices[days]); row.append(cell); }
    rows.append(row);
  }
  // Direct catalogue links can target sections added by JavaScript.
  const requested = document.getElementById(location.hash.slice(1));
  if (requested) requestAnimationFrame(() => requested.scrollIntoView());
})();
