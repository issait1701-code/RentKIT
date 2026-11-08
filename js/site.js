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
