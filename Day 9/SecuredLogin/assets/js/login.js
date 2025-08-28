// Modal functionality
const modal = document.getElementById("math-modal");
const checkbox = document.getElementById("show-math-modal");
const closeBtn = document.querySelector(".close");
const verifyBtn = document.getElementById("verify-math");
const resetBtn = document.getElementById("reset-math");
const loginBtn = document.getElementById("login-btn");
const mathAnswer = document.getElementById("math-answer");
const mathAnswerHidden = document.getElementById("math-answer-hidden");
const mathQuestion = document.getElementById("math-question");
const mathLoader = document.getElementById("math-loader");
const mathOptionsContainer = document.getElementById("math-options");

let selectedOption = null;

// Confirmation modal elements
const confirmationModal = document.getElementById("confirmation-modal");
const confirmResetBtn = document.getElementById("confirm-reset");
const cancelResetBtn = document.getElementById("cancel-reset");

// Success modal elements
const successModal = document.getElementById("success-modal");
const continueLoginBtn = document.getElementById("continue-login");

// Show modal when checkbox is checked (optimized)
checkbox.addEventListener("change", function () {
  if (this.checked) {
    // Use requestAnimationFrame for smoother modal display
    requestAnimationFrame(() => {
      modal.style.display = "flex";
      document.body.classList.add("no-scroll");
      // Delay options generation slightly for better perceived performance
      setTimeout(() => {
        generateMathOptions();
      }, 50);
    });
  } else {
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
    loginBtn.disabled = true;
    if (mathAnswerHidden) mathAnswerHidden.value = "";
    selectedOption = null;
  }
});

// Close modal when clicking X
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
  checkbox.checked = false;
  loginBtn.disabled = true;
  document.body.classList.remove("no-scroll");
  if (mathAnswerHidden) mathAnswerHidden.value = "";
  selectedOption = null;
});

// Prevent closing when clicking outside and stop background scroll
window.addEventListener("mousedown", function (event) {
  if (modal.style.display === "flex" && event.target === modal) {
    event.stopPropagation();
  }
});

window.addEventListener(
  "wheel",
  function (event) {
    if (modal.style.display === "flex") {
      event.preventDefault();
    }
  },
  { passive: false }
);

// Verify math answer
verifyBtn.addEventListener("click", function () {
  if (!selectedOption) {
    alert("Please select an answer first!");
    return;
  }

  const userAnswer = selectedOption.textContent;
  const expectedAnswer = mathQuestion.dataset.answer;

  // Show loader and disable buttons during verification
  mathLoader.classList.add("active");
  verifyBtn.disabled = true;
  resetBtn.disabled = true;

  // Reduced delay for better performance
  setTimeout(() => {
    if (userAnswer === expectedAnswer) {
      // Show success modal instead of immediately closing
      successModal.style.display = "flex";
      selectedOption.classList.remove("incorrect");
      selectedOption.classList.add("correct");
      if (mathAnswerHidden) mathAnswerHidden.value = userAnswer;
    } else {
      selectedOption.classList.add("incorrect");
      selectedOption.classList.remove("correct");
      if (mathAnswerHidden) mathAnswerHidden.value = "";
    }

    // Hide loader and re-enable buttons
    mathLoader.classList.remove("active");
    verifyBtn.disabled = false;
    resetBtn.disabled = false;
  }, 300); // Reduced from 800ms to 300ms for better performance
});

// Continue button in success modal
continueLoginBtn.addEventListener("click", function () {
  console.log("Continue button clicked");
  successModal.style.display = "none";
  modal.style.display = "none";
  loginBtn.disabled = false;
  // Add visual feedback
  this.style.transform = "scale(0.95)";
  setTimeout(() => {
    this.style.transform = "scale(1)";
  }, 150);
});

// Reset button - show confirmation modal
resetBtn.addEventListener("click", function () {
  confirmationModal.style.display = "flex";
});

// Confirm reset button
confirmResetBtn.addEventListener("click", function () {
  confirmationModal.style.display = "none";
  generateNewMathQuestion();
});

// Cancel reset button
cancelResetBtn.addEventListener("click", function () {
  confirmationModal.style.display = "none";
});

