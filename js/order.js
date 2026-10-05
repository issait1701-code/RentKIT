// The whole booking stays in this tab. There is no network request or storage.
const kits = {
  video: {
    name: "Video Project Kit",
    contents: "Phone tripod, microphone, LED light, cables and adapters.",
    bring: "You bring your compatible phone and a charged battery.",
    alt: "Phone tripod with an empty clamp, LED light, microphone, cables and adapters",
    prices: { 1: 5000, 3: 13000, 7: 26000 }
  },
  podcast: {
    name: "Podcast Kit",
    contents: "Two microphones, desk stands, headphones, recorder and cables.",
    bring: "You bring your conversation plan and a quiet place to record.",
    alt: "Two microphones on desk stands, headphones, recording device and cables",
    prices: { 1: 7000, 3: 18000, 7: 36000 }
  },
  movie: {
    name: "Movie Night Kit",
    contents: "Projector, portable screen, speaker and cables.",
    bring: "You bring your compatible video source, film and a suitable room.",
    alt: "Projector, portable screen, speaker and connection cables",
    prices: { 1: 8000, 3: 21000, 7: 42000 }
  },
  presentation: {
    name: "Presentation Kit",
    contents: "Projector, clicker, HDMI cable and adapters.",
    bring: "You bring your compatible laptop, slides and a projection surface.",
    alt: "Projector, presentation clicker, coiled HDMI cable and adapters",
    prices: { 1: 6000, 3: 15000, 7: 30000 }
  }
};

const form = document.getElementById("booking-form");
const kitSelect = document.getElementById("kit");
const durationSelect = document.getElementById("duration");
const pickupDate = document.getElementById("pickup-date");
const fullName = document.getElementById("full-name");
const status = document.getElementById("booking-status");
const error = document.getElementById("form-error");
const confirmButton = document.getElementById("confirm-booking");

// Use Kazakhstan time even if the visitor's computer uses another time zone.
function todayInKazakhstan() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Qyzylorda", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const year = parts.find(part => part.type === "year").value;
  const month = parts.find(part => part.type === "month").value;
  const day = parts.find(part => part.type === "day").value;
  return `${year}-${month}-${day}`;
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US").format(amount).replaceAll(",", " ") + " ₸";
}

function formatPickupDate(value) {
  if (!value) return "Choose a date";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric"
  }).format(new Date(year, month - 1, day));
}

// Only keys from the four-kit catalogue can reach the page.
function getRental() {
  const kit = Object.hasOwn(kits, kitSelect.value) ? kits[kitSelect.value] : null;
  const duration = durationSelect.value;
  const delivery = document.getElementById("delivery").checked;
  const fee = delivery ? 2000 : 0;
  const rental = kit && Object.hasOwn(kit.prices, duration) ? kit.prices[duration] : 0;
  return { kit, duration, delivery, fee, rental, total: rental + fee };
}

function validateDate() {
  pickupDate.min = todayInKazakhstan();
  pickupDate.setCustomValidity(pickupDate.value && pickupDate.value < pickupDate.min
    ? "Choose today or a future pickup date." : "");
}

function updateSummary() {
  const booking = getRental();
  validateDate();
  fullName.setCustomValidity(fullName.value && fullName.value.trim().length < 2
    ? "Enter a name with at least two non-space characters." : "");
  const imagePath = booking.kit ? `images/${kitSelect.value}-kit.svg` : "images/hero-case.svg";
  const imageAlt = booking.kit ? booking.kit.alt : "An open RentKit equipment case";
  for (const id of ["kit-preview-image", "summary-image"]) {
    const image = document.getElementById(id);
    image.src = imagePath;
    image.alt = imageAlt;
    image.height = booking.kit ? 560 : 640;
    image.classList.toggle("case-placeholder", !booking.kit);
  }
  document.getElementById("kit-description").textContent = booking.kit
    ? `${booking.kit.contents} ${booking.kit.bring}` : "Choose a kit to see its contents and what you need to bring.";
  document.getElementById("summary-kit").textContent = booking.kit ? booking.kit.name : "Your kit goes here";
  document.getElementById("summary-bring").textContent = booking.kit ? booking.kit.bring : "Choose a setup to review its price and contents.";
  document.getElementById("summary-date").textContent = formatPickupDate(pickupDate.value);
  document.getElementById("summary-duration").textContent = `${booking.duration} ${booking.duration === "1" ? "day" : "days"}`;
  document.getElementById("summary-rental").textContent = booking.kit ? formatMoney(booking.rental) : "—";
  document.getElementById("summary-method").textContent = booking.delivery ? "Delivery" : "Pickup";
  document.getElementById("summary-fee").textContent = formatMoney(booking.fee);
  document.getElementById("summary-total").textContent = booking.kit ? formatMoney(booking.total) : "—";
  // Editing any field invalidates the previous demo confirmation.
  status.textContent = "";
  error.textContent = "";
}

function confirmDemo(event) {
  event.preventDefault();
  updateSummary();
  if (!form.checkValidity()) {
    error.textContent = "Please complete the required fields, check your email and date, and accept the rental conditions.";
    form.reportValidity();
    return;
  }
  const booking = getRental();
  status.textContent = `Your rental summary is ready. ${booking.kit.name} · ${booking.duration} ${booking.duration === "1" ? "day" : "days"} · ${formatMoney(booking.total)} total.`;
  status.focus();
}

const requestedKit = new URLSearchParams(window.location.search).get("kit");
if (Object.hasOwn(kits, requestedKit)) kitSelect.value = requestedKit;
form.addEventListener("input", updateSummary);
form.addEventListener("change", updateSummary);
form.addEventListener("submit", confirmDemo);
confirmButton.addEventListener("click", confirmDemo);
updateSummary();
// Enable confirmation only after every local handler has been installed.
confirmButton.disabled = false;
