(() => {
  "use strict";

  const breakPoint = 900;
  const menubar = document.getElementById("menubar");
  const menubarHdr = document.getElementById("menubar_hdr");

  function handleResize() {
    if (window.innerWidth < breakPoint) {
      document.body.classList.remove("large-screen");
      document.body.classList.add("small-screen");
      if (menubarHdr) menubarHdr.style.display = "block";
      if (menubar && menubarHdr && !menubarHdr.classList.contains("ham")) {
        menubar.style.display = "none";
      }
    } else {
      document.body.classList.remove("small-screen", "noscroll");
      document.body.classList.add("large-screen");
      if (menubarHdr) {
        menubarHdr.classList.remove("ham");
        menubarHdr.setAttribute("aria-expanded", "false");
        menubarHdr.style.display = "none";
      }
      if (menubar) menubar.style.display = "block";
    }
  }

  function initMenu() {
    if (!menubarHdr || !menubar) return;
    menubarHdr.addEventListener("click", () => {
      menubarHdr.classList.toggle("ham");
      const open = menubarHdr.classList.contains("ham");
      menubarHdr.setAttribute("aria-expanded", String(open));
      menubar.style.display = open ? "block" : "none";
      document.body.classList.toggle("noscroll", open && window.innerWidth < breakPoint);
    });
  }

  function initSlides() {
    document.querySelectorAll(".slide5-parts").forEach(slider => {
      const slides = Array.from(slider.querySelectorAll(".slide-parts"));
      const indicators = slider.querySelector(".slide-indicators-parts");
      if (!slides.length || !indicators) return;

      let current = 0;
      let animating = false;

      slides.forEach(slide => slide.classList.add("hidden"));
      slides[0].classList.add("active", "initial");
      slides[0].classList.remove("hidden");

      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "indicator";
        dot.dataset.index = String(index);
        dot.setAttribute("aria-label", `查看第 ${index + 1} 张旧站照片`);
        indicators.appendChild(dot);
      });

      const dots = Array.from(indicators.querySelectorAll(".indicator"));
      dots[0].classList.add("active");
      dots[0].setAttribute("aria-current", "true");

      setTimeout(() => slides[0].classList.remove("initial"), 50);

      function change(next) {
        if (animating || next === current) return;
        animating = true;
        slides[current].classList.remove("active");
        slides[current].classList.add("left");
        slides[next].classList.remove("hidden");
        slides[next].classList.add("active");
        dots[current].classList.remove("active");
        dots[current].removeAttribute("aria-current");
        dots[next].classList.add("active");
        dots[next].setAttribute("aria-current", "true");

        setTimeout(() => {
          slides[current].classList.remove("left");
          slides[current].classList.add("hidden");
          current = next;
          animating = false;
        }, 700);
      }

      dots.forEach(dot => {
        dot.addEventListener("click", () => change(Number(dot.dataset.index)));
      });

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let timer = null;
      function stopAutoPlay() { if (timer) { clearInterval(timer); timer = null; } }
      function startAutoPlay() { if (!reduceMotion && !timer) timer = setInterval(() => change((current + 1) % slides.length), 5200); }
      slider.addEventListener("pointerenter", stopAutoPlay);
      slider.addEventListener("pointerleave", startAutoPlay);
      slider.addEventListener("focusin", stopAutoPlay);
      slider.addEventListener("focusout", startAutoPlay);
      startAutoPlay();
    });
  }

  function replaceDirectClueStrip() {
    const strip = document.querySelector(".clue-strip");
    if (!strip) return;
    const note = document.createElement("aside");
    note.className = "marginalia recovered-note";
    note.innerHTML = "<h3>陈五行手抄补记</h3><p>合婚帖不是背景资料。柜门只认新娘最后留下的两段生辰，次序若被人颠倒，连施术者也会被困在纸里。</p><p>罗盘转动时，不要逆着它的气走。坤位已经写在柜门内侧，余下的事要等符纸自己开口。</p>";
    strip.replaceWith(note);
  }

  function renderRecoveryConsole() {
    const consoleEl = document.getElementById("recoveryConsole");
    if (!consoleEl) return;

    const signals = {
      draft: localStorage.getItem("wuxing.readDraft") === "1",
      wedding: localStorage.getItem("wuxing.arg.weddingSearched") === "1",
      snapshot: localStorage.getItem("wuxing.arg.snapshotViewed") === "1",
      blank: localStorage.getItem("wuxing.arg.aboutViewed") === "1"
    };
    const labels = {
      draft: signals.draft ? "已读入" : "未核验",
      wedding: signals.wedding ? "已命中" : "未检索",
      snapshot: signals.snapshot ? "已调阅" : "待比对",
      blank: signals.blank ? "已回访" : "数据缺失"
    };
    const resolved = Object.values(signals).filter(Boolean).length;
    consoleEl.dataset.resolved = String(resolved);
    Object.entries(labels).forEach(([key, label]) => {
      const state = consoleEl.querySelector(`[data-recovery-state="${key}"]`);
      if (state) state.textContent = label;
    });

    const integrity = document.getElementById("recoveryIntegrity");
    const crc = document.getElementById("recoveryCrc");
    const whisper = document.getElementById("recoveryWhisper");
    if (integrity) integrity.textContent = `${resolved}/4 份异常记录已回响`;
    if (crc) crc.textContent = ["A9-17-00", "A9-17-02", "A9-31-02", "C0-31-02", "C0-31-57"][resolved];
    if (whisper) {
      whisper.textContent = resolved === 0
        ? "有一条索引正在等待被重新命名。"
        : resolved < 4
          ? "恢复记录正在改写下一份记录的状态。"
          : "所有痕迹均已回响，仍有一页没有出现在目录中。";
    }
  }

  function chapterProgress() {
    return [
      true,
      localStorage.getItem("wuxing.chapter1Cleared") === "1" || localStorage.getItem("wuxing.chapter1Verified") === "1",
      Boolean(localStorage.getItem("wuxing.chapter2Outcome")),
      Boolean(localStorage.getItem("wuxing.chapter3Outcome")),
      Boolean(localStorage.getItem("wuxing.chapter4Outcome"))
    ];
  }

  function gateChapterCatalog() {
    const catalog = document.querySelector(".chapter-grid");
    if (!catalog) return;
    const progress = chapterProgress();
    Array.from(catalog.querySelectorAll(".chapter-card")).forEach(card => {
      const chapter = Number(card.dataset.chapter);
      if (chapter && progress[chapter - 1]) return;
      card.classList.add("locked");
      card.removeAttribute("href");
      card.setAttribute("aria-disabled", "true");
      card.setAttribute("tabindex", "-1");
      const status = card.querySelector("small");
      if (status) status.textContent = "卷宗封存：前案尚未结案";
    });
  }

  function guardLockedChapter() {
    const path = location.pathname.replace(/\\/g, "/");
    const chapterIndex = path.includes("chapter2-") ? 1 : path.includes("chapter3-") ? 2 : path.includes("chapter4-") ? 3 : path.includes("chapter5-") ? 4 : 0;
    if (!chapterIndex || chapterProgress()[chapterIndex]) return;
    const seal = document.createElement("section");
    seal.className = "chapter-seal";
    seal.innerHTML = `<div><span>封</span><h1>本卷尚未启封</h1><p>前一案的判词还没有抵达这里。回到旧站继续调查，章节会在结案后自行显形。</p><a href="index.html">返回旧站</a></div>`;
    document.body.appendChild(seal);
  }

  window.showMaintenanceAlert = function showMaintenanceAlert() {
    alert("该栏目维护中。旧站提示：请使用站内检索。");
  };

  window.addEventListener("resize", handleResize);
  document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initSlides();
    replaceDirectClueStrip();
    renderRecoveryConsole();
    gateChapterCatalog();
    guardLockedChapter();
    handleResize();
  });
})();
