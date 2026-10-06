(function () {
  const puzzles = Array.isArray(window.SEWOESTER_PUZZLES)
    ? window.SEWOESTER_PUZZLES
    : [];

  const state = window.SewoesterProgress.load();

  const welcomeView = document.getElementById("welcomeView");
  const puzzleView = document.getElementById("puzzleView");
  const emptyView = document.getElementById("emptyView");
  const startButton = document.getElementById("startButton");

  const solvedCount = document.getElementById("solvedCount");
  const totalCount = document.getElementById("totalCount");
  const attemptCount = document.getElementById("attemptCount");
  const hintCount = document.getElementById("hintCount");

  const puzzleNumber = document.getElementById("puzzleNumber");
  const puzzleDifficulty = document.getElementById("puzzleDifficulty");
  const puzzleTitle = document.getElementById("puzzleTitle");
  const puzzleSubtitle = document.getElementById("puzzleSubtitle");
  const puzzleBody = document.getElementById("puzzleBody");
  const evidenceSlot = document.getElementById("evidenceSlot");

  const answerForm = document.getElementById("answerForm");
  const answerInput = document.getElementById("answerInput");
  const answerLabel = document.getElementById("answerLabel");
  const feedback = document.getElementById("feedback");
  const hintButton = document.getElementById("hintButton");
  const hintText = document.getElementById("hintText");

  function persist() {
    window.SewoesterProgress.save(state);
  }

  function updateDashboard() {
    solvedCount.textContent = String(state.solvedIds.length);
    totalCount.textContent = String(puzzles.length);
    attemptCount.textContent = String(state.wrongAttempts);
    hintCount.textContent = String(state.hintsUsed);
  }

  function normalize(value) {
    return value
      .toLocaleLowerCase("de-DE")
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]/g, "");
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(digest))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function renderBody(lines) {
    puzzleBody.innerHTML = "";

    (lines || []).forEach(item => {
      if (item && typeof item === "object" && item.type === "code") {
        const block = document.createElement("div");
        block.className = "code-fragment";
        block.textContent = item.text || "";
        puzzleBody.appendChild(block);
        return;
      }

      const paragraph = document.createElement("p");
      paragraph.textContent = String(item);
      puzzleBody.appendChild(paragraph);
    });
  }

  function renderEvidence(puzzle) {
    evidenceSlot.innerHTML = "";

    if (!puzzle.evidenceImage) {
      evidenceSlot.classList.add("is-hidden");
      return;
    }

    const image = document.createElement("img");
    image.src = puzzle.evidenceImage;
    image.alt = puzzle.evidenceAlt || "Beweisstück";

    evidenceSlot.appendChild(image);
    evidenceSlot.classList.remove("is-hidden");
  }

  function renderPuzzle() {
    updateDashboard();

    if (!state.started) {
      welcomeView.classList.remove("is-hidden");
      puzzleView.classList.add("is-hidden");
      emptyView.classList.add("is-hidden");
      return;
    }

    welcomeView.classList.add("is-hidden");

    if (puzzles.length === 0) {
      puzzleView.classList.add("is-hidden");
      emptyView.classList.remove("is-hidden");
      return;
    }

    emptyView.classList.add("is-hidden");

    if (state.currentIndex >= puzzles.length) {
      puzzleView.classList.add("is-hidden");
      emptyView.classList.remove("is-hidden");
      emptyView.querySelector(".stamp").textContent = "ARCHIV WIEDERHERGESTELLT";
      emptyView.querySelector("h2").textContent = "Alle freigegebenen Akten wurden gelöst.";
      emptyView.querySelector("p:last-child").textContent =
        "Weitere Beweisstücke können später in Fallakte 2407 freigegeben werden.";
      return;
    }

    const puzzle = puzzles[state.currentIndex];

    puzzleNumber.textContent = "AUFGABE " + String(puzzle.id).padStart(2, "0");
    puzzleDifficulty.textContent = puzzle.difficulty || "KLASSIFIZIERT";
    puzzleTitle.textContent = puzzle.title || "Unbenannte Akte";
    puzzleSubtitle.textContent = puzzle.subtitle || "";
    answerLabel.textContent = puzzle.answerLabel || "Archivschlüssel";

    renderBody(puzzle.body);
    renderEvidence(puzzle);

    feedback.textContent = "";
    feedback.className = "feedback";
    answerInput.value = "";

    const usedLevel = state.hintLevels[puzzle.id] || 0;
    if (usedLevel > 0 && puzzle.hints && puzzle.hints[usedLevel - 1]) {
      hintText.textContent = puzzle.hints[usedLevel - 1];
    } else {
      hintText.textContent = "";
    }

    puzzleView.classList.remove("is-hidden");
    answerInput.focus();
  }

  startButton.addEventListener("click", function () {
    state.started = true;
    persist();
    renderPuzzle();
  });

  answerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const puzzle = puzzles[state.currentIndex];
    if (!puzzle) return;

    const raw = answerInput.value;
    if (!raw.trim()) return;

    const normalized = normalize(raw);
    const hash = await sha256(normalized);
    const accepted = Array.isArray(puzzle.answerHashes)
      && puzzle.answerHashes.includes(hash);

    if (!accepted) {
      state.wrongAttempts += 1;
      persist();
      updateDashboard();

      feedback.textContent = puzzle.failureText || "Schlüssel ungültig. Zugriff verweigert.";
      feedback.className = "feedback error";
      return;
    }

    if (!state.solvedIds.includes(puzzle.id)) {
      state.solvedIds.push(puzzle.id);
    }

    state.currentIndex += 1;
    persist();
    updateDashboard();

    feedback.textContent = puzzle.successText || "Zugriff gewährt. Nächste Akte freigeschaltet.";
    feedback.className = "feedback success";

    setTimeout(renderPuzzle, 850);
  });

  hintButton.addEventListener("click", function () {
    const puzzle = puzzles[state.currentIndex];
    if (!puzzle || !Array.isArray(puzzle.hints) || puzzle.hints.length === 0) {
      hintText.textContent = "Für diese Akte existiert kein freigegebener Hinweis.";
      return;
    }

    const currentLevel = state.hintLevels[puzzle.id] || 0;

    if (currentLevel >= puzzle.hints.length) {
      hintText.textContent = puzzle.hints[puzzle.hints.length - 1];
      return;
    }

    const nextLevel = currentLevel + 1;
    state.hintLevels[puzzle.id] = nextLevel;
    state.hintsUsed += 1;

    persist();
    updateDashboard();

    hintText.textContent = puzzle.hints[nextLevel - 1];
  });

  updateDashboard();
  renderPuzzle();
})();
