document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const name_input = document.getElementById("name-input");
  const email_input = document.getElementById("email-input");
  const password_input = document.getElementById("password-input");
  const repeat_password_input = document.getElementById(
    "repeat-password-input"
  );
  const error_message = document.getElementById("error-message");
  const success_message = document.getElementById("success-message");
  const math_answer_input = document.getElementById("math-answer");
  const math_question = document.getElementById("math-question");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");

  // Mobile detection
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;

  // Mobile-specific enhancements
  if (isMobile) {
    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="password"]'
    );
    inputs.forEach((input) => {
      input.addEventListener("focus", function () {
        // Add a small delay to prevent zoom
        setTimeout(() => {
          this.style.fontSize = "16px";
        }, 100);
      });

      input.addEventListener("blur", function () {
        // Reset font size after blur
        this.style.fontSize = "";
      });
    });

    // Improve touch targets for mobile
    const touchTargets = document.querySelectorAll(
      "button, .close, .math-option"
    );
    touchTargets.forEach((target) => {
      target.style.minHeight = "44px";
      target.style.minWidth = "44px";
    });

    // Special handling for password toggle icons - make them easier to tap without changing appearance
    const passwordIcons = document.querySelectorAll(".password-container img");
    passwordIcons.forEach((icon) => {
      // Create a wrapper div to make the touch target larger without affecting the icon
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 2;
      `;

      // Move the icon into the wrapper
      icon.parentNode.insertBefore(wrapper, icon);
      wrapper.appendChild(icon);

      // Reset icon styles
      icon.style.position = "static";
      icon.style.right = "auto";
      icon.style.top = "auto";
      icon.style.transform = "none";
      icon.style.margin = "0";
      icon.style.padding = "0";
    });

    // Add touch feedback for buttons
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("touchstart", function () {
        this.style.transform = "scale(0.95)";
      });

      button.addEventListener("touchend", function () {
        this.style.transform = "";
      });
    });
  }

  // Auto-hide error and success messages after 5 seconds
  function autoHideMessages() {
    // Check for error messages
    if (error_message) {
      const errorText = error_message.textContent.trim();
      if (errorText !== "" && errorText !== "undefined") {
        console.log("Found error message:", errorText);

        // Add close button to error message
        if (!error_message.querySelector(".message-close")) {
          const closeBtn = document.createElement("span");
          closeBtn.className = "message-close";
          closeBtn.innerHTML = "&times;";
          closeBtn.style.cssText =
            "float: right; cursor: pointer; font-size: 18px; font-weight: bold; margin-left: 10px;";
          closeBtn.onclick = () => hideMessage(error_message);
          error_message.appendChild(closeBtn);
        }

        // Set timeout to hide error message
        setTimeout(() => {
          console.log("Hiding error message after timeout");
          hideMessage(error_message);
        }, 5000);
      }
    }

    // Check for success messages
    if (success_message) {
      const successText = success_message.textContent.trim();
      if (successText !== "" && successText !== "undefined") {
        console.log("Found success message:", successText);

        // Add close button to success message
        if (!success_message.querySelector(".message-close")) {
          const closeBtn = document.createElement("span");
          closeBtn.className = "message-close";
          closeBtn.innerHTML = "&times;";
          closeBtn.style.cssText =
            "float: right; cursor: pointer; font-size: 18px; font-weight: bold; margin-left: 10px; color: #28a745;";
          closeBtn.onclick = () => hideMessage(success_message);
          success_message.appendChild(closeBtn);
        }

        // Set timeout to hide success message
        setTimeout(() => {
          console.log("Hiding success message after timeout");
          hideMessage(success_message);
        }, 5000);
      }
    }
  }

  // Function to hide message with fade effect
  function hideMessage(messageElement) {
    if (messageElement) {
      console.log("Hiding message element:", messageElement);
      messageElement.style.opacity = "0";
      setTimeout(() => {
        messageElement.style.display = "none";
        messageElement.textContent = "";
        messageElement.classList.remove("error", "success");
        console.log("Message hidden successfully");
      }, 300);
    }
  }

  // Initialize auto-hide for existing messages with a small delay
  setTimeout(() => {
    autoHideMessages();
  }, 100);

  function getSignupFormErrors(name, email, password, repeatPassword) {
    let errors = [];

    if (name === "" || name == null) {
      errors.push("Name is required");
      name_input.parentElement.classList.add("incorrect");
    }
    if (email === "" || email == null) {
      errors.push("Email is required");
      email_input.parentElement.classList.add("incorrect");
    } else if (!isValidEmail(email)) {
      errors.push("Please enter a valid email address");
      email_input.parentElement.classList.add("incorrect");
    }
    if (password === "" || password == null) {
      errors.push("Password is required");
      password_input.parentElement.classList.add("incorrect");
    } else if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
      password_input.parentElement.classList.add("incorrect");
    }
    if (repeatPassword === "" || repeatPassword == null) {
      errors.push("Please repeat your password");
      repeat_password_input.parentElement.classList.add("incorrect");
    } else if (password !== repeatPassword) {
      errors.push("Passwords do not match");
      repeat_password_input.parentElement.classList.add("incorrect");
    }

    return errors;
  }

  function getLoginFormErrors(email, password) {
    let errors = [];

    if (email === "" || email == null) {
      errors.push("Email is required");
      email_input.parentElement.classList.add("incorrect");
    } else if (!isValidEmail(email)) {
      errors.push("Please enter a valid email address");
      email_input.parentElement.classList.add("incorrect");
    }
    if (password === "" || password == null) {
      errors.push("Password is required");
      password_input.parentElement.classList.add("incorrect");
    }

    return errors;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isMathVerificationCompleted() {
    // Check if math verification elements exist and if the submit button is enabled
    if (math_answer_input && math_question) {
      // Check if the math answer input has the 'correct' class (indicating successful verification)
      if (math_answer_input.classList.contains("correct")) {
        return true;
      }

      // Also check if the submit button is enabled (backup check)
      const submitBtn = loginBtn || signupBtn;
      return submitBtn && !submitBtn.disabled;
    }

    // If math verification elements don't exist, assume verification is not required
    return true;
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      let errors = [];

      if (name_input) {
        // If we have a name input then we are in the signup
        errors = getSignupFormErrors(
          name_input.value,
          email_input.value,
          password_input.value,
          repeat_password_input.value
        );
      } else {
        // If we don't have a name input then we are in the login
        errors = getLoginFormErrors(email_input.value, password_input.value);
      }

      // Check if math verification was completed
      if (!isMathVerificationCompleted()) {
        errors.push("Please complete the math verification");
        e.preventDefault();
        error_message.innerText = errors.join(". ");
        error_message.style.display = "block";
        return;
      }

      if (errors.length > 0) {
        // If there are any errors
        e.preventDefault();
        error_message.innerText = errors.join(". ");
        error_message.style.display = "block";
      }
    });
  }

  const allInputs = [
    name_input,
    email_input,
    password_input,
    repeat_password_input,
  ].filter((input) => input != null);

  allInputs.forEach((input) => {
    input.addEventListener("input", () => {
      // Only remove the incorrect class from this specific input
      if (input.classList.contains("incorrect")) {
        input.classList.remove("incorrect");
      }
      // Don't clear the error message here - let it persist until form submission
    });
  });

  // Password visibility toggle
  const togglePassword = document.getElementById("toggle-password-visibility");
  if (togglePassword && password_input) {
    togglePassword.addEventListener("click", () => {
      const isPassword = password_input.type === "password";
      password_input.type = isPassword ? "text" : "password";
      togglePassword.src = isPassword
        ? "/SecuredLogin/assets/icons/eye-open1.png"
        : "/SecuredLogin/assets/icons/eye-close1.png";
      togglePassword.alt = isPassword ? "Hide Password" : "Show Password";
    });
  }

  // Repeat password visibility toggle (for signup)
  const toggleRepeatPassword = document.getElementById(
    "toggle-repeat-password-visibility"
  );
  if (toggleRepeatPassword && repeat_password_input) {
    toggleRepeatPassword.addEventListener("click", () => {
      const isPassword = repeat_password_input.type === "password";
      repeat_password_input.type = isPassword ? "text" : "password";
      toggleRepeatPassword.src = isPassword
        ? "/SecuredLogin/assets/icons/eye-open1.png"
        : "/SecuredLogin/assets/icons/eye-close1.png";
      toggleRepeatPassword.alt = isPassword
        ? "Hide Repeat Password"
        : "Show Repeat Password";
    });
  }

  // Mobile-specific modal handling
  if (isMobile) {
    // Prevent body scroll when modal is open
    const modals = document.querySelectorAll(
      ".modal, .confirmation-modal, .success-modal"
    );
    modals.forEach((modal) => {
      modal.addEventListener("show", function () {
        document.body.style.overflow = "hidden";
      });

      modal.addEventListener("hide", function () {
        document.body.style.overflow = "";
      });
    });

    // Close modal on backdrop tap for mobile
    modals.forEach((modal) => {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) {
          modal.style.display = "none";
          document.body.style.overflow = "";
        }
      });
    });
  }
});
