(function () {
  // Grab the form and message elements
const loginForm = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  // Stop the default page reload on submit
  event.preventDefault();

  // Read the typed values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Send a POST request to our login endpoint
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save the new token and name, same as registration
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);

      messageEl.textContent = "Login successful! Redirecting...";
      messageEl.style.color = "green";

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1500);

    } else {
      messageEl.textContent = data.message;
      messageEl.style.color = "red";
    }

  } catch (error) {
    messageEl.textContent = "Something went wrong. Please try again.";
    messageEl.style.color = "red";
  }
});})();