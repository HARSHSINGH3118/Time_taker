document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("authForm");
  const authHeading = document.getElementById("auth-heading");
  const authBtn = document.getElementById("authBtn");
  const toggleAuth = document.getElementById("toggleAuth");
  const loginLink = document.getElementById("loginLink");
  const nameField = document.getElementById("name"); // Added this line
  const authMessage = document.getElementById("authMessage");

  let isLogin = false;

  // Toggle between Sign Up and Log In
  loginLink.addEventListener("click", () => {
    isLogin = !isLogin;
    if (isLogin) {
      authHeading.textContent = "Log In";
      authBtn.textContent = "Log In";
      nameField.style.display = "none";
      nameField.removeAttribute("required"); // Fix for invalid form control
      toggleAuth.innerHTML =
        'Don\'t have an account? <span id="loginLink">Sign Up</span>';
    } else {
      authHeading.textContent = "Sign Up";
      authBtn.textContent = "Sign Up";
      nameField.style.display = "block";
      nameField.setAttribute("required", "required"); // Re-add required when switching back to Sign Up
      toggleAuth.innerHTML =
        'Already have an account? <span id="loginLink">Log In</span>';
    }
  });

  // Handle form submission
  authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (isLogin) {
      // Log in logic
      chrome.storage.local.get([email], (result) => {
        if (result[email]) {
          const storedUser = result[email];
          if (storedUser.password === password) {
            chrome.storage.local.set({ isAuthenticated: true });
            window.location.href = "popup.html";
          } else {
            authMessage.textContent = "Incorrect password!";
          }
        } else {
          authMessage.textContent = "User not found!";
        }
      });
    } else {
      // Sign up logic
      const name = nameField.value;
      chrome.storage.local.get([email], (result) => {
        if (result[email]) {
          authMessage.textContent = "User already exists!";
        } else {
          const userData = { name, email, password };
          chrome.storage.local.set(
            { [email]: userData, isAuthenticated: true },
            () => {
              window.location.href = "popup.html";
            }
          );
        }
      });
    }
  });
});