// Close confirmation modal when clicking outside
window.addEventListener("click", function (event) {
  if (event.target === confirmationModal) {
    confirmationModal.style.display = "none";
  }
  // Removed the success modal close on outside click - users must click the Continue button
});

// Function to generate math options (enhanced for new operations)
function generateMathOptions() {
  const correctAnswer = parseInt(mathQuestion.dataset.answer);
  const options = [];

  // Add the correct answer
  options.push(correctAnswer);

  // Generate wrong answers based on the magnitude of the correct answer
  const usedNumbers = new Set([correctAnswer]);
  const maxAttempts = 50;

  // Determine range for wrong answers based on correct answer size
  let range;
  if (correctAnswer <= 10) {
    range = 10; // Small numbers: ±10 range
  } else if (correctAnswer <= 50) {
    range = 20; // Medium numbers: ±20 range
  } else if (correctAnswer <= 100) {
    range = 30; // Large numbers: ±30 range
  } else {
    range = Math.floor(correctAnswer * 0.3); // Very large numbers: 30% range
  }

  for (let i = 0; i < 15; i++) {
    let wrongAnswer;
    let attempts = 0;

    do {
      // Generate wrong answer within appropriate range
      const offset = Math.floor(Math.random() * (range * 2 + 1)) - range;
      wrongAnswer = correctAnswer + offset;
      attempts++;
    } while (
      (usedNumbers.has(wrongAnswer) || wrongAnswer < 0) &&
      attempts < maxAttempts
    );

    if (attempts < maxAttempts) {
      usedNumbers.add(wrongAnswer);
      options.push(wrongAnswer);
    }
  }

  // Fill remaining slots with appropriate numbers
  while (options.length < 16) {
    let simpleNumber;
    if (correctAnswer <= 10) {
      simpleNumber = Math.floor(Math.random() * 20) + 1;
    } else if (correctAnswer <= 50) {
      simpleNumber = Math.floor(Math.random() * 50) + 1;
    } else {
      simpleNumber =
        Math.floor(Math.random() * Math.max(correctAnswer, 100)) + 1;
    }

    if (!usedNumbers.has(simpleNumber)) {
      usedNumbers.add(simpleNumber);
      options.push(simpleNumber);
    }
  }

  // Shuffle the options (optimized)
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // Clear previous options
  mathOptionsContainer.innerHTML = "";

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();

  options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.className = "math-option";
    optionElement.textContent = option;

    optionElement.addEventListener("click", function () {
      // Remove selection from previous option
      if (selectedOption) {
        selectedOption.classList.remove("selected");
      }

      // Select this option
      selectedOption = this;
      this.classList.add("selected");

      // Enable verify button
      verifyBtn.disabled = false;
    });

    fragment.appendChild(optionElement);
  });

  // Append all options at once
  mathOptionsContainer.appendChild(fragment);

  // Reset selection
  selectedOption = null;
  verifyBtn.disabled = true;
}

// Function to generate new math question
function generateNewMathQuestion() {
  // Show loader
  mathLoader.classList.add("active");
  verifyBtn.disabled = true;
  resetBtn.disabled = true;

  // Make AJAX request to generate new question
  fetch("generate_math.php")
    .then((response) => response.json())
    .then((data) => {
      // Update the question and answer
      mathQuestion.textContent = data.question;
      mathQuestion.dataset.question = data.question;
      mathQuestion.dataset.answer = data.answer;

      // Generate new options
      generateMathOptions();

      // Reset selection
      selectedOption = null;
      if (mathAnswerHidden) mathAnswerHidden.value = "";

      // Hide loader and re-enable buttons
      mathLoader.classList.remove("active");
      verifyBtn.disabled = true; // Keep disabled until option is selected
      resetBtn.disabled = false;
    })
    .catch((error) => {
      console.error("Error generating new math question:", error);
      // Hide loader and re-enable buttons on error
      mathLoader.classList.remove("active");
      verifyBtn.disabled = false;
      resetBtn.disabled = false;
    });
}

// Enable horizontal mouse wheel scrolling for math options (simplified)
mathOptionsContainer.addEventListener(
  "wheel",
  function (e) {
    e.preventDefault();
    const scrollSpeed = 0.6;
    const delta = e.deltaY * scrollSpeed;
    this.scrollLeft += delta;
  },
  { passive: false }
);

// Remove old Enter key listener since we're using clickable options
