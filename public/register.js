// Grab the form element by its id, so we can "listen" for when it's submitted
const registerForm = document.getElementById("registerForm");

// Grab the message paragraph, so we can show feedback to the user
const messageEl = document.getElementById("message");

// "addEventListener" runs a function whenever a specific event happens —
// here, whenever the form is submitted (e.g. the Register button is clicked)
registerForm.addEventListener("submit", async (event) => {
  // Prevent the browser's default behavior, which would normally
  // reload the whole page on form submit — we don't want that,
  // we want to handle it ourselves with JavaScript
  event.preventDefault();

  // Read the current values typed into each input field
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // "fetch" sends a request to our backend, similar to what curl did manually
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // tells the server we're sending JSON
      },
      body: JSON.stringify({ name, email, password }), // convert our data into JSON text
    });

    // Parse the server's response back into a usable JavaScript object
    const data = await response.json();

    // Check if the request succeeded (status codes 200-299 are "ok")
    if (response.ok) {
      // Save the token in the browser's storage, so we stay "logged in"
      // across page visits — localStorage persists even after closing the browser
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);

      // Show a success message
      messageEl.textContent = "Registration successful! Redirecting...";
      messageEl.style.color = "green";

      // Wait 1.5 seconds, then redirect to the homepage
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1500);

    } else {
      // If the server responded with an error (e.g. "User already exists"),
      // show that specific message to the user
      messageEl.textContent = data.message;
      messageEl.style.color = "red";
    }

  } catch (error) {
    // This runs if the request itself failed (e.g. server is down, no internet)
    messageEl.textContent = "Something went wrong. Please try again.";
    messageEl.style.color = "red";
  }
});