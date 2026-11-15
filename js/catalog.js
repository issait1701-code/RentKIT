(() => {
  const {kits, searchKits, money, getKit, DELIVERY_FEE} = window.RentKit;
  const Favorites = window.RentKitFavorites;
  const toast = text => window.RentKitToast?.(text);
  const $ = window.jQuery;
  const grid = document.getElementById('catalog-grid');
  const controls = document.getElementById('catalog-controls');
  const query = document.getElementById('search');
  const category = document.getElementById('category');
  const sort = document.getElementById('sort');
  const budget = document.getElementById('budget');
  const savedOnly = document.getElementById('saved-only');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const MAX_COMPARE = 3;
  let compare = [];
  let lastResults = [];

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;
    return element;
  }
  const dayLabel = days => `${days} ${days === 1 ? 'day' : 'days'}`;

  // Five stars, filled according to the rating; the number is also given as text.
  function stars(kit) {
    const wrap = node('p', 'rating');
    const visual = node('span', 'rating-stars');
    visual.setAttribute('aria-hidden', 'true');
    visual.style.setProperty('--fill', `${(kit.rating / 5) * 100}%`);
    visual.textContent = '★★★★★';
    wrap.append(visual, node('span', 'rating-value', kit.rating.toFixed(1)), node('span', 'rating-count', `(${kit.reviews} reviews)`));
    wrap.setAttribute('aria-label', `Rated ${kit.rating} out of 5 from ${kit.reviews} reviews`);
    return wrap;
  }

  function heartButton(kit, extraClass = '') {
    const button = node('button', `heart-btn ${extraClass}`.trim());
    button.type = 'button';
    button.dataset.favorite = kit.id;
    const sync = () => {
      const saved = Favorites.has(kit.id);
      button.textContent = saved ? '♥' : '♡';
      button.classList.toggle('is-saved', saved);
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', saved ? `Remove ${kit.name} from saved` : `Save ${kit.name}`);
    };
    button.addEventListener('click', () => {
      const saved = Favorites.toggle(kit.id);
      toast(saved ? `${kit.name} saved ♥` : `${kit.name} removed from saved`);
      if ($ && !reducedMotion.matches) $(button).stop(true, true).animate({fontSize: '1.6rem'}, 120).animate({fontSize: '1.25rem'}, 120);
    });
    sync();
    const off = Favorites.onChange(() => { if (button.isConnected) sync(); else off(); });
    return button;
  }

  function card(kit) {
    const article = node('article', 'card kit-card catalog-card');
    article.id = kit.id;
    const media = node('div', 'kit-media');
    const image = node('img', 'kit-image');
    image.src = `images/${kit.image}-kit.svg`;
    image.alt = `${kit.name}: ${kit.contents.join(', ')}`;
    image.width = 800; image.height = 560; image.loading = 'lazy';
    media.append(image);
    if (kit.popular) media.append(node('span', 'badge-popular', 'Popular'));
    media.append(heartButton(kit, 'on-image'));
    const peek = node('button', 'quick-peek', 'Quick view');
    peek.type = 'button';
    peek.dataset.quick = kit.id;
    peek.setAttribute('aria-label', `Quick view: ${kit.name}`);
    media.append(peek);

    const body = node('div', 'card-body');
    const meta = node('div', 'card-meta');
    meta.append(node('span', 'tag', kit.category.toUpperCase()), node('span', 'setup-time', `⏱ ${kit.setup} min setup`));
    const chips = node('ul', 'content-chips');
    chips.setAttribute('aria-label', 'Included items');
    kit.contents.forEach(item => chips.append(node('li', '', item)));
    body.append(meta, node('h3', '', kit.name), stars(kit), node('p', 'card-text', kit.description), chips, node('p', 'small-note', `You bring: ${kit.bring}`));

    const bottom = node('div', 'card-bottom');
    const price = node('span', 'price', money(kit.prices[1]));
    price.append(node('small', '', ' / day'));
    const compareLabel = node('label', 'compare-check');
    const compareBox = node('input');
    compareBox.type = 'checkbox';
    compareBox.dataset.compare = kit.id;
    compareBox.checked = compare.includes(kit.id);
    compareLabel.append(compareBox, node('span', '', 'Compare'));
    bottom.append(price, compareLabel);

    const actions = node('div', 'catalog-actions');
    const quick = node('button', 'btn btn-outline', 'Quick view');
    quick.type = 'button'; quick.dataset.quick = kit.id;
    quick.setAttribute('aria-label', `Quick view: ${kit.name}`);
    const details = node('a', 'btn btn-ghost', 'Full details');
    details.href = `kit-details.html#${kit.id}`;
    details.setAttribute('aria-label', `Full details: ${kit.name}`);
    const book = node('a', 'btn btn-primary', 'Book this kit');
    book.href = `order.html?kit=${kit.id}`;
    book.setAttribute('aria-label', `Book this kit: ${kit.name}`);
    actions.append(quick, details, book);
    body.append(bottom, actions);
    article.append(media, body);
    return article;
  }

  function render() {
    let results = searchKits({query: query.value, category: category.value, sort: sort.value, maxPrice: Number(budget.value)});
    if (sort.value === 'rating') results.sort((a, b) => b.rating - a.rating);
    if (savedOnly.checked) results = results.filter(kit => Favorites.has(kit.id));
    lastResults = results;
    grid.replaceChildren(...results.map(card));
    document.getElementById('result-count').textContent = `${results.length} ${results.length === 1 ? 'kit' : 'kits'} found`;
    const empty = document.getElementById('catalog-empty');
    empty.hidden = results.length > 0;
    empty.querySelector('h3').textContent = savedOnly.checked && !Favorites.all().length ? 'You have not saved any kits yet.' : 'No kits match your plan yet.';
    if ($ && !reducedMotion.matches) $(grid).children().css('opacity', 0).each(function (index) { $(this).delay(index * 50).animate({opacity: 1}, 220); });
  }

  /* ---------- Compare (up to three kits) ---------- */
  const bar = node('div', 'compare-bar');
  bar.hidden = true;
  bar.setAttribute('aria-label', 'Kits selected for comparison');
  bar.setAttribute('role', 'region');
  const barList = node('div', 'compare-bar-list');
  const barActions = node('div', 'compare-bar-actions');
  const compareOpen = node('button', 'btn btn-primary', 'Compare');
  compareOpen.type = 'button';
  const compareClear = node('button', 'btn btn-outline', 'Clear');
  compareClear.type = 'button';
  barActions.append(compareClear, compareOpen);
  bar.append(barList, barActions);
  document.body.append(bar);

  function updateCompareBar() {
    barList.replaceChildren(node('strong', '', `Compare ${compare.length}/${MAX_COMPARE}:`), ...compare.map(id => node('span', 'compare-pill', getKit(id).name)));
    compareOpen.disabled = compare.length < 2;
    compareOpen.textContent = compare.length < 2 ? 'Pick 2+ kits' : `Compare ${compare.length}`;
    const show = compare.length > 0;
    if (show === !bar.hidden) return;
    if ($ && !reducedMotion.matches) {
      if (show) { bar.hidden = false; $(bar).stop(true, true).hide().slideDown(200); }
      else $(bar).stop(true, true).slideUp(200, () => { bar.hidden = true; });
    } else bar.hidden = !show;
  }
  grid.addEventListener('change', event => {
    const box = event.target.closest('[data-compare]');
    if (!box) return;
    const id = box.dataset.compare;
    if (box.checked) {
      if (compare.length >= MAX_COMPARE) {
        box.checked = false;
        toast(`You can compare up to ${MAX_COMPARE} kits.`);
        return;
      }
      compare.push(id);
    } else compare = compare.filter(item => item !== id);
    updateCompareBar();
  });
  compareClear.addEventListener('click', () => {
    compare = [];
    grid.querySelectorAll('[data-compare]').forEach(box => { box.checked = false; });
    updateCompareBar();
  });
  compareOpen.addEventListener('click', () => openCompare(compareOpen));

  /* ---------- Shared modal shell: overlay, focus trap, Esc, restore focus ---------- */
  function openModal({labelledBy, className, build, trigger, onKey}) {
    const overlay = node('div', 'kit-detail-overlay');
    const panel = node('section', `kit-detail-dialog ${className || ''}`.trim());
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', labelledBy);
    panel.tabIndex = -1;
    const closeX = node('button', 'dialog-x', '×');
    closeX.type = 'button';
    closeX.setAttribute('aria-label', 'Close');
    const content = node('div', 'dialog-content');
    panel.append(closeX, content);
    overlay.append(panel);
    document.body.append(overlay);
    document.body.classList.add('modal-open');
    const speed = reducedMotion.matches ? 0 : 240;

    function close() {
      document.removeEventListener('keydown', onKeydown);
      const remove = () => {
        overlay.remove();
        document.body.classList.remove('modal-open');
        if (trigger?.isConnected) trigger.focus();
      };
      if ($) {
        $(panel).stop(true, true).animate({opacity: 0, marginTop: 30}, speed);
        $(overlay).stop(true, true).fadeOut(speed, remove);
      } else remove();
    }
    function onKeydown(event) {
      if (event.key === 'Escape') { close(); return; }
      if (onKey && onKey(event)) return;
      if (event.key !== 'Tab') return;
      const focusable = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')].filter(el => el.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel)) {
        event.preventDefault(); first.focus();
      }
    }
    build(content, close);
    closeX.addEventListener('click', close);
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    document.addEventListener('keydown', onKeydown);

    if ($) {
      $(overlay).css('opacity', 0).fadeTo(speed, 1);
      $(panel).css({opacity: 0, marginTop: 40}).animate({opacity: 1, marginTop: 0}, speed, () => panel.focus());
    } else panel.focus();
    return {panel, content, close};
  }

  /* ---------- Quick view (based on the team's openDetail function) ---------- */
  function openDetail(kit, trigger) {
    let current = kit;
    let days = 1;
    let delivery = false;
    const list = () => (lastResults.length ? lastResults : kits);
    const step = direction => {
      const items = list();
      const index = items.findIndex(item => item.id === current.id);
      current = items[(index + direction + items.length) % items.length];
      days = 1; delivery = false;
      paint(true);
    };
    const modal = openModal({
      labelledBy: 'kit-detail-title',
      className: 'quick-view',
      trigger,
      build: () => {},
      onKey: event => {
        if (event.target.matches('input')) return false;
        if (event.key === 'ArrowRight') { step(1); return true; }
        if (event.key === 'ArrowLeft') { step(-1); return true; }
        return false;
      }
    });

    function paint(animate) {
      const kit = current;
      const content = modal.content;
      const media = node('div', `qv-media qv-${kit.image}`);
      const image = node('img', 'kit-detail-image');
      image.src = `images/${kit.image}-kit.svg`;
      image.alt = `${kit.name}: ${kit.contents.join(', ')}`;
      image.width = 800; image.height = 560;
      media.append(image);
      if (kit.popular) media.append(node('span', 'badge-popular', 'Popular'));
      const uses = node('ul', 'use-chips');
      uses.setAttribute('aria-label', 'Good for');
      kit.uses.forEach(use => uses.append(node('li', '', use)));
      const nav = node('div', 'qv-nav');
      const prev = node('button', 'qv-arrow', '←'); prev.type = 'button'; prev.setAttribute('aria-label', 'Previous kit');
      const position = node('span', 'qv-position', `${list().findIndex(item => item.id === kit.id) + 1} / ${list().length}`);
      const next = node('button', 'qv-arrow', '→'); next.type = 'button'; next.setAttribute('aria-label', 'Next kit');
      prev.addEventListener('click', () => step(-1));
      next.addEventListener('click', () => step(1));
      nav.append(prev, position, next);
      const facts = node('dl', 'qv-facts');
      [['Setup', `${kit.setup} min`], ['Level', kit.level], ['Day on 7d', money(Math.round(kit.prices[7] / 7 / 10) * 10)]].forEach(([label, value]) => {
        const item = node('div');
        item.append(node('dt', '', label), node('dd', '', value));
        facts.append(item);
      });
      media.append(uses, facts, nav, node('p', 'qv-hint', 'Tip: use ← → keys to browse kits, Esc to close.'));

      const info = node('div', 'qv-info');
      const meta = node('div', 'card-meta');
      meta.append(node('span', 'tag', kit.category.toUpperCase()), node('span', 'setup-time', `⏱ ${kit.setup} min · ${kit.level}`));
      const title = node('h2', '', kit.name);
      title.id = 'kit-detail-title';
      const description = node('p', 'muted', kit.description);

      const includedHeading = node('h3', '', 'Included in your kit');
      const contents = node('ul', 'kit-detail-contents');
      kit.contents.forEach(item => contents.append(node('li', '', item)));
      const bring = node('p', 'qv-bring');
      bring.append(node('strong', '', 'You bring: '), kit.bring);

      const stepsHeading = node('h3', '', 'Quick setup');
      const steps = node('ol', 'qv-steps');
      kit.steps.forEach(text => steps.append(node('li', '', text)));

      // Rental period picker: price, saving versus daily price, and optional delivery.
      const priceHeading = node('h3', '', 'Rental period');
      const periods = node('div', 'period-picker');
      periods.setAttribute('role', 'radiogroup');
      periods.setAttribute('aria-label', 'Rental period');
      const total = node('p', 'qv-total');
      const saving = node('p', 'qv-saving');
      const deliveryLabel = node('label', 'qv-delivery');
      const deliveryBox = node('input');
      deliveryBox.type = 'checkbox';
      deliveryBox.checked = delivery;
      deliveryLabel.append(deliveryBox, node('span', '', `Add delivery (+${money(DELIVERY_FEE)})`));
      const book = node('a', 'btn btn-primary', 'Book this kit');
      function updatePrice() {
        const sum = kit.prices[days] + (delivery ? DELIVERY_FEE : 0);
        total.replaceChildren(node('span', '', `Total for ${dayLabel(days)}`), node('strong', 'price', money(sum)));
        const save = kit.prices[1] * days - kit.prices[days];
        saving.textContent = save > 0 ? `You save ${money(save)} vs. daily price (${money(Math.round(kit.prices[days] / days))} / day)` : 'Best for a single event or test day.';
        book.href = `order.html?kit=${kit.id}&days=${days}${delivery ? '&method=delivery' : ''}`;
        periods.querySelectorAll('button').forEach(button => {
          const active = Number(button.dataset.days) === days;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-checked', String(active));
          button.tabIndex = active ? 0 : -1;
        });
      }
      [1, 3, 7].forEach(value => {
        const option = node('button', 'period');
        option.type = 'button';
        option.setAttribute('role', 'radio');
        option.dataset.days = value;
        option.append(node('span', '', dayLabel(value)), node('small', '', money(kit.prices[value])));
        option.addEventListener('click', () => { days = value; updatePrice(); });
        option.addEventListener('keydown', event => {
          if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
          event.preventDefault(); event.stopPropagation();
          const order = [1, 3, 7];
          days = order[(order.indexOf(days) + (event.key === 'ArrowRight' ? 1 : 2)) % 3];
          updatePrice();
          periods.querySelector(`[data-days="${days}"]`).focus();
        });
        periods.append(option);
      });
      deliveryBox.addEventListener('change', () => { delivery = deliveryBox.checked; updatePrice(); });

      const actions = node('div', 'kit-detail-actions');
      const more = node('a', 'btn btn-outline', 'Full details');
      more.href = `kit-details.html#${kit.id}`;
      actions.append(book, heartButton(kit, 'in-dialog'), more);

      info.append(meta, title, stars(kit), description, includedHeading, contents, bring, stepsHeading, steps, priceHeading, periods, total, saving, deliveryLabel, actions);
      updatePrice();

      const body = node('div', 'qv-grid');
      body.append(media, info);
      content.replaceChildren(body);
      if (animate && $ && !reducedMotion.matches) $(body).css('opacity', 0).animate({opacity: 1}, 180);
      modal.panel.scrollTop = 0;
    }
    paint(false);
  }

  /* ---------- Comparison table dialog ---------- */
  function openCompare(trigger) {
    const chosen = compare.map(getKit);
    openModal({
      labelledBy: 'compare-title',
      className: 'compare-dialog',
      trigger,
      build: content => {
        const title = node('h2', '', 'Compare kits');
        title.id = 'compare-title';
        const wrap = node('div', 'table-responsive');
        const table = node('table', 'table compare-table');
        const head = node('thead');
        const headRow = node('tr');
        headRow.append(node('th', '', 'Feature'));
        chosen.forEach(kit => {
          const th = node('th');
          th.scope = 'col';
          const img = node('img');
          img.src = `images/${kit.image}-kit.svg`; img.alt = ''; img.width = 160; img.height = 112;
          th.append(img, node('span', '', kit.name));
          headRow.append(th);
        });
        head.append(headRow);
        const cheapest = Math.min(...chosen.map(kit => kit.prices[1]));
        const best = Math.max(...chosen.map(kit => kit.rating));
        const rows = [
          ['1 day', kit => money(kit.prices[1]), kit => kit.prices[1] === cheapest],
          ['3 days', kit => money(kit.prices[3])],
          ['7 days', kit => money(kit.prices[7])],
          ['Rating', kit => `★ ${kit.rating} (${kit.reviews})`, kit => kit.rating === best],
          ['Setup time', kit => `${kit.setup} min`],
          ['Included', kit => kit.contents.join(', ')],
          ['You bring', kit => kit.bring],
          ['Good for', kit => kit.uses.join(', ')]
        ];
        const tbody = node('tbody');
        rows.forEach(([label, value, highlight]) => {
          const row = node('tr');
          const th = node('th', '', label);
          th.scope = 'row';
          row.append(th);
          chosen.forEach(kit => {
            const cell = node('td', highlight?.(kit) ? 'is-best' : '', value(kit));
            if (highlight?.(kit)) cell.append(node('span', 'visually-hidden', ' (best)'));
            row.append(cell);
          });
          tbody.append(row);
        });
        const actionRow = node('tr');
        actionRow.append(node('th', '', ''));
        chosen.forEach(kit => {
          const cell = node('td');
          const link = node('a', 'btn btn-primary', 'Book');
          link.href = `order.html?kit=${kit.id}`;
          link.setAttribute('aria-label', `Book ${kit.name}`);
          cell.append(link);
          actionRow.append(cell);
        });
        tbody.append(actionRow);
        table.append(head, tbody);
        wrap.append(table);
        content.append(title, node('p', 'muted', 'Highlighted cells show the lowest daily price and the best rating.'), wrap);
      }
    });
  }

  /* ---------- Events ---------- */
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-quick]');
    if (button) openDetail(getKit(button.dataset.quick), button);
  });
  Favorites.onChange(() => { if (savedOnly.checked) render(); });
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

  const params = new URLSearchParams(location.search);
  if (params.get('saved') === '1') savedOnly.checked = true;
  render();
  updateCompareBar();
  const requested = document.getElementById(location.hash.slice(1));
  if (requested) requestAnimationFrame(() => requested.scrollIntoView());
  const quick = getKit(params.get('quick'));
  if (quick) openDetail(quick, document.querySelector(`[data-quick="${quick.id}"]`));
})();
