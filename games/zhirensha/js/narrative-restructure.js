(() => {
  "use strict";
  /*
   * 叙事优化调整
   * 第三至第五章从“流程面板”改为“中心场景 + 花瓣探索区”。
   * 原有谜题函数、ARG 线索和 localStorage 收集系统保留；本层仅重排入口、
   * 收束主线推进，并把零散背景并回角色所属的活动区域。
   */
  const page = location.pathname.split("/").pop();
  const storeKey = "zhirensha.narrative.restructure";
  const load = () => { try { return JSON.parse(localStorage.getItem(storeKey)) || {}; } catch { return {}; } };
  const save = data => localStorage.setItem(storeKey, JSON.stringify(data));
  const one = (selector, root = document) => root.querySelector(selector);
  const many = (selector, root = document) => [...root.querySelectorAll(selector)];
  function activate(id) {
    many(".panel").forEach(panel => panel.classList.toggle("active", panel.id === id));
    many(".nav [data-panel]").forEach(button => button.classList.toggle("active", button.dataset.panel === id));
  }
  function injectStyle() {
    if (one("#narrative-restructure-style")) return;
    const style = document.createElement("style");
    style.id = "narrative-restructure-style";
    style.textContent = `
      /* 叙事优化调整：取消流程化状态文本，仅保留场景本身。 */
      .narrative-hub-note{margin:14px 0;color:rgba(229,211,167,.72);font-family:KaiTi,serif;line-height:1.9}
      .narrative-relics{display:flex;gap:12px;justify-content:center;margin:18px 0}.narrative-relic{width:34px;height:52px;border:1px solid rgba(198,163,89,.38);background:rgba(7,5,6,.42);color:transparent;transition:.4s}.narrative-relic.got{border-color:#d9bc72;background:linear-gradient(135deg,#20504e,#d9bc72 50%,#4d1d20);box-shadow:0 0 14px rgba(218,188,114,.36)}
      .narrative-hidden{display:none!important}.narrative-echo{margin-top:12px;min-height:2em;color:rgba(228,213,184,.64);font-family:KaiTi,serif}.narrative-gate{border:1px solid rgba(202,164,90,.42);padding:12px 16px;background:rgba(7,4,10,.36);color:rgba(228,213,184,.68);line-height:1.9}
      .narrative-hub .nav button{font-family:KaiTi,serif}.narrative-choice{border:1px solid rgba(207,169,92,.52);background:rgba(14,7,7,.68);color:#ebd7a8;width:44px;height:44px;font-size:22px;margin:6px;cursor:pointer}.narrative-choice:hover{box-shadow:0 0 16px rgba(220,175,88,.6)}
      .narrative-season-cluster{border-top:1px solid rgba(143,201,186,.32);margin-top:18px;padding-top:10px}.narrative-season-cluster p{color:rgba(210,239,222,.62)}
      .narrative-small{font-size:11px;color:rgba(230,216,181,.18);user-select:text}.narrative-small::selection{color:#332111;background:#e2c36e}
    `;
    document.head.append(style);
  }
  function relicData() { try { return JSON.parse(localStorage.getItem("zhirensha.arg.v4")) || { relics: {} }; } catch { return { relics: {} }; } }
  function hasRelic(id) { return Boolean(relicData().relics?.[id]); }

  function chapterThree() {
    document.body.classList.add("narrative-hub");
    const nav = one(".nav");
    const names = { stone: "三生石畔", monitor: "渡口簿", corridor: "伞影回廊", yaochi: "瑶池废墟", tower: "九重塔", kunlun: "昆仑云海" };
    many("[data-panel]", nav).forEach(button => { if (names[button.dataset.panel]) button.textContent = names[button.dataset.panel]; });
    const stone = one("#stone"); if (!stone) return;
    activate("stone");
    one(".branch-box")?.classList.add("narrative-hidden");
    one("#status")?.closest(".side")?.querySelector("h3")?.classList.add("narrative-hidden");
    one("#status")?.classList.add("narrative-hidden");
    one("#argConsole")?.classList.add("narrative-hidden");
    const relics = document.createElement("div");
    relics.className = "narrative-relics";
    relics.innerHTML = "<i class='narrative-relic' data-r='hairpin'></i><i class='narrative-relic' data-r='silk'></i><i class='narrative-relic' data-r='kerchief'></i>";
    const echo = document.createElement("p"); echo.className = "narrative-echo";
    const intro = document.createElement("p"); intro.className = "narrative-hub-note";
    intro.textContent = "石上有一条不肯闭合的因缘。陆斩站在桥边，像在等一个本不该由他等的人。";
    stone.querySelector("h2")?.insertAdjacentElement("afterend", intro);
    stone.querySelector(".sansheng")?.insertAdjacentElement("afterend", relics);
    relics.insertAdjacentElement("afterend", echo);
    const narrative = load(); narrative.c3 ||= { hairpin: false, silk: false, kerchief: false }; save(narrative);
    function sync(message = "") {
      const data = load().c3;
      many(".narrative-relic", relics).forEach(item => item.classList.toggle("got", Boolean(data[item.dataset.r])));
      if (message) echo.textContent = message;
      if (data.hairpin && data.silk && data.kerchief) {
        echo.textContent = "三件旧物落在石上。石纹没有说话，只从中间裂出一线昆仑的白。";
        const scene = one("#kunlunScene"); if (scene) scene.classList.add("narrative-open");
      }
    }
    function obtain(key, message) { const data = load(); if (data.c3[key]) return; data.c3[key] = true; save(data); sync(message); }
    one("#fishHairpin")?.addEventListener("click", () => setTimeout(() => {
      const result = one("#yaochiResult")?.textContent || "";
      if (/打捞出青绡玉簪/.test(result)) obtain("hairpin", "枯井打捞出的玉簪，仍有青绡掌心的温度。");
    }, 0));
    const tower = one("#tower");
    if (tower) {
      const silk = document.createElement("button"); silk.className = "arg-hotspot"; silk.style.cssText = "right:6%;top:23%;width:20px;height:46px;border-left:1px solid #b8e0c0"; silk.title = ""; tower.style.position = "relative"; tower.append(silk);
      silk.onclick = () => obtain("silk", "第三层的青丝被风牵起，绕过指尖后自己打了一个结。");
      // 所有青绡千世情劫只在封印塔内回响，避免散落成环境噪声。
      const towerEcho = document.createElement("p"); towerEcho.className = "narrative-echo"; towerEcho.textContent = "塔壁的皮影一层层掠过：每一世，她都把别人的红线送到岸边，只有自己的留在水里。"; tower.append(towerEcho);
    }
    const workshop = one("#corridor");
    if (workshop) {
      const scarf = document.createElement("button"); scarf.className = "arg-hotspot"; scarf.style.cssText = "left:11%;bottom:15%;width:32px;height:28px;border:1px solid #8c3934"; scarf.title = ""; workshop.style.position = "relative"; workshop.append(scarf);
      scarf.onclick = () => obtain("kerchief", "同心结松开时，一方旧帕从红线中落下。帕角有极浅的灼痕，像烛火停过。" );
      const weaver = one("#weaverLine"); if (weaver) weaver.textContent = "织缘师没有问你要不要续缘。她只反复拆开一只旧结。";
    }
    const yaochi = one("section#yaochi");
    if (yaochi) {
      const cluster = document.createElement("div"); cluster.className = "narrative-season-cluster"; cluster.innerHTML = "<p>枯枝随季节换色。春日的玉兔、夏日的纸人、秋日的叶脉与冬日的冰，都只替瑶池保存同一段往事。</p><span class='narrative-small'>第七次触碰树干，西王母才承认：吾亦有情。</span>"; yaochi.append(cluster);
      let knocks = 0; yaochi.querySelector(".mountain")?.addEventListener("click", () => { if (++knocks === 7) echo.textContent = "西王母的残识从枯树后退开：吾罚青绡，亦是罚己。"; });
    }
    const originalResolve = one("#resolveKunlun");
    originalResolve?.addEventListener("click", event => {
      const data = load().c3;
      if (data.hairpin && data.silk && data.kerchief) return;
      event.stopImmediatePropagation(); event.preventDefault();
      activate("stone"); sync("石面仍完整。它不肯替缺席的记忆打开一扇门。");
    }, true);
    // 叙事优化调整：旧九层封印可以继续被探索，但不再替代青绡三件遗物开启昆仑。
    const previousOpenKunlun = window.openKunlun;
    if (typeof previousOpenKunlun === "function") {
      window.openKunlun = () => {
        const data = load().c3;
        if (data.hairpin && data.silk && data.kerchief) previousOpenKunlun();
        else { activate("stone"); sync("塔门退回雾中。石上缺的不是封印，而是她留下的三件旧物。"); }
      };
    }
    const luzhan = one("#luzhanNote");
    if (luzhan) luzhan.textContent = "陆斩：青绡留下的东西比她留下的话更多。我分不清，是她忘了，还是我不敢问。";
    sync();
  }

  function chapterFour() {
    document.body.classList.add("narrative-hub");
    const names = { gate: "归墟之门", corridor: "因果回廊", thread: "司命台", pool: "星落池", heart: "烛龙心室", tree: "观因果台" };
    many(".nav [data-panel]").forEach(button => { if (names[button.dataset.panel]) button.textContent = names[button.dataset.panel]; });
    activate("gate");
    const gate = one("#gate"), heart = one("#heart"); if (!gate || !heart) return;
    one("#openingText").textContent = "门未问来处。它只把你曾经选择过的可能，一卷卷挂在门内。";
    const keyText = document.createElement("p"); keyText.className = "narrative-gate"; keyText.textContent = "门后的台上空着两处：一处要等丝线不再互相勒紧，一处要等遗忘的结局被放回水中。";
    gate.querySelector(".door")?.insertAdjacentElement("afterend", keyText);
    const data = load(); data.c4 ||= { lines: new Set(), slips: new Set() }; data.c4.lines = [...(data.c4.lines || [])]; data.c4.slips = [...(data.c4.slips || [])]; save(data);
    const clock = () => load().c4;
    const ready = () => clock().lines.length >= 3 && clock().slips.length >= 3;
    function add(type, value) { const state = load(); if (!state.c4[type].includes(value)) state.c4[type].push(value); save(state); if (ready()) keyText.textContent = "两处空位都亮了。烛龙心室的门，没有再合上。"; }
    const thread = one("#threadCanvas");
    if (thread) thread.addEventListener("pointerup", event => { const r = thread.getBoundingClientRect(); const y = (event.clientY - r.top) / r.height; add("lines", y < .28 ? "yin" : y < .58 ? "kunlun" : "mortal"); });
    const pool = one("#poolCanvas");
    if (pool) pool.addEventListener("pointerup", event => { const r = pool.getBoundingClientRect(); const y = (event.clientY - r.top) / r.height; add("slips", y < .34 ? "old" : y < .67 ? "garden" : "free"); });
    many(".nav [data-panel='heart']").forEach(button => button.onclick = () => { if (ready()) activate("heart"); else { activate("gate"); keyText.textContent = "门环没有锁。只是你还没有带回足以让它睁眼的因与果。"; } });
    one("#heartInput")?.addEventListener("input", () => { const state = load(); state.c4.heart = true; save(state); });
    one(".eye")?.addEventListener("click", () => { const state = load(); state.c4.heart = true; save(state); });
    const previousReady = window.readyForEnding;
    if (typeof previousReady === "function") window.readyForEnding = () => ready() && Boolean(load().c4.heart);
    one("#sealOutcome")?.addEventListener("click", event => {
      event.stopImmediatePropagation();
      if (!ready()) { activate("gate"); keyText.textContent = "归墟没有给出判词。它仍在等两枚钥匙各自归位。"; return; }
      if (!load().c4.heart) {
        activate("heart");
        one("#question") && (one("#question").textContent = "烛龙：你要修复我，维持我，还是让我学会看见？");
        return;
      }
      window.setTimeout(() => one("#sealOutcome")?.onclick?.(), 0);
    }, true);
    // 多元结局的回顾只留在因果回廊；玄澈前史只留在记忆碎片。
    const corridor = one("#corridor"); if (corridor) corridor.querySelector("h2").insertAdjacentHTML("afterend", "<p class='narrative-hub-note'>卷轴不裁定哪一种结局更真。它们只证明，因果从来不是一条线。</p>");
    const heartText = one("#heartText"); if (heartText) heartText.textContent = "竖瞳安静时，比任何回答都更像一个被遗忘的旁观者。";
    const memory = one("#guixuziText"); if (memory) memory.textContent = "归墟子：我好像见过你。又好像，是你见过我。";
  }

  function chapterFive() {
    document.body.classList.add("narrative-hub");
    const main = one("#array"); if (!main) return;
    activate("array");
    const guide = one("#guiNote"); if (guide) guide.textContent = "归元子：卦分先后，顺天而行，水始火终。";
    one("#array .judge")?.replaceChildren(document.createTextNode("归元子没有再说话。太极中央留着一滴未干的朱砂。"));
    one("#arrayMsg")?.classList.add("narrative-hidden");
    one(".side h3")?.classList.add("narrative-hidden"); one("#status")?.classList.add("narrative-hidden");
    const result = load(); result.c5 ||= { entered: [], ease: 0 }; save(result);
    const panels = { 坎: "kan", 坤: "kun", 震: "zhen", 巽: "xun", 乾: "qian", 离: "li" };
    const natural = ["坎", "坤", "震", "巽", "乾", "离"];
    many(".hex").forEach(hex => {
      const gua = hex.dataset.gua;
      if (!panels[gua]) return;
      hex.onclick = () => {
        const data = load(); if (!data.c5.entered.includes(gua)) data.c5.entered.push(gua);
        const expected = natural[data.c5.entered.length - 1];
        data.c5.ease += expected === gua ? 1 : 0; save(data);
        hex.classList.add("done"); activate(panels[gua]);
        // 保留旧终局检查所需的完成记录，但不再把访问顺序当作门槛。
        if (typeof state !== "undefined" && data.c5.entered.length === 6) state.order = [...natural];
        const panel = one(`#${panels[gua]}`); if (panel) panel.dataset.flow = expected === gua ? "calm" : "rough";
      };
    });
    many(".nav [data-panel]").forEach(button => { const labels = { array:"太极图",kan:"☵",kun:"☷",zhen:"☳",xun:"☴",qian:"☰",li:"☲" }; button.textContent = labels[button.dataset.panel] || button.textContent; });
    many("#kan h2,#kun h2,#zhen h2,#xun h2,#qian h2,#li h2").forEach((heading, index) => { heading.textContent = ["坎", "坤", "震", "巽", "乾", "离"][index]; });
    const endings = one("#ending");
    one("#ignite")?.addEventListener("click", () => { if (!endings) return; endings.insertAdjacentHTML("afterend", "<div class='narrative-end-choices'><button class='narrative-choice' data-e='burn'>○</button><button class='narrative-choice' data-e='carve'>●</button><button class='narrative-choice' data-e='curve'>◒</button><button class='narrative-choice' data-e='blank'>□</button></div>"); many(".narrative-choice").forEach(choice => choice.onclick = () => { if (typeof state === "undefined") return; const option = choice.dataset.e; if (option === "burn") { state.kan = "舍"; state.qian = "B"; } if (option === "carve") { state.kan = "救"; state.qian = "A"; state.zhen = 9; } if (option === "curve") state.qian = "C"; if (option === "blank") { state.qian = "D"; state.taiji = true; } one("#endingBtn")?.click(); }); }, { once: true });
    const lifeMirror = document.createElement("span"); lifeMirror.className = "narrative-small"; lifeMirror.textContent = "镜中不是归元子的脸。"; one("#array .taiji")?.append(lifeMirror);
    one("#drawCanvas")?.addEventListener("pointerenter", () => one("#drawCanvas").title = "待后来者题");
  }

  function init() {
    injectStyle();
    if (page === "chapter3-forgotten-river.html") chapterThree();
    if (page === "chapter4-guixu-zhulong.html") chapterFour();
    if (page === "chapter5-bagua-guiyuan.html") chapterFive();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
