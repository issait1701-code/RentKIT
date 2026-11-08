(() => {
  const R = window.RentKit;
  const form = document.getElementById('booking-form');
  const kitSelect = document.getElementById('kit');
  const pickupDate = document.getElementById('pickup-date');
  const status = document.getElementById('booking-status');
  const touched = new Set();
  const fields = ['kit', 'pickup-date', 'duration', 'pickup', 'full-name', 'email', 'phone', 'comment', 'terms-agreed'];
  let checklistKit = null;
  let marks = {};
  try { marks = JSON.parse(localStorage.getItem('rentkit-packing') || '{}') || {}; } catch { /* Storage is optional. */ }
  if (typeof marks !== 'object' || Array.isArray(marks)) marks = {};
  function values() {
    const result = {};
    fields.forEach(id => {
      const input = document.getElementById(id);
      result[id] = input.type === 'checkbox' ? input.checked : input.value;
    });
    result.method = form.querySelector('[name="pickup-method"]:checked')?.value || '';
    return result;
  }
  for (const kit of R.kits) {
    const option = document.createElement('option');
    option.value = kit.id;
    option.textContent = `${kit.name} — ${R.money(kit.prices[1])} / day`;
    kitSelect.append(option);
  }
  // Each field has a persistent inline error and an accessible description.
  for (const id of fields) {
    const input = document.getElementById(id);
    input.name = id === 'pickup' ? 'pickup-method' : id;
    const message = document.createElement('p');
    message.id = `${id}-error`; message.className = 'field-error'; message.setAttribute('aria-live', 'polite');
    (input.closest('.form-check') || input).insertAdjacentElement('afterend', message);
    input.setAttribute('aria-describedby', `${input.getAttribute('aria-describedby') || ''} ${message.id}`.trim());
  }
  document.getElementById('delivery').setAttribute('aria-describedby', 'pickup-error');
  function showErrors(all = false) {
    const errors = R.validate(values());
    fields.forEach(id => {
      const input = document.getElementById(id);
      const error = (all || touched.has(id)) ? errors[id] || '' : '';
      document.getElementById(`${id}-error`).textContent = error;
      input.classList.toggle('is-invalid', Boolean(error));
      input.setAttribute('aria-invalid', String(Boolean(error)));
      if (id === 'pickup') document.getElementById('delivery').setAttribute('aria-invalid', String(Boolean(error)));
    });
    return errors;
  }
  function saveMarks() {
    try { localStorage.setItem('rentkit-packing', JSON.stringify(marks)); } catch { /* Private browsing still works. */ }
  }
  function packingProgress() {
    const boxes = [...document.querySelectorAll('#pack-checklist input')];
    document.getElementById('pack-progress').textContent = boxes.length ? `${boxes.filter(box => box.checked).length} of ${boxes.length} ready` : 'Choose a kit to build your list.';
  }
  function renderChecklist(kit) {
    if ((kit?.id || '') === checklistKit) return;
    checklistKit = kit?.id || '';
    const list = document.getElementById('pack-checklist'); list.replaceChildren();
    if (kit) {
      [kit.bring, 'Check your device ports and adapters.', 'Pack a charger and test your setup before the event.'].forEach((text, index) => {
        const label = document.createElement('label'); label.className = 'packing-item';
        const box = document.createElement('input'); box.type = 'checkbox'; box.id = `pack-${index}`;
        const key = `${kit.id}-${index}`;
        box.checked = marks[key] === true;
        box.addEventListener('change', () => { marks[key] = box.checked; saveMarks(); packingProgress(); });
        const span = document.createElement('span'); span.textContent = text;
        label.append(box, span); list.append(label);
      });
    }
    packingProgress();
  }
  const set = (id, text) => { document.getElementById(id).textContent = text; };
  function updateSummary() {
    pickupDate.min = R.today();
    const data = values();
    const booking = R.calculate(data.kit, data.duration, data.method);
    const kit = R.getKit(data.kit);
    for (const id of ['kit-preview-image', 'summary-image']) {
      const image = document.getElementById(id);
      image.src = kit ? `images/${kit.image}-kit.svg` : 'images/hero-case.svg';
      image.alt = kit ? `${kit.category} equipment family illustration; refer to the included items list` : 'An open RentKit equipment case';
      image.classList.toggle('case-placeholder', !kit);
    }
    set('kit-description', kit ? `${kit.contents.join(' · ')}. Illustration shows the equipment family; only listed items are included.` : 'Choose a kit to see its contents and what you need to bring.');
    set('summary-kit', kit?.name || 'Your kit goes here');
    set('summary-bring', kit?.bring || 'Choose a setup to review its price and contents.');
    set('summary-date', R.validDate(data['pickup-date']) ? data['pickup-date'] : 'Choose a valid date');
    set('summary-duration', booking ? `${booking.days} ${booking.days === 1 ? 'day' : 'days'}` : 'Choose duration');
    set('summary-rental', booking ? R.money(booking.rental) : '—');
    set('summary-method', data.method === 'delivery' ? 'Delivery' : 'Pickup');
    set('summary-fee', booking ? R.money(booking.fee) : '—');
    set('summary-total', booking ? R.money(booking.total) : '—');
    set('summary-return', booking && R.validDate(data['pickup-date']) ? `Return on ${R.returnDate(data['pickup-date'], booking.days)} at the same time as pickup.` : 'Choose a valid pickup date to see your return date.');
    renderChecklist(kit);
  }
  function edit(event) {
    const id = event.target.name === 'pickup-method' ? 'pickup' : event.target.id;
    if (!fields.includes(id)) return;
    touched.add(id); status.textContent = ''; status.style.display = '';
    document.getElementById('form-error').textContent = '';
    showErrors(); updateSummary();
  }
  form.addEventListener('input', edit);
  form.addEventListener('change', edit);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const errors = showErrors(true);
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach(id => touched.add(id));
      document.getElementById('form-error').textContent = 'Check the highlighted fields below each label.';
      document.getElementById(Object.keys(errors)[0]).focus();
      return;
    }
    const data = values(); const booking = R.calculate(data.kit, data.duration, data.method);
    const message = `Demo booking confirmed: ${booking.kit.name}, ${booking.days} ${booking.days === 1 ? 'day' : 'days'}, ${R.money(booking.total)}. Return on ${R.returnDate(data['pickup-date'], booking.days)}. No request was sent. The form has been cleared.`;
    form.reset(); touched.clear(); showErrors(); updateSummary();
    document.getElementById('form-error').textContent = '';
    status.textContent = message;
    window.RentKitShowMessage?.(status); status.focus();
  });
  document.getElementById('reset-checklist').addEventListener('click', () => {
    if (!checklistKit) return;
    for (let index = 0; index < 3; index++) delete marks[`${checklistKit}-${index}`];
    saveMarks(); checklistKit = null; renderChecklist(R.getKit(kitSelect.value));
  });
  const requestedKit = new URLSearchParams(location.search).get('kit');
  if (R.getKit(requestedKit)) kitSelect.value = requestedKit;
  updateSummary();
  document.getElementById('confirm-booking').disabled = false;
})();
