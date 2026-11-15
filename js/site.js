// Shared helpers for every page: saved kits, theme switch, toast and back-to-top.
(() => {
  const read = (key, fallback) => {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; }
  };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage is optional */ } };

  // Favourites: a small array of kit IDs kept in localStorage.
  const listeners = new Set();
  const Favorites = {
    all: () => { const list = read('rentkit-favorites', []); return Array.isArray(list) ? list.filter(id => typeof id === 'string') : []; },
    has: id => Favorites.all().includes(id),
    toggle(id) {
      const list = Favorites.all();
      const saved = !list.includes(id);
      write('rentkit-favorites', saved ? [...list, id] : list.filter(item => item !== id));
      listeners.forEach(fn => fn());
      return saved;
    },
    onChange: fn => { listeners.add(fn); return () => listeners.delete(fn); }
  };
  window.RentKitFavorites = Favorites;

  // Theme: remembered choice, otherwise the operating-system preference.
  const root = document.documentElement;
  const stored = read('rentkit-theme', null);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const applyTheme = theme => { root.dataset.theme = theme; };
  applyTheme(stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light'));

  const navList = document.querySelector('.site-nav ul');
  if (navList) {
    const savedItem = document.createElement('li');
    const savedLink = document.createElement('a');
    savedLink.href = 'kits.html?saved=1';
    savedLink.className = 'nav-saved';
    const heart = document.createElement('span'); heart.setAttribute('aria-hidden', 'true'); heart.textContent = '♥';
    const count = document.createElement('span'); count.className = 'nav-count';
    savedLink.append(heart, ' Saved ', count);
    const updateCount = () => {
      const total = Favorites.all().length;
      count.textContent = total;
      count.hidden = total === 0;
      savedLink.setAttribute('aria-label', `Saved kits: ${total}`);
    };
    updateCount(); Favorites.onChange(updateCount);
    savedItem.append(savedLink);

    const themeItem = document.createElement('li');
    const themeButton = document.createElement('button');
    themeButton.type = 'button';
    themeButton.className = 'theme-toggle';
    const syncButton = () => {
      const dark = root.dataset.theme === 'dark';
      themeButton.textContent = dark ? '☀' : '☾';
      themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      themeButton.setAttribute('aria-pressed', String(dark));
    };
    themeButton.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next); write('rentkit-theme', next); syncButton();
    });
    syncButton(); themeItem.append(themeButton);
    navList.insertBefore(savedItem, navList.lastElementChild);
    navList.insertBefore(themeItem, navList.lastElementChild);
  }

  // Toast: short, polite status message used by catalogue actions.
  const toast = document.createElement('div');
  toast.className = 'rk-toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  document.body.append(toast);
  let timer;
  window.RentKitToast = text => {
    toast.textContent = text; toast.classList.add('is-visible');
    clearTimeout(timer); timer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  };

  // Back-to-top button appears after the first screen.
  const top = document.createElement('a');
  top.href = '#main'; top.className = 'back-to-top'; top.setAttribute('aria-label', 'Back to top'); top.textContent = '↑';
  document.body.append(top);
  const onScroll = () => top.classList.toggle('is-visible', window.scrollY > 700);
  window.addEventListener('scroll', onScroll, {passive: true}); onScroll();

  // Compact menu for narrow screens: the header stays on top, links fold behind a ☰ button.
  const nav = document.querySelector('.site-nav');
  const headerInner = document.querySelector('.header-inner');
  if (nav && headerInner) {
    nav.id = 'site-nav';
    const burger = document.createElement('button');
    burger.type = 'button';
    burger.className = 'menu-toggle';
    burger.setAttribute('aria-controls', 'site-nav');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    burger.innerHTML = '<span></span><span></span><span></span>';
    headerInner.insertBefore(burger, nav);
    const narrow = window.matchMedia('(max-width: 900px)');
    const $ = window.jQuery;
    const speed = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200;
    const setMenu = open => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.querySelector('.site-header').classList.toggle('menu-open', open);
      if ($) $(nav).stop(true, true)[open ? 'slideDown' : 'slideUp'](speed(), () => { if (!open) nav.style.display = ''; });
      else nav.style.display = open ? 'block' : '';
    };
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', event => { if (narrow.matches && event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
    });
    narrow.addEventListener('change', () => {
      burger.setAttribute('aria-expanded', 'false');
      document.querySelector('.site-header').classList.remove('menu-open');
      nav.style.display = '';
    });
  }

  // Sticky header gets a shadow once the page scrolls.
  const header = document.querySelector('.site-header');
  if (header) {
    const shadow = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', shadow, {passive: true}); shadow();
  }
})();

// jQuery effects are optional enhancements; navigation and native FAQ still work without JS.
(() => {
  const $ = window.jQuery;
  if (!$) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const speed = () => reducedMotion.matches ? 0 : 220;
  window.RentKitShowMessage = element => $(element).stop(true, true).hide().fadeIn(speed());
  $('.faq-list details').each(function (index) {
    const details = this;
    const summary = details.querySelector('summary');
    const answer = details.querySelector('p');
    answer.id = `faq-answer-${index}`;
    summary.setAttribute('aria-controls', answer.id);
    summary.setAttribute('aria-expanded', String(details.open));
    $(summary).on('click', function (event) {
      event.preventDefault();
      const $answer = $(answer).stop(true, true);
      const opening = summary.getAttribute('aria-expanded') !== 'true';
      summary.setAttribute('aria-expanded', String(opening));
      if (opening) {
        details.open = true;
        $answer.hide();
      }
      $answer.slideToggle(speed(), () => {
        details.open = opening;
        if (!opening) $answer.css('display', '');
      });
    });
  });
  $(document).on('click', 'a[href^="#"]', function (event) {
    if (this.classList.contains('skip-link')) return;
    const target = document.getElementById(this.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    // Finish a previous scroll before starting another; no animation queue builds up.
    $('html, body').stop(true, true).animate({scrollTop: $(target).offset().top - 20}, speed());
    history.replaceState(null, '', this.hash);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({preventScroll: true});
  });
})();
