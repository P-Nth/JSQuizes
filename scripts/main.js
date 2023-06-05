// Array of quiz questions and answers
const quizData = [
  {
    question: "What is the correct syntax for referring to an external script called 'script.js'?",
    options: [
      "<script src='script.js'></script>",
      "<script href='script.js'></script>",
      "<script ref='script.js'></script>",
      "<script name='script.js'></script>"
    ],
    correctAnswer: 0
  },
  {
    question: "Which of the following is NOT a valid JavaScript variable name?",
    options: [
      "_myVariable",
      "123variable",
      "my-variable",
      "$variable"
    ],
    correctAnswer: 1
  },
  {
    question: "What is the output of the following code?\n\nconsole.log(typeof null);",
    options: [
      "undefined",
      "null",
      "object",
      "string"
    ],
    correctAnswer: 2
  },
  {
    question: "Which method is used to remove the last element from an array and returns that element?",
    options: [
      "pop()",
      "push()",
      "shift()",
      "unshift()"
    ],
    correctAnswer: 0
  },
];

let score = 0; // Tracks the user's score
let currentQuestion = 0; // Tracks the current question index
let skippedQuestions = []; // Array to store skipped questions
let userAnswers = new Array(quizData.length).fill(-1);

const resetBtn = document.getElementById("reset");
const scoreElement = document.getElementById("score");
const optionsList = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");
const skipButton = document.getElementById("skip-btn");
const questionElement = document.getElementById("question");
const quizContainer = document.getElementById("quizes-content");
const startOverButton = document.getElementById("start-over-btn");
const optionElements = optionsList.getElementsByClassName("option");
const resultContainer = document.getElementById("result-container");
const skippedQuizElement = document.getElementById("skipped-quizes");
const answeredQuestions = document.getElementById("answered-questions");
const correctAnswersElement = document.getElementById("correct-answers");
const skippedQuestionsElement = document.getElementById("skipped-questions");
const incorrectAnswersElement = document.getElementById("incorrect-answers");

// Display the current question and options
function displayQuestion() {
  const currentQuizData = quizData[currentQuestion];
  questionElement.textContent = currentQuizData.question;

  for (let i = 0; i < optionElements.length; i++) {
    optionElements[i].textContent = currentQuizData.options[i];
    optionElements[i].classList.remove("selected");

    // Check if the option was previously selected
    if (userAnswers[currentQuestion] === i) {
      optionElements[i].classList.add("selected");
    }
  }

  if (currentQuestion === 0) {
    prevButton.classList.add("hidden");
  } else {
    prevButton.classList.remove("hidden");
  }

  // Disable skip button if the current question has been answered
  if (userAnswers[currentQuestion] !== -1 || skippedQuestions.includes(currentQuestion)) {
    skipButton.setAttribute("disabled", true);
  } else {
    skipButton.removeAttribute("disabled");
  }
}

// Check the user's answer and update the score
function checkAnswer(selectedOption) {
  const currentQuizData = quizData[currentQuestion];
  if (selectedOption === currentQuizData.correctAnswer) {
    score++;
  }
}

// Handle option click
function handleOptionClick(e) {
  const selectedOption = Array.from(optionElements).indexOf(e.target);

  // Remove the "selected" class from all options
  for (let i = 0; i < optionElements.length; i++) {
    optionElements[i].classList.remove("selected");
  }

  // Add the "selected" class to the clicked option
  optionElements[selectedOption].classList.add("selected");

  checkAnswer(selectedOption);
  disableOptions(); // Disable options after selection
  nextButton.removeAttribute("disabled"); // Enable next button
  skipButton.setAttribute("disabled", true); // Disable skip button after answering
  userAnswers[currentQuestion] = selectedOption;
}

// Handle skip button click
function handleSkipClick() {
  // Un-select the currently selected answer
  const selectedOption = userAnswers[currentQuestion];
  if (selectedOption !== -1) {
    optionElements[selectedOption].classList.remove("selected");
  }

  // Move the question to skipped questions
  skippedQuestions.push(currentQuestion);

  // Reset the user's answer for the current question
  userAnswers[currentQuestion] = -1;

  nextQuestion();
}

