(function () {
  // Grab the container div where we'll display all events
const eventsListEl = document.getElementById("eventsList");

// Get the logged-in user's token from browser storage (saved during login/register)
// If nobody's logged in, this will just be null
const token = localStorage.getItem("token");

// This function fetches all events from our API and displays them
const loadEvents = async () => {
  try {
    // Send a GET request to our public events endpoint
    const response = await fetch("/api/events");

    // Convert the response into a usable JavaScript array
    const events = await response.json();

    // If there are no events yet, show a simple message instead of a blank page
    if (events.length === 0) {
      eventsListEl.innerHTML = "<p>No events available yet.</p>";
      return; // stop here, nothing else to do
    }

    // Clear out any old content before adding fresh event cards
    eventsListEl.innerHTML = "";

    // Loop through every event in the array, one at a time
    events.forEach((event) => {
      // Build a block of HTML for this one event, using template literals
      // (backticks let us insert variables directly using ${...})
      const card = document.createElement("div");
      card.className = "event-card"; // matches the CSS class we styled earlier

      card.innerHTML = `
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p><strong>Category:</strong> ${event.category}</p>
        <p><strong>Date:</strong> ${new Date(event.date).toDateString()} at ${event.time}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Seats:</strong> ${event.registeredCount} / ${event.capacity} registered</p>
        <p><strong>Organizer:</strong> ${event.organizer.name}</p>
        <button data-event-id="${event._id}">Register</button>
      `;

      // Add this finished card into the page, inside our container div
      eventsListEl.appendChild(card);
    });

  } catch (error) {
    eventsListEl.innerHTML = "<p>Failed to load events. Please try again.</p>";
  }
};

// Actually run the function as soon as this script loads,
// so events appear immediately when the page opens
loadEvents();
// This function handles what happens when ANY register button is clicked
const handleRegisterClick = async (event) => {
  // "event.target" is the exact element that was clicked
  // We only care if it was actually a button (not, say, empty space on the card)
  if (event.target.tagName !== "BUTTON") return;

  // If there's no token, the user isn't logged in — stop them here
  if (!token) {
    alert("Please log in first to register for an event.");
    window.location.href = "/login.html";
    return;
  }

  // Read the event ID we stored earlier using "data-event-id"
  const eventId = event.target.getAttribute("data-event-id");

  try {
    // Send a POST request to our register endpoint for this specific event,
    // including the user's token so the server knows who's registering
    const response = await fetch(`/api/events/${eventId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // attach our saved login token
      },
    });

    const data = await response.json();

    if (response.ok) {
      alert("Successfully registered! Check your email for confirmation.");
      // Reload the events list, so the updated seat count shows immediately
      loadEvents();
    } else {
      alert(data.message); // e.g. "Already registered" or "Event is full"
    }

  } catch (error) {
    alert("Something went wrong. Please try again.");
  }
};

// Instead of adding a click listener to every single button individually,
// we add ONE listener to the whole container. This is called "event delegation" —
// clicks on any button inside eventsListEl will "bubble up" and get caught here,
// even for buttons that didn't exist yet when the page first loaded
eventsListEl.addEventListener("click", handleRegisterClick);})();