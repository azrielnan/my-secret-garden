(() => {
  "use strict";

  const grid = document.getElementById("gameGrid");
  const count = document.getElementById("catalogCount");
  const error = document.getElementById("catalogError");

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  async function loadCatalog() {
    try {
      const response = await fetch("games.json", { cache: "no-store" });
      if (!response.ok) throw new Error("catalog unavailable");
      const catalog = await response.json();
      const games = Array.isArray(catalog.games) ? catalog.games : [];
      grid.innerHTML = games.map(game => `<a class="game-card" href="${escapeHtml(game.entry)}"><img src="${escapeHtml(game.cover)}" alt="${escapeHtml(game.coverAlt)}"><span class="game-card-copy"><small>${escapeHtml(game.caseId)}</small><h3>${escapeHtml(game.title)}</h3><p>${escapeHtml(game.summary)}</p></span></a>`).join("");
      count.textContent = `${games.length.toString().padStart(2, "0")} EVENT(S) AVAILABLE`;
    } catch {
      count.textContent = "CATALOG OFFLINE";
      error.hidden = false;
    }
  }

  loadCatalog();
})();
