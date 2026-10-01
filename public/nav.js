(function () {
  // Check if a token exists in browser storage — this tells us if someone's logged in
const token = localStorage.getItem("token");
const userName = localStorage.getItem("userName");

// Find the <nav> element on whichever page this script runs on
const navEl = document.querySelector("nav");

// If a token exists, the user is logged in — update the nav bar accordingly
if (token) {
  // Replace the Login/Register links with a welcome message and Logout button
  navEl.innerHTML = `
    <a href="/index.html">Home</a>
    <a href="/events.html">Events</a>
    <a href="/create-event.html">Create Event</a>
    <a href="/dashboard.html">Dashboard</a>
    <span>Welcome, ${userName}</span>
    <a href="#" id="logoutLink">Logout</a>
  `;

  // Find the newly created Logout link, and listen for clicks on it
  document.getElementById("logoutLink").addEventListener("click", (event) => {
    // Stop the link from actually navigating anywhere (it points to "#")
    event.preventDefault();

    // Clear the saved login info
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    // Send the user back to the homepage, now logged out
    window.location.href = "/index.html";
  });
}
// If there's no token, we do nothing — the original Login/Register links
// we already wrote in the HTML stay exactly as they are
  })();