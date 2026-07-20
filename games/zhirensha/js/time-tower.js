(() => {
  "use strict";

  localStorage.setItem("wuxing.arg.snapshotViewed", "1");

  const recordsPerPage = 10;
  const searchBtn = document.getElementById("chronoscape-search-btn");
  const wrapper = document.getElementById("results-wrapper");
  const visitedPagesList = document.getElementById("visitedPagesList");
  const pagination = document.getElementById("pagination");

  const snapshots = [
    { title: "wuxingfslog.net_20230830", url: "snapshots/wuxingfslog_20230830.html" },
    { title: "wuxingfslog.net_20230929", url: "snapshots/wuxingfslog_20230929.html" },
    { title: "wuxingfslog.net_20231031", url: "snapshots/wuxingfslog_20231031.html" }
  ];

  function getVisitedLinks() {
    try {
      return JSON.parse(localStorage.getItem("visitedLinks") || "[]");
    } catch {
      return [];
    }
  }

  function saveVisit(link) {
    const links = getVisitedLinks();
    if (!links.some(item => item.url === link.url)) {
      links.unshift(link);
      localStorage.setItem("visitedLinks", JSON.stringify(links));
    }
  }

  function renderRecords(page = 1) {
    const links = getVisitedLinks();
    const totalPages = Math.max(1, Math.ceil(links.length / recordsPerPage));
    const current = Math.min(page, totalPages);
    const start = (current - 1) * recordsPerPage;
    const shown = links.slice(start, start + recordsPerPage);

    visitedPagesList.innerHTML = shown.length
      ? shown.map(link => `<li><a href="${link.url}">${link.title || link.url}</a></li>`).join("")
      : "<li>暂无访问记录</li>";

    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(i);
      button.classList.toggle("active", i === current);
      button.addEventListener("click", () => renderRecords(i));
      pagination.appendChild(button);
    }
  }

  function renderSnapshots() {
    wrapper.className = "results-wrapper results-bordered";
    wrapper.innerHTML = `
      <p class="chronoscape-results-summary">
        共找到 <a href="javascript:void(0)">3</a> 条 来自
        <a href="javascript:void(0)">2023年8月30日</a> 至
        <a href="javascript:void(0)">2023年10月31日</a> 的网页存档
      </p>
      <ul class="chronoscape-results-list">
        ${snapshots.map(item => `<li class="chronoscape-results-item"><a href="${item.url}" class="chronoscape-results-link">${item.title}</a></li>`).join("")}
      </ul>
    `;

    wrapper.querySelectorAll("a[href$='.html']").forEach(anchor => {
      anchor.addEventListener("click", () => saveVisit({ title: anchor.textContent, url: anchor.getAttribute("href") }));
    });
  }

  searchBtn.addEventListener("click", () => {
    wrapper.className = "results-wrapper results-gradient-bg";
    wrapper.innerHTML = `
      <p class="chronoscape-results-summary" style="font-size:18px;">
        正在查询，请稍等
        <span class="loading-dots"><span></span><span></span><span></span></span>
      </p>
    `;
    setTimeout(renderSnapshots, 2000);
  });

  document.addEventListener("DOMContentLoaded", () => renderRecords(Number(localStorage.getItem("currentPage")) || 1));
})();
