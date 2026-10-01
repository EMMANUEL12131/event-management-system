(function () {
  const eventsListEl = document.getElementById("eventsList");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const token = localStorage.getItem("token");

  // This will hold the FULL, unfiltered list of events once fetched,
  // so we can filter it repeatedly without re-fetching from the server each time
  let allEvents = [];

  // This function builds and displays event cards from a given array
  // (it's separate from fetching, so we can reuse it for both "all events"
  // and "filtered events")
  const renderEvents = (events) => {
    if (events.length === 0) {
      eventsListEl.innerHTML = "<p>No events match your search.</p>";
      return;
    }

    eventsListEl.innerHTML = "";

    events.forEach((event) => {
      const card = document.createElement("div");
      card.className = "event-card";
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
      eventsListEl.appendChild(card);
    });
  };

  // This function looks at the current search text and selected category,
  // filters "allEvents" accordingly, then re-renders
  const applyFilters = () => {
    // .toLowerCase() makes the search case-insensitive (so "music" matches "Music")
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    // ".filter()" builds a NEW array containing only items that pass a test
    const filtered = allEvents.filter((event) => {
      // Does the title contain the search term? (true if searchTerm is empty too)
      const matchesSearch = event.title.toLowerCase().includes(searchTerm);

      // Does the category match the dropdown? (true if "All Categories" is selected)
      const matchesCategory = selectedCategory === "" || event.category === selectedCategory;

      // Only include events that pass BOTH checks
      return matchesSearch && matchesCategory;
    });

    renderEvents(filtered);
  };

  // Fetch all events once, store them, populate the category dropdown, and display them
  const loadEvents = async () => {
    try {
      const response = await fetch("/api/events");
      allEvents = await response.json();

      // Build a list of unique categories from the real event data
      // "new Set(...)" automatically removes duplicates
      const categories = [...new Set(allEvents.map((event) => event.category))];

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });

      renderEvents(allEvents);

    } catch (error) {
      eventsListEl.innerHTML = "<p>Failed to load events. Please try again.</p>";
    }
  };

  const handleRegisterClick = async (event) => {
    if (event.target.tagName !== "BUTTON") return;

    if (!token) {
      alert("Please log in first to register for an event.");
      window.location.href = "/login.html";
      return;
    }

    const eventId = event.target.getAttribute("data-event-id");

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Successfully registered! Check your email for confirmation.");
        loadEvents();
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  // Re-apply filters every time the user types in the search box
  searchInput.addEventListener("input", applyFilters);

  // Re-apply filters every time a different category is selected
  categoryFilter.addEventListener("change", applyFilters);

  eventsListEl.addEventListener("click", handleRegisterClick);

  loadEvents();
})();