(function () {
  const token = localStorage.getItem("token");

  // If no one's logged in, this whole page is meaningless — redirect immediately
  if (!token) {
    alert("Please log in to view your dashboard.");
    window.location.href = "/login.html";
  }

  const registrationsEl = document.getElementById("myRegistrations");
  const myEventsEl = document.getElementById("myEvents");

  // Load and display events the user registered for
  const loadMyRegistrations = async () => {
    try {
      const response = await fetch("/api/events/my-registrations", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const registrations = await response.json();

      if (registrations.length === 0) {
        registrationsEl.innerHTML = "<p>You haven't registered for any events yet.</p>";
        return;
      }

      registrationsEl.innerHTML = "";

      registrations.forEach((reg) => {
        // Notice: the actual event details are nested inside reg.event,
        // because of how we structured the Registration model + .populate()
        const event = reg.event;

        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${new Date(event.date).toDateString()} at ${event.time}</p>
          <p><strong>Location:</strong> ${event.location}</p>
        `;
        registrationsEl.appendChild(card);
      });

    } catch (error) {
      registrationsEl.innerHTML = "<p>Failed to load your registrations.</p>";
    }
  };

  // Load and display events the user created
  const loadMyEvents = async () => {
    try {
      const response = await fetch("/api/events/my-events", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const events = await response.json();

      if (events.length === 0) {
        myEventsEl.innerHTML = "<p>You haven't created any events yet. <a href='/create-event.html'>Create one →</a></p>";
        return;
      }

      myEventsEl.innerHTML = "";

      events.forEach((event) => {
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${new Date(event.date).toDateString()} at ${event.time}</p>
          <p><strong>Seats filled:</strong> ${event.registeredCount} / ${event.capacity}</p>
        `;
        myEventsEl.appendChild(card);
      });

    } catch (error) {
      myEventsEl.innerHTML = "<p>Failed to load your events.</p>";
    }
  };

  loadMyRegistrations();
  loadMyEvents();
})();