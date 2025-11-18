export function renderQuestion(containerEls, q, index, total) {
  const { questionTextEl, choicesEl, feedbackEl, nextBtnEl, progressBarEl, progressTextEl } = containerEls;

  // Reset UI
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtnEl.disabled = true;
  choicesEl.innerHTML = "";

  // Progress
  const pct = Math.round(((index + 1) / total) * 100);
  progressBarEl.style.width = pct + "%";
  progressTextEl.textContent = `Pregunta ${index + 1} / ${total}`;

  // Question text
  questionTextEl.textContent = q.prompt;

  // Render choices
  q.choices.forEach((choice, i) => {
    const li = document.createElement("li");
    li.className = "choice";
    li.textContent = choice;
    li.dataset.index = String(i);
    li.addEventListener("click", () => {
      handleChoiceSelection(containerEls, q, i);
    });
    choicesEl.appendChild(li);
  });
}

function handleChoiceSelection(containerEls, q, selectedIndex) {
  const { choicesEl, feedbackEl, nextBtnEl } = containerEls;

  // Prevent multiple selection
  Array.from(choicesEl.children).forEach((el) => el.replaceWith(el.cloneNode(true)));

  const children = Array.from(choicesEl.children);
  children.forEach((el) => {
    el.classList.remove("selected", "correct", "incorrect");
  });

  const selectedEl = children[selectedIndex];
  const correctEl = children[q.correctIndex];

  selectedEl.classList.add("selected");
  if (selectedIndex === q.correctIndex) {
    selectedEl.classList.add("correct");
    feedbackEl.textContent = `¡Correcto! ${q.explanation}`;
    feedbackEl.classList.add("ok");
  } else {
    selectedEl.classList.add("incorrect");
    correctEl.classList.add("correct");
    feedbackEl.textContent = `Revisa: ${q.explanation}`;
    feedbackEl.classList.add("bad");
  }

  nextBtnEl.disabled = false;
}

export function updateScore(scoreEl, score) {
  scoreEl.textContent = String(score);
}

export function showFinal(resultEls, score, totalPoints, answers) {
  const { resultSectionEl, quizSectionEl, finalSummaryEl, breakdownEl } = resultEls;

  quizSectionEl.classList.add("hidden");
  resultSectionEl.classList.remove("hidden");

  const pct = Math.round((score / totalPoints) * 100);

  let evalText = "";
  if (pct >= 90) evalText = "Excelente dominio del Passive Voice.";
  else if (pct >= 75) evalText = "Buen desempeño, sigue puliendo detalles.";
  else if (pct >= 60) evalText = "Aceptable, te recomendamos repasar estructuras clave.";
  else evalText = "Necesitas práctica adicional en Passive Voice.";

  finalSummaryEl.textContent = `Puntaje: ${score} / ${totalPoints} (${pct}%). ${evalText}`;

  breakdownEl.innerHTML = answers
    .map((a, i) => {
      const icon = a.correct ? "✅" : "❌";
      return `${icon} ${i + 1}. ${a.prompt}`;
    })
    .join("\n");
}