// Disable options after selection
function disableOptions() {
  for (let i = 0; i < optionElements.length; i++) {
    optionElements[i].setAttribute("disabled", true);
  }
}

// Move to the next question or finish the quiz
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion === quizData.length - 1) {
    nextButton.innerHTML = "Finish";
  }

  if (currentQuestion < quizData.length) {
    displayQuestion();
    enableOptions(); // Enable options for the new question
    nextButton.setAttribute("disabled", true); // Disable next button
    skipButton.removeAttribute("disabled"); // Enable skip button

    // Remove the "selected" class from all options
    for (let i = 0; i < optionElements.length; i++) {
      optionElements[i].classList.remove("selected");
    }
  } else {
    finishQuiz();
  }
}

// Handle previous button click
function prevQuestion() {
  currentQuestion !== 0 && currentQuestion--;
  displayQuestion();
  enableOptions();
  nextButton.removeAttribute("disabled");
  nextButton.innerHTML = "Next";
}

// Enable options for the new question
function enableOptions() {
  for (let i = 0; i < optionElements.length; i++) {
    optionElements[i].removeAttribute("disabled");
  }
}

// Finish the quiz and display the results
function finishQuiz() {
  const totalQuestions = quizData.length;
  const percentageScore = (score / totalQuestions) * 100;

  quizContainer.classList.add("hidden");
  startOverButton.classList.remove("hidden");
  resultContainer.classList.remove("hidden");
  answeredQuestions.classList.remove("hidden");
  skippedQuestionsElement.classList.remove("hidden");
  
  scoreElement.innerHTML = `<p>You scored ${score}/${totalQuestions}. (${percentageScore}%)</p>`;

  skippedQuizElement.innerHTML = "";
  correctAnswersElement.innerHTML = "<h3>Correct Answers:</h3>";
  incorrectAnswersElement.innerHTML = "<h3>Incorrect Answers:</h3>";

  for (let i = 0; i < quizData.length; i++) {
    const currentQuizData = quizData[i];

    if (skippedQuestions.includes(i)) {
      const questionDiv = document.createElement("div");
      questionDiv.innerHTML = `<p>${currentQuizData.question}</p><p>Correct Answer: ${currentQuizData.options[currentQuizData.correctAnswer]}</p>`;
      skippedQuizElement.appendChild(questionDiv);
    } else if (i === currentQuizData.correctAnswer) { // Compare with 'i' instead of 'userAnswers[i]'
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `<p>${currentQuizData.question}</p><p>Your Answer: ${currentQuizData.options[userAnswers[i]]}</p>`;
        correctAnswersElement.appendChild(questionDiv);
    } else {
      const questionDiv = document.createElement("div");
      questionDiv.innerHTML = `<p>${currentQuizData.question}</p><p>Your Answer: ${currentQuizData.options[userAnswers[i]]}</p><p>Correct Answer: ${currentQuizData.options[currentQuizData.correctAnswer]}</p>`;
      incorrectAnswersElement.appendChild(questionDiv);
    }
  }
}

// Reset the quiz and start over
function startOver() {
  score = 0;
  currentQuestion = 0;
  skippedQuestions = [];
  userAnswers = new Array(quizData.length).fill(-1);

  nextButton.innerHTML = "Next";
  nextButton.setAttribute("disabled", true);

  scoreElement.textContent = "";
  skippedQuizElement.innerHTML = "";
  correctAnswersElement.innerHTML = "";
  incorrectAnswersElement.innerHTML = "";

  prevButton.classList.add("hidden");
  resultContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  answeredQuestions.classList.add("hidden");
  skippedQuestionsElement.classList.add("hidden");


  skipButton.removeAttribute("disabled");

  enableOptions();

  displayQuestion();
}

// Attach event listeners
for (let i = 0; i < optionElements.length; i++) {
  optionElements[i].addEventListener("click", handleOptionClick);
}

resetBtn.addEventListener("click", startOver);
nextButton.addEventListener("click", nextQuestion);
prevButton.addEventListener("click", prevQuestion); 
skipButton.addEventListener("click", handleSkipClick);
startOverButton.addEventListener("click", startOver);

// Start the quiz
displayQuestion();
