(function () {
  // Find the container where we'll show a few preview event cards
  const previewEl = document.getElementById("eventPreview");

  const loadPreview = async () => {
    try {
      // Reuse the same public endpoint as the full events page
      const response = await fetch("/api/events");
      const events = await response.json();

      if (events.length === 0) {
        previewEl.innerHTML = "<p>No events yet — check back soon!</p>";
        return;
      }

      // ".slice(0, 3)" takes just the first 3 events from the array,
      // instead of the full list — that's what makes this a "preview"
      const preview = events.slice(0, 3);

      previewEl.innerHTML = "";

      preview.forEach((event) => {
        const card = document.createElement("div");
        card.className = "event-card";

        // A lighter version of the card — no register button here,
        // since this is just a teaser, not the full browsing experience
        card.innerHTML = `
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
          <p><strong>Location:</strong> ${event.location}</p>
        `;

        previewEl.appendChild(card);
      });

    } catch (error) {
      previewEl.innerHTML = "<p>Failed to load events.</p>";
    }
  };

  loadPreview();
})();