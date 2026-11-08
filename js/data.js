// One source of truth for the catalogue, details and booking calculator.
window.RentKit = (() => {
  const kits = [
    { id: 'video', name: 'Video Project Kit', category: 'video', image: 'video', prices: {1: 5000, 3: 13000, 7: 26000}, contents: ['Phone tripod', 'Microphone', 'LED light', 'Cables & adapters'], bring: 'Your compatible phone, a charged battery and your idea.', description: 'Your phone. A steadier shot. A story worth telling.' },
    { id: 'podcast', name: 'Podcast Kit', category: 'audio', image: 'podcast', prices: {1: 7000, 3: 18000, 7: 36000}, contents: ['Two microphones', 'Desk stands', 'Headphones', 'Recorder & cables'], bring: 'Your conversation plan and a quiet place to record.', description: 'Two voices, one conversation, all the right connections.' },
    { id: 'movie', name: 'Movie Night Kit', category: 'cinema', image: 'movie', prices: {1: 8000, 3: 21000, 7: 42000}, contents: ['Projector', 'Portable screen', 'Speaker', 'Cables'], bring: 'Your compatible video source, film and a suitable room.', description: 'Turn a free evening into a little cinema at home.' },
    { id: 'presentation', name: 'Presentation Kit', category: 'presentation', image: 'presentation', prices: {1: 6000, 3: 15000, 7: 30000}, contents: ['Projector', 'Clicker', 'HDMI cable', 'Adapters'], bring: 'Your compatible laptop, slides and a projection surface.', description: 'Bring your slides. We provide the presentation setup.' },
    { id: 'light', name: 'Light & Tripod Kit', category: 'video', image: 'video', prices: {1: 3000, 3: 8000, 7: 16000}, contents: ['Phone tripod', 'LED light'], bring: 'Your charged compatible phone; use its built-in microphone.', description: 'A simple setup for product photos and silent reels.' },
    { id: 'solo', name: 'Solo Recording Kit', category: 'audio', image: 'podcast', prices: {1: 4000, 3: 10000, 7: 20000}, contents: ['One microphone', 'Desk stand', 'Headphones', 'Recorder & cables'], bring: 'Your script and a quiet recording space.', description: 'Record a voice-over, practice a speech or tell your story.' },
    { id: 'projector', name: 'Projector Essentials Kit', category: 'cinema', image: 'movie', prices: {1: 4500, 3: 12000, 7: 24000}, contents: ['Projector', 'HDMI cable', 'Power cable'], bring: 'Your HDMI video source, speakers and a white wall; no screen included.', description: 'Already have a screen and sound? Rent just the essentials.' },
    { id: 'speaker', name: 'Presenter Accessories Kit', category: 'presentation', image: 'presentation', prices: {1: 2000, 3: 5000, 7: 10000}, contents: ['Clicker', 'HDMI cable', 'Adapters'], bring: 'Your compatible laptop and a venue with its own projector.', description: 'The missing connections for a room that already has a projector.' }
  ];
  const getKit = id => kits.find(kit => kit.id === id) || null;
  const money = amount => new Intl.NumberFormat('en-US').format(amount).replaceAll(',', ' ') + ' ₸';
  function searchKits({query = '', category = 'all', sort = 'featured', maxPrice = Infinity} = {}) {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const results = kits.filter(kit => (category === 'all' || kit.category === category)
      && kit.prices[1] <= maxPrice && words.every(word => `${kit.name} ${kit.description} ${kit.contents.join(' ')}`.toLowerCase().includes(word)));
    if (sort === 'price-asc') results.sort((a, b) => a.prices[1] - b.prices[1]);
    if (sort === 'price-desc') results.sort((a, b) => b.prices[1] - a.prices[1]);
    if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
    return results;
  }
  function calculate(id, days, method) {
    const kit = getKit(id);
    if (!kit || ![1, 3, 7].includes(Number(days)) || !['pickup', 'delivery'].includes(method)) return null;
    const rental = kit.prices[Number(days)];
    if (!Number.isSafeInteger(rental) || rental <= 0) return null;
    const fee = method === 'delivery' ? 2000 : 0;
    return {kit, days: Number(days), rental, fee, total: rental + fee, method};
  }
  function today(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en', {timeZone: 'Asia/Qyzylorda', year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(now);
    return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type).value).join('-');
  }
  function validDate(value, minimum = today()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value && value >= minimum;
  }
  function returnDate(value, days) {
    if (!validDate(value, '0001-01-01') || ![1, 3, 7].includes(Number(days))) return '';
    const date = new Date(`${value}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + Number(days));
    return date.toISOString().slice(0, 10);
  }
  function validate(values, minimum = today()) {
    const errors = {};
    if (!getKit(values.kit)) errors.kit = 'Choose a kit from the list.';
    if (!validDate(values['pickup-date'], minimum)) errors['pickup-date'] = 'Choose a real date, today or later in Kazakhstan.';
    if (!['1', '3', '7'].includes(String(values.duration))) errors.duration = 'Choose 1, 3 or 7 days.';
    if (!['pickup', 'delivery'].includes(values.method)) errors.pickup = 'Choose pickup or delivery.';
    if (!/^[\p{L}\p{M}][\p{L}\p{M} .’'-]{1,99}$/u.test((values['full-name'] || '').trim())) errors['full-name'] = 'Enter 2–100 characters using letters, spaces, apostrophes or hyphens.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email || '') || values.email.length > 150) errors.email = 'Enter a valid email, for example name@example.com.';
    const phone = (values.phone || '').replace(/[\s()-]/g, '');
    if (!/^(?:\+7|8)\d{10}$/.test(phone)) errors.phone = 'Use +7 or 8 followed by 10 digits.';
    if ((values.comment || '').length > 500) errors.comment = 'Keep the comment within 500 characters.';
    if (!values['terms-agreed']) errors['terms-agreed'] = 'Accept the rental conditions to continue.';
    return errors;
  }
  return {kits, getKit, money, searchKits, calculate, today, validDate, returnDate, validate};
})();
