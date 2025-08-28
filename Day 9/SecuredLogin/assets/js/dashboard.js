// Dashboard Math Practice functionality
const practiceModal = document.getElementById("math-practice-modal");
const practiceBtn = document.getElementById("practice-math-btn");
const closePracticeBtn = practiceModal.querySelector(".close");
const practiceQuestion = document.getElementById("practice-math-question");
const practiceOptionsContainer = document.getElementById(
  "practice-math-options"
);
const practiceVerifyBtn = document.getElementById("practice-verify");
const practiceNextBtn = document.getElementById("practice-next");
const practiceResetBtn = document.getElementById("practice-reset");
const practiceScore = document.getElementById("practice-score");
const practiceTotal = document.getElementById("practice-total");

let selectedPracticeOption = null;
let currentPracticeAnswer = null;
let practiceScoreCount = 0;
let practiceTotalCount = 0;

// Show practice modal
practiceBtn.addEventListener("click", function () {
  practiceModal.style.display = "flex";
  document.body.classList.add("no-scroll");
  generatePracticeQuestion();
});

// Close practice modal
closePracticeBtn.addEventListener("click", function () {
  practiceModal.style.display = "none";
  document.body.classList.remove("no-scroll");
  resetPracticeSelection();
});

// Close modal when clicking outside - DISABLED for better UX
// window.addEventListener("click", function (event) {
//   if (event.target === practiceModal) {
//     practiceModal.style.display = "none";
//     resetPracticeSelection();
//   }
// });

// Prevent background from scrolling while modal is open
practiceModal.addEventListener(
  "wheel",
  function (e) {
    e.preventDefault();
  },
  { passive: false }
);

// Verify practice answer
practiceVerifyBtn.addEventListener("click", function () {
  if (!selectedPracticeOption) {
    alert("Please select an answer first!");
    return;
  }

  const userAnswer = selectedPracticeOption.textContent;
  practiceTotalCount++;

  if (userAnswer == currentPracticeAnswer) {
    practiceScoreCount++;
    selectedPracticeOption.classList.add("correct");
    selectedPracticeOption.classList.remove("incorrect");
  } else {
    selectedPracticeOption.classList.add("incorrect");
    selectedPracticeOption.classList.remove("correct");
  }

  updatePracticeStats();
  practiceVerifyBtn.disabled = true;
  practiceNextBtn.disabled = false;
});

// Next question
practiceNextBtn.addEventListener("click", function () {
  generatePracticeQuestion();
  practiceVerifyBtn.disabled = false;
  practiceNextBtn.disabled = true;
});

// Reset score
practiceResetBtn.addEventListener("click", function () {
  practiceScoreCount = 0;
  practiceTotalCount = 0;
  updatePracticeStats();
  generatePracticeQuestion();
});

// Function to generate practice question
function generatePracticeQuestion() {
  // Make AJAX request to generate new question
  fetch("../auth/generate_math.php")
    .then((response) => response.json())
    .then((data) => {
      practiceQuestion.textContent = data.question;
      currentPracticeAnswer = data.answer;
      generatePracticeOptions();
      resetPracticeSelection();
    })
    .catch((error) => {
      console.error("Error generating practice question:", error);
      // Fallback to a simple question
      practiceQuestion.textContent = "5 + 3 = ?";
      currentPracticeAnswer = "8";
      generatePracticeOptions();
      resetPracticeSelection();
    });
}

// Function to generate practice options
function generatePracticeOptions() {
  const correctAnswer = parseInt(currentPracticeAnswer);
  const options = [];

  // Add the correct answer
  options.push(correctAnswer);

  // Generate wrong answers based on the magnitude of the correct answer
  const usedNumbers = new Set([correctAnswer]);
  const maxAttempts = 50;

  // Determine range for wrong answers based on correct answer size
  let range;
  if (correctAnswer <= 10) {
    range = 10;
  } else if (correctAnswer <= 50) {
    range = 20;
  } else if (correctAnswer <= 100) {
    range = 30;
  } else {
    range = Math.floor(correctAnswer * 0.3);
  }

  for (let i = 0; i < 15; i++) {
    let wrongAnswer;
    let attempts = 0;

    do {
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

  // Shuffle the options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // Clear previous options
  practiceOptionsContainer.innerHTML = "";

  // Create options
  const fragment = document.createDocumentFragment();

  options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.className = "math-option";
    optionElement.textContent = option;

    optionElement.addEventListener("click", function () {
      if (selectedPracticeOption) {
        selectedPracticeOption.classList.remove("selected");
      }
      selectedPracticeOption = this;
      this.classList.add("selected");
      practiceVerifyBtn.disabled = false;
    });

    fragment.appendChild(optionElement);
  });

  practiceOptionsContainer.appendChild(fragment);
}

// Function to reset practice selection
function resetPracticeSelection() {
  if (selectedPracticeOption) {
    selectedPracticeOption.classList.remove("selected", "correct", "incorrect");
  }
  selectedPracticeOption = null;
  practiceVerifyBtn.disabled = true;
  practiceNextBtn.disabled = true;
}

// Function to update practice stats
function updatePracticeStats() {
  practiceScore.textContent = practiceScoreCount;
  practiceTotal.textContent = practiceTotalCount;
}

// Enable smooth wheel and drag-to-scroll for practice options
practiceOptionsContainer.addEventListener(
  "wheel",
  function (e) {
    e.preventDefault();
    const scrollSpeed = 1.2;
    const delta = e.deltaY * scrollSpeed;
    this.scrollLeft += delta;
  },
  { passive: false }
);

let isDown = false;
let startX = 0;
let scrollLeftStart = 0;

practiceOptionsContainer.addEventListener("mousedown", (e) => {
  isDown = true;
  practiceOptionsContainer.classList.add("dragging");
  startX = e.pageX - practiceOptionsContainer.offsetLeft;
  scrollLeftStart = practiceOptionsContainer.scrollLeft;
});

practiceOptionsContainer.addEventListener("mouseleave", () => {
  isDown = false;
  practiceOptionsContainer.classList.remove("dragging");
});

practiceOptionsContainer.addEventListener("mouseup", () => {
  isDown = false;
  practiceOptionsContainer.classList.remove("dragging");
});

practiceOptionsContainer.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - practiceOptionsContainer.offsetLeft;
  const walk = (x - startX) * 1.2; // scroll factor
  practiceOptionsContainer.scrollLeft = scrollLeftStart - walk;
});

// Touch support for drag-to-scroll
let touchStartX = 0;
let touchScrollLeft = 0;

practiceOptionsContainer.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  touchStartX = touch.pageX;
  touchScrollLeft = practiceOptionsContainer.scrollLeft;
});

practiceOptionsContainer.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  const walk = (touch.pageX - touchStartX) * 1.0;
  practiceOptionsContainer.scrollLeft = touchScrollLeft - walk;
});
