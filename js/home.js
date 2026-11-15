// Home page numbers are calculated from the shared kit data and counted up once visible.
(() => {
  const {kits, money} = window.RentKit;
  const reviews = kits.reduce((sum, kit) => sum + kit.reviews, 0);
  const average = kits.reduce((sum, kit) => sum + kit.rating * kit.reviews, 0) / reviews;
  const values = {
    kits: {value: kits.length, format: n => String(Math.round(n))},
    rating: {value: average, format: n => n.toFixed(1)},
    reviews: {value: reviews, format: n => String(Math.round(n))},
    from: {value: Math.min(...kits.map(kit => kit.prices[1])), format: n => money(Math.round(n / 100) * 100)}
  };
  const cells = [...document.querySelectorAll('[data-stat]')];
  cells.forEach(cell => { cell.textContent = values[cell.dataset.stat].format(values[cell.dataset.stat].value); });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = window.jQuery;
  const strip = document.querySelector('.stats-strip');
  if (!strip || reduced || !$ || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    cells.forEach(cell => {
      const {value, format} = values[cell.dataset.stat];
      // jQuery animate on a plain object gives a smooth counter.
      $({n: 0}).animate({n: value}, {duration: 900, step: now => { cell.textContent = format(now); }, complete: () => { cell.textContent = format(value); }});
    });
  }, {threshold: .4});
  observer.observe(strip);
})();
