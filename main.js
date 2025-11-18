import confetti from "canvas-confetti";
import { questions } from "./questions.js";
import { renderQuestion, updateScore, showFinal } from "./ui.js";

const els = {
  questionTextEl: document.getElementById("questionText"),
  choicesEl: document.getElementById("choices"),
  feedbackEl: document.getElementById("feedback"),
  nextBtnEl: document.getElementById("nextBtn"),
  scoreEl: document.getElementById("score"),
  progressBarEl: document.getElementById("progressBar"),
  progressTextEl: document.getElementById("progressText"),
  quizSectionEl: document.getElementById("quiz"),
  resultSectionEl: document.getElementById("result"),
  finalSummaryEl: document.getElementById("finalSummary"),
  breakdownEl: document.getElementById("breakdown"),
  restartBtnEl: document.getElementById("restartBtn"),
};

let state = {
  index: 0,
  score: 0,
  answers: [],
  order: shuffle([...Array(questions.length).keys()]),
};

const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

// Initialize
start();

function start() {
  state.index = 0;
  state.score = 0;
  state.answers = [];
  state.order = shuffle([...Array(questions.length).keys()]);

  els.resultSectionEl.classList.add("hidden");
  els.quizSectionEl.classList.remove("hidden");

  updateScore(els.scoreEl, state.score);
  renderCurrent();

  els.nextBtnEl.onclick = onNext;
  els.restartBtnEl.onclick = start;
}

function renderCurrent() {
  const q = questions[state.order[state.index]];
  renderQuestion(
    {
      questionTextEl: els.questionTextEl,
      choicesEl: els.choicesEl,
      feedbackEl: els.feedbackEl,
      nextBtnEl: els.nextBtnEl,
      progressBarEl: els.progressBarEl,
      progressTextEl: els.progressTextEl,
    },
    q,
    state.index,
    questions.length
  );

  // After user selects, next button should compute score
  els.nextBtnEl.dataset.ready = "true";
  els.nextBtnEl.disabled = true;
}

function onNext() {
  const q = questions[state.order[state.index]];
  const selectedIndex = getSelectedIndex(els.choicesEl);
  if (selectedIndex == null) return;

  const correct = selectedIndex === q.correctIndex;

  // Score update
  if (correct) {
    state.score += q.points;
    fireConfetti();
  }
  updateScore(els.scoreEl, state.score);

  // Save answer summary
  state.answers.push({ prompt: q.prompt, correct });

  // Next question or finish
  if (state.index < questions.length - 1) {
    state.index += 1;
    renderCurrent();
  } else {
    showFinal(
      {
        resultSectionEl: els.resultSectionEl,
        quizSectionEl: els.quizSectionEl,
        finalSummaryEl: els.finalSummaryEl,
        breakdownEl: els.breakdownEl,
      },
      state.score,
      totalPoints,
      state.answers
    );
    fireFinalConfetti();
  }
}

function getSelectedIndex(choicesEl) {
  const items = Array.from(choicesEl.children);
  const sel = items.findIndex((el) => el.classList.contains("selected"));
  return sel >= 0 ? sel : null;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function fireConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 45,
    origin: { y: 0.8 },
    colors: ["#0a7a57", "#f0b429", "#1f9d55", "#2c7a7b"],
    scalar: 0.9
  });
}

function fireFinalConfetti() {
  confetti({
    particleCount: 160,
    spread: 80,
    startVelocity: 55,
    origin: { y: 0.6 },
    colors: ["#0a7a57", "#f0b429", "#1f9d55", "#2c7a7b"],
    scalar: 1.1
  });
}