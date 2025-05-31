// script.js

let quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
let currentQuiz = null;
let currentUser = null;

function showHomePage() {
  document.getElementById("main-content").innerHTML = `
    <h2>Welcome to the Online Quiz Maker!</h2>
    <p>Create and take quizzes easily.</p>
  `;
}

function showQuizCreation() {
  document.getElementById("main-content").innerHTML = `
    <h2>Create Quiz</h2>
    <form id="quiz-form">
      <input type="text" id="quiz-title" placeholder="Quiz Title" required><br><br>
      <div id="questions"></div>
      <button type="button" onclick="addQuestion()">Add Question</button><br><br>
      <button type="submit">Save Quiz</button>
    </form>
  `;

  document.getElementById("quiz-form").onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById("quiz-title").value;
    const questions = [...document.querySelectorAll(".question-block")].map(block => {
      return {
        question: block.querySelector(".question").value,
        options: [...block.querySelectorAll(".option")].map(o => o.value),
        answer: parseInt(block.querySelector(".answer").value)
      };
    });

    quizzes.push({ title, questions });
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
    alert("Quiz saved!");
    showHomePage();
  };
  addQuestion();
}

function addQuestion() {
  const container = document.createElement("div");
  container.classList.add("question-block");
  container.innerHTML = `
    <input type="text" class="question" placeholder="Question" required><br>
    <input type="text" class="option" placeholder="Option 1" required><br>
    <input type="text" class="option" placeholder="Option 2" required><br>
    <input type="text" class="option" placeholder="Option 3" required><br>
    <input type="text" class="option" placeholder="Option 4" required><br>
    <input type="number" class="answer" placeholder="Correct Option (1-4)" min="1" max="4" required><br><br>
  `;
  document.getElementById("questions").appendChild(container);
}

function showQuizList() {
  let html = `<h2>Available Quizzes</h2><ul>`;
  quizzes.forEach((quiz, index) => {
    html += `<li><button onclick="startQuiz(${index})">${quiz.title}</button></li>`;
  });
  html += `</ul>`;
  document.getElementById("main-content").innerHTML = html;
}

function startQuiz(index) {
  currentQuiz = quizzes[index];
  currentQuiz.index = 0;
  currentQuiz.score = 0;
  showQuestion();
}

function showQuestion() {
  const q = currentQuiz.questions[currentQuiz.index];
  let html = `<h2>${currentQuiz.title}</h2><h3>Question ${currentQuiz.index + 1}</h3><p>${q.question}</p>`;
  q.options.forEach((opt, i) => {
    html += `<button onclick="submitAnswer(${i + 1})">${opt}</button><br>`;
  });
  document.getElementById("main-content").innerHTML = html;
}

function submitAnswer(selected) {
  const q = currentQuiz.questions[currentQuiz.index];
  if (selected === q.answer) currentQuiz.score++;
  currentQuiz.index++;

  if (currentQuiz.index >= currentQuiz.questions.length) {
    showResults();
  } else {
    showQuestion();
  }
}

function showResults() {
  let html = `<h2>Quiz Results</h2>
    <p>Score: ${currentQuiz.score} / ${currentQuiz.questions.length}</p>
    <h3>Correct Answers:</h3>
    <ul>`;
  currentQuiz.questions.forEach((q, i) => {
    html += `<li>${i + 1}: ${q.options[q.answer - 1]}</li>`;
  });
  html += `</ul>`;
  document.getElementById("main-content").innerHTML = html;
}

function showLogin() {
  document.getElementById("main-content").innerHTML = `
    <h2>Login</h2>
    <form onsubmit="handleLogin(event)">
      <input type="text" id="login-username" placeholder="Username" required><br>
      <input type="password" id="login-password" placeholder="Password" required><br>
      <button type="submit">Login</button>
    </form>
  `;
}

function handleLogin(e) {
  e.preventDefault();
  currentUser = document.getElementById("login-username").value;
  alert(`Logged in as ${currentUser}`);
  showHomePage();
}

function showRegister() {
  document.getElementById("main-content").innerHTML = `
    <h2>Register</h2>
    <form onsubmit="handleRegister(event)">
      <input type="text" id="register-username" placeholder="Username" required><br>
      <input type="password" id="register-password" placeholder="Password" required><br>
      <button type="submit">Register</button>
    </form>
  `;
}

function handleRegister(e) {
  e.preventDefault();
  alert("Registration successful!");
  showLogin();
}

window.onload = showHomePage;
