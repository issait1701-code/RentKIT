// One source of truth for the catalogue, details and booking calculator.
window.RentKit = (() => {
  const kits = [
    { id: 'video', name: 'Video Project Kit', category: 'video', image: 'video', prices: {1: 5000, 3: 13000, 7: 26000}, contents: ['Phone tripod', 'Microphone', 'LED light', 'Cables & adapters'], bring: 'Your compatible phone, a charged battery and your idea.', description: 'Your phone. A steadier shot. A story worth telling.', rating: 4.9, reviews: 64, setup: 10, level: 'Beginner', popular: true, uses: ['School projects', 'Vlogs', 'Interviews'], steps: ['Charge your phone and check its mount size.', 'Set up the tripod, light and microphone.', 'Record a 10-second test and listen back.'] },
    { id: 'podcast', name: 'Podcast Kit', category: 'audio', image: 'podcast', prices: {1: 7000, 3: 18000, 7: 36000}, contents: ['Two microphones', 'Desk stands', 'Headphones', 'Recorder & cables'], bring: 'Your conversation plan and a quiet place to record.', description: 'Two voices, one conversation, all the right connections.', rating: 4.8, reviews: 41, setup: 15, level: 'Intermediate', popular: true, uses: ['Podcasts', 'Interviews', 'Radio shows'], steps: ['Pick a quiet room and outline the talk.', 'Connect both microphones to the recorder.', 'Do a test and check both voices on headphones.'] },
    { id: 'movie', name: 'Movie Night Kit', category: 'cinema', image: 'movie', prices: {1: 8000, 3: 21000, 7: 42000}, contents: ['Projector', 'Portable screen', 'Speaker', 'Cables'], bring: 'Your compatible video source, film and a suitable room.', description: 'Turn a free evening into a little cinema at home.', rating: 4.9, reviews: 87, setup: 20, level: 'Beginner', popular: true, uses: ['Movie nights', 'Birthdays', 'Game streams'], steps: ['Find a dark room near a power outlet.', 'Connect your source, projector and speaker.', 'Test picture and sound before guests arrive.'] },
    { id: 'presentation', name: 'Presentation Kit', category: 'presentation', image: 'presentation', prices: {1: 6000, 3: 15000, 7: 30000}, contents: ['Projector', 'Clicker', 'HDMI cable', 'Adapters'], bring: 'Your compatible laptop, slides and a projection surface.', description: 'Bring your slides. We provide the presentation setup.', rating: 4.7, reviews: 52, setup: 10, level: 'Beginner', popular: false, uses: ['Defences', 'Meetings', 'Workshops'], steps: ['Check laptop ports; keep an offline copy of slides.', 'Connect the projector with cable and adapter.', 'Test the picture and the clicker.'] },
    { id: 'light', name: 'Light & Tripod Kit', category: 'video', image: 'light', prices: {1: 3000, 3: 8000, 7: 16000}, contents: ['Phone tripod', 'LED light'], bring: 'Your charged compatible phone; use its built-in microphone.', description: 'A simple setup for product photos and silent reels.', rating: 4.6, reviews: 29, setup: 5, level: 'Beginner', popular: false, uses: ['Product photos', 'Reels', 'Video calls'], steps: ['Charge your phone.', 'Mount the phone and place the light in front.', 'Take a test shot and adjust brightness.'] },
    { id: 'solo', name: 'Solo Recording Kit', category: 'audio', image: 'solo', prices: {1: 4000, 3: 10000, 7: 20000}, contents: ['One microphone', 'Desk stand', 'Headphones', 'Recorder & cables'], bring: 'Your script and a quiet recording space.', description: 'Record a voice-over, practice a speech or tell your story.', rating: 4.7, reviews: 33, setup: 5, level: 'Beginner', popular: false, uses: ['Voice-overs', 'Speech practice', 'Audiobooks'], steps: ['Find a quiet corner with soft surfaces.', 'Plug the microphone into the recorder.', 'Record a test and listen on headphones.'] },
    { id: 'projector', name: 'Projector Essentials Kit', category: 'cinema', image: 'projector', prices: {1: 4500, 3: 12000, 7: 24000}, contents: ['Projector', 'HDMI cable', 'Power cable'], bring: 'Your HDMI video source, speakers and a white wall; no screen included.', description: 'Already have a screen and sound? Rent just the essentials.', rating: 4.5, reviews: 21, setup: 10, level: 'Beginner', popular: false, uses: ['Wall cinema', 'Gaming', 'Classes'], steps: ['Find a white wall and a power outlet.', 'Connect HDMI from your source.', 'Focus the picture before you start.'] },
    { id: 'speaker', name: 'Presenter Accessories Kit', category: 'presentation', image: 'speaker', prices: {1: 2000, 3: 5000, 7: 10000}, contents: ['Clicker', 'HDMI cable', 'Adapters'], bring: 'Your compatible laptop and a venue with its own projector.', description: 'The missing connections for a room that already has a projector.', rating: 4.6, reviews: 18, setup: 3, level: 'Beginner', popular: false, uses: ['Conference rooms', 'Lectures', 'Pitches'], steps: ['Check the room projector input.', 'Pick the adapter that fits your laptop.', 'Pair the clicker and test slides.'] }
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
    if (values.method === 'delivery') {
      const address = (values['delivery-address'] || '').trim();
      if (address.length < 5 || address.length > 150 || !/\p{L}/u.test(address) || !/\d/.test(address)) errors['delivery-address'] = 'Enter the street and building number, for example Mangilik El Ave 55.';
      if (!['10:00–13:00', '13:00–17:00', '17:00–20:00'].includes(values['delivery-time'])) errors['delivery-time'] = 'Choose a delivery time window.';
      if ((values['delivery-apartment'] || '').length > 20) errors['delivery-apartment'] = 'Keep the apartment or office within 20 characters.';
      if ((values['delivery-note'] || '').length > 150) errors['delivery-note'] = 'Keep the note within 150 characters.';
    }
    if ((values.comment || '').length > 500) errors.comment = 'Keep the comment within 500 characters.';
    if (!values['terms-agreed']) errors['terms-agreed'] = 'Accept the rental conditions to continue.';
    return errors;
  }
  const DELIVERY_FEE = 2000;
  const PICKUP_ADDRESS = 'Kabanbay Batyr Ave 62, Astana';
  return {kits, DELIVERY_FEE, PICKUP_ADDRESS, getKit, money, searchKits, calculate, today, validDate, returnDate, validate};
})();
