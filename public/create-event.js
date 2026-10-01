(function () {
  // Grab the form and message elements
  const createEventForm = document.getElementById("createEventForm");
  const messageEl = document.getElementById("message");

  // Get the logged-in user's token — needed since creating an event is protected
  const token = localStorage.getItem("token");

  createEventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!token) {
      alert("Please log in first to create an event.");
      window.location.href = "/login.html";
      return;
    }

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const location = document.getElementById("location").value;
    const capacity = document.getElementById("capacity").value;

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          date,
          time,
          location,
          capacity: Number(capacity),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        messageEl.textContent = "Event created successfully! Redirecting...";
        messageEl.style.color = "green";

        setTimeout(() => {
          window.location.href = "/events.html";
        }, 1500);

      } else {
        messageEl.textContent = data.message;
        messageEl.style.color = "red";
      }

    } catch (error) {
      messageEl.textContent = "Something went wrong. Please try again.";
      messageEl.style.color = "red";
    }
  });
})();