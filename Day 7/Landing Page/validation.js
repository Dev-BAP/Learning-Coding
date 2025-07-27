// Form validation for login and signup forms
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const errorMessage = document.getElementById("error-message");

  if (!form) return; // Exit if no form found

  // Get form elements
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const firstnameInput = document.getElementById("firstname-input");
  const repeatPasswordInput = document.getElementById("repeat-password-input");

  // Email validation function
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation function
  function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Clear error message
  function clearError() {
    if (errorMessage) {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    }
  }

  // Show error message
  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = "block";
      errorMessage.style.color = "#ff3333";
    }
  }

  // Show success message
  function showSuccess(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = "block";
      errorMessage.style.color = "#28a745";
    }
  }

  // Real-time validation for email
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const email = this.value.trim();
      if (email && !validateEmail(email)) {
        this.style.borderColor = "#ff3333";
        showError("Please enter a valid email address");
      } else {
        this.style.borderColor = "#28a745";
        clearError();
      }
    });

    emailInput.addEventListener("input", function () {
      if (this.style.borderColor === "rgb(255, 51, 51)") {
        const email = this.value.trim();
        if (validateEmail(email)) {
          this.style.borderColor = "#28a745";
          clearError();
        }
      }
    });
  }

  // Real-time validation for password
  if (passwordInput) {
    passwordInput.addEventListener("blur", function () {
      const password = this.value;
      if (password && !validatePassword(password)) {
        this.style.borderColor = "#ff3333";
        showError(
          "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"
        );
      } else {
        this.style.borderColor = "#28a745";
        clearError();
      }
    });

    passwordInput.addEventListener("input", function () {
      if (this.style.borderColor === "rgb(255, 51, 51)") {
        const password = this.value;
        if (validatePassword(password)) {
          this.style.borderColor = "#28a745";
          clearError();
        }
      }
    });
  }

  // Real-time validation for firstname (signup only)
  if (firstnameInput) {
    firstnameInput.addEventListener("blur", function () {
      const firstname = this.value.trim();
      if (firstname && firstname.length < 2) {
        this.style.borderColor = "#ff3333";
        showError("First name must be at least 2 characters long");
      } else {
        this.style.borderColor = "#28a745";
        clearError();
      }
    });

    firstnameInput.addEventListener("input", function () {
      if (this.style.borderColor === "rgb(255, 51, 51)") {
        const firstname = this.value.trim();
        if (firstname.length >= 2) {
          this.style.borderColor = "#28a745";
          clearError();
        }
      }
    });
  }

  // Real-time validation for repeat password (signup only)
  if (repeatPasswordInput) {
    repeatPasswordInput.addEventListener("blur", function () {
      const password = passwordInput ? passwordInput.value : "";
      const repeatPassword = this.value;
      if (repeatPassword && password !== repeatPassword) {
        this.style.borderColor = "#ff3333";
        showError("Passwords do not match");
      } else if (repeatPassword && password === repeatPassword) {
        this.style.borderColor = "#28a745";
        clearError();
      }
    });

    repeatPasswordInput.addEventListener("input", function () {
      if (this.style.borderColor === "rgb(255, 51, 51)") {
        const password = passwordInput ? passwordInput.value : "";
        const repeatPassword = this.value;
        if (password === repeatPassword) {
          this.style.borderColor = "#28a745";
          clearError();
        }
      }
    });
  }

  // Form submission handling
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    let errorMsg = "";

    // Validate email
    if (emailInput) {
      const email = emailInput.value.trim();
      if (!email) {
        isValid = false;
        errorMsg = "Email is required";
        emailInput.style.borderColor = "#ff3333";
      } else if (!validateEmail(email)) {
        isValid = false;
        errorMsg = "Please enter a valid email address";
        emailInput.style.borderColor = "#ff3333";
      }
    }

    // Validate password
    if (passwordInput) {
      const password = passwordInput.value;
      if (!password) {
        isValid = false;
        errorMsg = "Password is required";
        passwordInput.style.borderColor = "#ff3333";
      } else if (!validatePassword(password)) {
        isValid = false;
        errorMsg =
          "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number";
        passwordInput.style.borderColor = "#ff3333";
      }
    }

    // Validate firstname (signup only)
    if (firstnameInput) {
      const firstname = firstnameInput.value.trim();
      if (!firstname) {
        isValid = false;
        errorMsg = "First name is required";
        firstnameInput.style.borderColor = "#ff3333";
      } else if (firstname.length < 2) {
        isValid = false;
        errorMsg = "First name must be at least 2 characters long";
        firstnameInput.style.borderColor = "#ff3333";
      }
    }

    // Validate repeat password (signup only)
    if (repeatPasswordInput) {
      const password = passwordInput ? passwordInput.value : "";
      const repeatPassword = repeatPasswordInput.value;
      if (!repeatPassword) {
        isValid = false;
        errorMsg = "Please repeat your password";
        repeatPasswordInput.style.borderColor = "#ff3333";
      } else if (password !== repeatPassword) {
        isValid = false;
        errorMsg = "Passwords do not match";
        repeatPasswordInput.style.borderColor = "#ff3333";
      }
    }

    if (!isValid) {
      showError(errorMsg);
      return;
    }

    // If all validation passes, show success message
    const isSignup = window.location.pathname.includes("signup");
    const successMsg = isSignup
      ? "Account created successfully!"
      : "Login successful!";
    showSuccess(successMsg);

    // Reset form
    form.reset();

    // Reset border colors
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      input.style.borderColor = "";
    });

    // Redirect after a short delay (for demo purposes)
    setTimeout(() => {
      if (isSignup) {
        window.location.href = "login.html";
      } else {
        window.location.href = "index.html";
      }
    }, 2000);
  });

  // Social login handling
  const socialLinks = document.querySelectorAll(".social-container a");
  socialLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const social = this.getAttribute("data-social");
      showSuccess(`Redirecting to ${social} login...`);

      // Simulate redirect after a short delay
      setTimeout(() => {
        window.open(this.href, "_blank");
      }, 1000);
    });
  });
});
