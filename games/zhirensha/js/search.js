(() => {
  "use strict";

  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q") || "";
  const display = document.getElementById("results-display");
  const searchContainer = document.querySelector(".search-results-container");
  const title = document.querySelector(".search-results-container h2");
  const footerDate = document.querySelector(".custom-date");
  const container = document.getElementById("container");

  const normalResults = [
    {
      keywords: ["合婚帖", "婚帖", "八字", "戊午"],
      title: "旧物档案 A-031：合婚帖残页",
      url: "secret/wedding-note.html"
    },
    {
      keywords: ["苏婉", "亡妻", "生辰"],
      title: "私人札记：苏婉病后七日",
      url: "secret/suwan-diary.html"
    },
    {
      keywords: ["陈五行", "失踪", "邮件"],
      title: "站务记录：定时邮件配置",
      url: "secret/mail-log.html"
    },
    {
      keywords: ["中元节", "癸卯", "七月十五", "子时"],
      title: "旧历摘录：癸卯年七月十五",
      url: "secret/calendar-note.html"
    },
    {
      keywords: ["罗盘", "五行", "相生"],
      title: "器物照片：裂纹罗盘",
      url: "secret/compass-note.html"
    },
    {
      keywords: ["旧站", "快照", "时光塔", "网址", "wuxingfslog"],
      title: "外部服务：网络时光塔中的旧站快照",
      url: "timetower.html"
    }
  ];

  const forbiddenResults = [
    {
      keywords: ["纸人新娘", "还魂", "禁术", "纸人世界", "魂魄反噬", "红妆"],
      hidden: true,
      text: "选中这行黑字：不要直接查纸人。先读“风水旧稿”，再查“合婚帖”，最后回到“关于”页最后的空白处。",
      progress: "ex/36"
    },
    {
      keywords: ["死门", "坤", "5791", "五七九一", "戊午壬子"],
      hidden: false,
      text: "死门在坤。问新娘八字。取日时两柱：戊午壬子，数五七九一。",
      progress: "ex/36"
    }
  ];

  function normalize(value) {
    return value.trim().toLowerCase().replace(/\s+/g, "");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function matches(entry, normalizedQuery) {
    return entry.keywords.some(key => {
      const normalizedKey = normalize(key);
      return normalizedKey.includes(normalizedQuery) || normalizedQuery.includes(normalizedKey);
    });
  }

  function renderForbidden(config, raw) {
    document.body.classList.add("body-forbidden");
    container.classList.add("container-forbidden");
    searchContainer.classList.add("search-container-forbidden");
    title.textContent = "此文件已被禁止访问";
    footerDate.textContent = config.progress;

    const textClass = config.hidden ? "hidden-text" : "visible-text";
    display.innerHTML = `
      <p>关键字“<b>${escapeHtml(raw)}</b>”命中旧站封禁表。</p>
      <div class="hidden-text-container">
        <span class="${textClass}">${config.text}</span>
      </div>
    `;
  }

  function renderNormal(results, raw) {
    document.body.classList.remove("body-forbidden");
    container.classList.remove("container-forbidden");
    searchContainer.classList.remove("search-container-forbidden");
    title.textContent = "搜索结果";
    footerDate.textContent = "05/36";

    if (!results.length) {
      display.innerHTML = `<p>抱歉，没有找到与"<b>${escapeHtml(raw)}</b>"相关的结果。</p>`;
      return;
    }

    if (results.some(result => result.url === "secret/wedding-note.html")) {
      localStorage.setItem("wuxing.arg.weddingSearched", "1");
    }
    if (results.some(result => result.url === "timetower.html")) {
      localStorage.setItem("wuxing.arg.snapshotViewed", "1");
    }

    display.innerHTML = `
      <p>共有 <b>${results.length}</b> 项符合条件的结果：</p>
      ${results.map(result => `<a href="${result.url}">${result.title}</a>`).join("")}
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!query.trim()) {
      title.textContent = "搜索结果";
      footerDate.textContent = "-";
      display.innerHTML = "<p>请输入搜索关键字。</p>";
      return;
    }

    const normalizedQuery = normalize(query);
    const forbidden = forbiddenResults.find(entry => matches(entry, normalizedQuery));
    if (forbidden) {
      renderForbidden(forbidden, query);
      return;
    }

    renderNormal(normalResults.filter(entry => matches(entry, normalizedQuery)), query);
  });
})();
