(function () {
  const STORAGE_KEY = "sewoesterArchiveV2Progress";

  const defaults = {
    accessGranted: false,
    currentIndex: 0,
    solvedIds: [],
    wrongAttempts: 0,
    hintsUsed: 0,
    hintLevels: {}
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaults };

      const parsed = JSON.parse(raw);
      return {
        ...defaults,
        ...parsed,
        solvedIds: Array.isArray(parsed.solvedIds) ? parsed.solvedIds : [],
        hintLevels: parsed.hintLevels && typeof parsed.hintLevels === "object"
          ? parsed.hintLevels
          : {}
      };
    } catch (error) {
      console.warn("Archivfortschritt konnte nicht geladen werden.", error);
      return { ...defaults };
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  window.SewoesterProgress = {
    load,
    save,
    reset
  };
})();
