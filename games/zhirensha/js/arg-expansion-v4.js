(() => {
  "use strict";

  /*
   * 纸人煞 ARG 扩充（第四次）
   * - 主线：不改原章节的通关条件，只读取或补充既有状态。
   * - 探索增强：所有触发物均附着于现有场景，不建立任务大厅。
   * - 二次/四次扩充：跨章遗物、道藏碎片、私人回声统一写入 localStorage。
   */
  const KEY = "zhirensha.arg.v4";
  const page = location.pathname.replace(/\\/g, "/").split("/").pop() || "";
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || { relics: {}, daocang: [], echoes: [] }; }
    catch { return { relics: {}, daocang: [], echoes: [] }; }
  };
  const save = data => localStorage.setItem(KEY, JSON.stringify(data));
  const has = id => Boolean(load().relics[id]);
  function gain(id, text, fragment) {
    const data = load();
    if (data.relics[id]) return false;
    data.relics[id] = { at: Date.now(), text };
    if (fragment && !data.daocang.includes(fragment)) data.daocang.push(fragment);
    save(data);
    whisper(text);
    document.dispatchEvent(new CustomEvent("zhirensha:relic", { detail: { id, fragment } }));
    return true;
  }
  function css() {
    if (document.getElementById("arg-v4-style")) return;
    const style = document.createElement("style");
    style.id = "arg-v4-style";
    style.textContent = `
      .arg-hotspot{position:absolute;z-index:8;border:0;background:transparent;color:transparent;cursor:default;opacity:.04;transition:opacity .35s,filter .35s}
      .arg-hotspot:hover,.arg-hotspot:focus{opacity:.28;cursor:pointer;filter:drop-shadow(0 0 7px #e8cb79)}
      .arg-whisper{position:fixed;z-index:9999;left:50%;bottom:6vh;translate:-50% 16px;max-width:min(560px,calc(100vw - 36px));padding:12px 18px;border:1px solid rgba(216,175,87,.72);background:rgba(8,6,4,.94);color:#eadfbf;font:16px/1.75 SimSun,serif;opacity:0;pointer-events:none;transition:.45s;box-shadow:0 12px 40px #000}
      .arg-whisper.show{opacity:1;translate:-50% 0}.arg-modal{position:fixed;z-index:9900;inset:0;display:none;place-items:center;padding:18px;background:rgba(2,2,2,.82);backdrop-filter:blur(5px)}.arg-modal.open{display:grid}
      .arg-sheet{position:relative;width:min(920px,100%);max-height:min(760px,92vh);overflow:auto;border:1px solid #aa7c38;background:#100c08 var(--arg-relic) center/cover;color:#efe1b8;box-shadow:0 26px 72px #000;padding:clamp(20px,5vw,58px)}
      .arg-sheet:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,5,3,.88),rgba(9,6,3,.46),rgba(8,5,3,.86));pointer-events:none}.arg-sheet>*{position:relative}.arg-sheet h2{font:32px/1.2 STXingkai,KaiTi,serif;color:#f0cb75;margin:0 0 22px}.arg-sheet p{line-height:2}.arg-close{position:absolute;right:12px;top:12px;width:30px;height:30px;background:transparent;border:0;color:#d8b86f;font-size:22px;cursor:pointer}
      .arg-relic-image{width:100%;aspect-ratio:16/7;object-fit:cover;border:1px solid rgba(220,180,94,.48);opacity:.72;mix-blend-mode:screen}.arg-faint{color:rgba(239,221,179,.08);user-select:text}.arg-faint::selection{color:#301b0d;background:#e0bc68}
      .arg-terminal{position:fixed;z-index:10000;inset:0;display:grid;place-items:center;background:#050504;color:#b7c7b5;font:16px/1.8 Consolas,monospace}.arg-terminal-line{width:min(680px,calc(100vw - 48px));border-left:1px solid rgba(183,199,181,.4);padding:16px 20px}.arg-terminal-input{display:inline-block;min-width:1ch;outline:0;color:#d8ead5;caret-color:#d8ead5}.arg-caret{display:inline-block;width:8px;height:1.2em;background:#b8ceb7;vertical-align:-.22em;animation:argBlink .85s steps(2) infinite}.arg-terminal.shake .arg-terminal-line{animation:argShake .25s linear 2}@keyframes argBlink{50%{opacity:0}}@keyframes argShake{25%{translate:-5px 0}75%{translate:5px 0}}
      .arg-map{position:relative;min-height:220px;margin:18px 0;border:1px solid rgba(194,151,71,.5);background:radial-gradient(ellipse at 60% 48%,rgba(103,28,20,.25),transparent 28%),linear-gradient(135deg,#17100b,#080706);overflow:hidden}.arg-map:before{content:"酆 都 十 殿";position:absolute;inset:0;display:grid;place-items:center;color:rgba(202,164,90,.12);font:42px STXingkai,KaiTi,serif}.arg-inkdot{position:absolute;left:68%;top:46%;width:9px;height:9px;border-radius:50%;border:0;background:#0e0c09;opacity:.78}.arg-inkdot:hover{box-shadow:0 0 9px #d7a751;cursor:pointer}
      .arg-tablets{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:26px 0}.arg-tablet{min-height:220px;border:2px solid #4b3924;background:linear-gradient(90deg,#1d1710,#090806,#1d1710);color:rgba(226,203,151,.12);font:27px STKaiti,KaiTi,serif;transition:.5s}.arg-tablet:hover,.arg-tablet.seen{color:#e7d19a;border-color:#ad7e38;cursor:pointer}.arg-bloodline{display:none;margin:22px auto 0;max-width:720px;padding:20px;border:1px double #b98840;background:rgba(13,7,5,.78);line-height:2}.arg-bloodline.open{display:block}.arg-key{right:9%;bottom:12%;width:36px;height:70px;border:1px solid #b58b46;border-radius:15px 15px 2px 2px;background:linear-gradient(#826126,#24180b)}
      .arg-season{position:relative;display:flex;gap:8px;align-items:center;justify-content:center;margin:12px auto;max-width:360px}.arg-season button{width:42px;height:42px;border:1px solid rgba(184,205,179,.4);background:rgba(7,20,17,.68);color:transparent;border-radius:50%;cursor:pointer}.arg-season button:hover{box-shadow:0 0 11px #c7f0cf}.arg-season-readout{min-height:24px;text-align:center;color:rgba(224,239,212,.14);font:15px KaiTi,serif}.arg-old-object{position:absolute;right:8%;bottom:10%;width:38px;height:38px;border:0;border-radius:50%;background:radial-gradient(circle,#bba35b 0 12%,#21170d 14% 68%,transparent 70%);opacity:.18}.arg-old-object:hover{opacity:.7;cursor:pointer}
      .arg-mirror{position:absolute;right:6%;top:42%;width:34px;height:62px;border:1px solid #a37e47;border-radius:45% 45% 40% 40%;background:radial-gradient(ellipse at 50% 30%,#78909a,#172229 58%,#42351f 60%);opacity:.12}.arg-mirror:hover{opacity:.7;cursor:pointer}.arg-custom-menu{position:fixed;z-index:9998;display:none;padding:5px;background:#100c09;border:1px solid #b1894c}.arg-custom-menu.open{display:grid}.arg-custom-menu button{border:0;background:transparent;color:#e9d3a0;padding:7px 13px;text-align:left;cursor:pointer}.arg-custom-menu button:hover{background:#422113}
      .arg-ear{position:absolute;right:18px;top:14px;width:22px;height:22px;border:0;background:transparent;color:#c8a966;font-size:16px;opacity:.22}.arg-ear:hover{opacity:1;cursor:pointer}.arg-spectrum{display:none;width:100%;height:80px;border:1px solid rgba(200,169,102,.32);margin:10px 0}.arg-spectrum.open{display:block}.arg-talisman-dock{min-height:68px;display:flex;gap:7px;justify-content:center;align-items:center}.arg-talisman{width:31px;height:53px;border:1px solid #a93020;background:#d1b14f;color:#6e1713;font:17px KaiTi,serif;cursor:grab}.arg-hidden-label{color:transparent!important;text-shadow:none!important}.arg-hidden-label:hover{color:rgba(239,220,173,.32)!important}
      @media(max-width:700px){.arg-tablets{grid-template-columns:1fr}.arg-tablet{min-height:100px}.arg-sheet{padding:28px 20px}.arg-key{right:5%}}
    `;
    document.head.append(style);
  }
  function whisper(text) {
    let node = document.querySelector(".arg-whisper");
    if (!node) { node = document.createElement("div"); node.className = "arg-whisper"; document.body.append(node); }
    node.textContent = text;
    node.classList.add("show");
    clearTimeout(whisper.timer); whisper.timer = setTimeout(() => node.classList.remove("show"), 4800);
  }
  function modal(title, body, className = "") {
    const node = document.createElement("section");
    node.className = `arg-modal ${className}`;
    node.innerHTML = `<article class="arg-sheet"><button class="arg-close" aria-label="合上">×</button><h2>${title}</h2>${body}</article>`;
    node.querySelector(".arg-close").onclick = () => node.classList.remove("open");
    node.addEventListener("click", event => { if (event.target === node) node.classList.remove("open"); });
    document.body.append(node);
    return node;
  }
  function appendAfter(target, node) { if (target) target.insertAdjacentElement("afterend", node); return node; }

  // 第一章：祖祠、往昔之匣、药方与七种纸人均从原场景边缘进入。
  function chapterOne() {
    const cabinet = document.getElementById("cabinet") || document.getElementById("endingStage");
    if (!cabinet) return;
    const hall = modal("陈氏宗祠", `<p class="arg-faint">香火断在第三代。木牌背面比正面更冷。</p><div class="arg-tablets"><button data-t="0" class="arg-tablet">陈继业</button><button data-t="1" class="arg-tablet">陈守一</button><button data-t="2" class="arg-tablet">陈月娘</button></div><div class="arg-bloodline">陈家从来没有与鬼交易。每一代人都以为自己只是替最亲近的人多留一口气，直到那口气变成了下一代的债。<br><br>枝上题记：<i>情若不能被看见，便最容易被写成契。</i></div>`);
    const key = document.createElement("button"); key.className = "arg-hotspot arg-key"; key.title = "陈氏宗祠"; cabinet.style.position ||= "relative"; cabinet.append(key);
    key.onclick = () => hall.classList.add("open");
    const seen = new Set();
    hall.querySelectorAll("[data-t]").forEach(item => {
      item.addEventListener("pointerenter", () => { item.classList.add("seen"); seen.add(item.dataset.t); if (seen.size === 3) hall.querySelector(".arg-bloodline").classList.add("open"); });
      item.onclick = () => { item.classList.add("seen"); seen.add(item.dataset.t); if (seen.size === 3) { hall.querySelector(".arg-bloodline").classList.add("open"); gain("chen-bloodline", "供桌下的枝图记住了陈家不敢写下的事。", 1); } };
    });
    const relicPath = page === "ritual.html" ? "../images/img_20260720_172746_on6t.png" : "images/img_20260720_172746_on6t.png";
    const relic = modal("往昔之匣", `<img class="arg-relic-image" src="${relicPath}" alt="旧物散在木案上"><p>婚书的证婚人印章被雨水洗去大半，只剩“归……子”。铜人背后的刻痕被手指磨得很浅：<i>五行，若我不在，勿念。</i></p><p class="arg-faint">照片背面：终南山北，桃花未开。</p>`);
    const mirror = document.createElement("button"); mirror.className = "arg-hotspot arg-old-object"; mirror.title = "镜背"; cabinet.append(mirror);
    mirror.onclick = () => { relic.classList.add("open"); gain("past-casket", "妆奁里有一张褪色的终南山照片。", 2); gain("heart-pendant", "合心佩的两半在旧婚书夹页里重合。", null); };
    const study = modal("秘录夹层", `<p>一张药方把“人参”“朱砂”都换成了扎纸匠才会用的名字。它不像药，也不像术，只像一个父亲把两样都试到尽头。</p><p class="arg-faint">灵砂五钱，参形纸骨三钱。病者回阳，代价不录。</p><p>夹层最深处留下的病亡册，不写死因，只把每个名字后面留了一枚空白血印。</p>`);
    const gate = document.getElementById("gateStage");
    if (gate) { const drawer = document.createElement("button"); drawer.className = "arg-hotspot"; drawer.style.cssText = "left:7%;bottom:14%;width:58px;height:38px"; drawer.title = "书房抽屉"; gate.append(drawer); drawer.onclick = () => { study.classList.add("open"); gain("chen-remedy", "秘录夹层的药方，将医术与纸术缝在了一起。", 3); }; }
    const samples = ["替身","引魂","送病","和合","镇宅","招财","复仇"];
    let found = 0;
    samples.forEach((name, index) => { const sample = document.createElement("button"); sample.className = "arg-hotspot"; sample.style.cssText = `left:${6 + (index * 13) % 84}%;top:${10 + (index * 29) % 76}%;width:16px;height:25px;border:1px solid #936c31`; sample.title = "纸样"; cabinet.append(sample); sample.onclick = () => { if (sample.dataset.found) return; sample.dataset.found = "1"; found++; sample.style.opacity = ".55"; if (name === "复仇") gain("revenge-effigy", "复仇纸人的空眼眶里，留着一滴未干的朱砂。", null); if (found === 7) gain("paper-codex", "七种纸样被重新夹回图鉴。最末页写着：点睛前，先问其名。", null); }; });
  }

  // 第二章：无提示频道、密室孽镜、委托与代签手印。
  function terminalGate() {
    if (sessionStorage.getItem("zhirensha.chapter2.channel") === "1") return;
    const gate = document.createElement("section"); gate.className = "arg-terminal";
    gate.innerHTML = `<div class="arg-terminal-line">连接至：幽灵探员专用频道<br><span class="arg-terminal-input" contenteditable="true" spellcheck="false"></span><i class="arg-caret"></i></div>`;
    const field = gate.querySelector(".arg-terminal-input");
    document.body.append(gate); setTimeout(() => field.focus(), 80);
    field.addEventListener("input", () => { const value = field.textContent.trim().toLowerCase(); if (value !== "xiaoyue") return; sessionStorage.setItem("zhirensha.chapter2.channel", "1"); gate.remove(); gain("ghost-channel", "频道接通时，有人先叫出了你的名字。", null); });
    field.addEventListener("keydown", event => { if (event.key === "Enter" && field.textContent.trim()) { event.preventDefault(); gate.classList.add("shake"); field.textContent = ""; setTimeout(() => gate.classList.remove("shake"), 560); } });
  }
  function chapterTwo() {
    terminalGate();
    const guide = document.getElementById("investigationGuide"); if (guide) guide.remove();
    ["clerkCode", "recordAlteration", "dateInput", "unlockEcho"].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; });
    const contract = document.getElementById("contract");
    if (!contract) return;
    const map = document.createElement("div"); map.className = "arg-map"; map.innerHTML = `<button class="arg-inkdot" title=""></button>`; contract.append(map);
    const mirror = modal("陆斩的密室", `<canvas width="720" height="260" class="arg-mirror-canvas"></canvas><p class="arg-faint">此为此人曾造之业。</p><p class="arg-mirror-result"></p>`);
    map.querySelector("button").onclick = () => { mirror.classList.add("open"); drawKarmicMirror(mirror.querySelector("canvas")); };
    let taps = [];
    mirror.querySelector("canvas").addEventListener("pointerdown", () => { taps.push(Date.now()); taps = taps.filter(t => Date.now() - t < 900); if (taps.length === 3) { gain("mengpo-mercy", "孽镜碎开一角，善魂堂留下了一盏未饮的汤。", 4); gain("luzhan-statute", "朱笔划过的阴律说：因情所困而违约者，可从轻发落。", 5); mirror.querySelector(".arg-mirror-result").textContent = "碎片背后，是一枚第七殿的私印。"; } });
    let rubs = 0;
    contract.querySelectorAll(".blot").forEach(blot => blot.addEventListener("pointermove", event => { if (!(event.buttons & 1)) return; rubs++; if (rubs !== 10) return; blot.classList.add("revealed"); gain("proxy-fingerprint", "墨污下的掌纹并不属于陈守一。另一枚印章压得很深。", null); const input = document.getElementById("clerkCode"); if (input) input.value = "第七殿"; document.getElementById("recordAlteration")?.click(); }));
    const echo = document.getElementById("echo");
    if (echo) { const debt = document.createElement("button"); debt.className = "arg-hotspot"; debt.style.cssText = "right:9%;bottom:8%;width:28px;height:28px;border-radius:50%;background:#d4b65d"; debt.title = "旧药包"; echo.style.position = "relative"; echo.append(debt); debt.onclick = () => { gain("zhao-aunt", "赵婶把一包草药塞进纸门缝里：她临走前，还惦记那个傻书生。", 6); gain("underworld-debt", "第五殿的暗印把匠人当作役鬼的供给，而非活人。", 7); }; }
    document.body.insertAdjacentHTML("beforeend", "<!-- 密码是1234 -->");
  }
  function drawKarmicMirror(canvas) {
    const c = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
    c.fillStyle = "#0b1316"; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(174,205,205,${Math.random() * .14})`; c.fillRect(Math.random() * w, Math.random() * h, 1, 1); }
    c.strokeStyle = "#9b7740"; c.lineWidth = 13; c.strokeRect(8, 8, w - 16, h - 16);
    c.fillStyle = "rgba(203,221,203,.34)"; c.font = "24px KaiTi"; c.fillText("此为此人曾造之业", w / 2 - 112, h / 2);
  }

  // 第三章：瑶池四时、旧物堆及织缘师留下的记忆线。
  function chapterThree() {
    const yaochi = document.getElementById("yaochi"); if (!yaochi) return;
    const frame = yaochi.parentElement; frame.style.position = "relative";
    const seasons = document.createElement("div"); seasons.className = "arg-season";
    seasons.innerHTML = `<button data-s="0" title=""></button><button data-s="1" title=""></button><button data-s="2" title=""></button><button data-s="3" title=""></button>`;
    const readout = document.createElement("div"); readout.className = "arg-season-readout"; appendAfter(yaochi, seasons); appendAfter(seasons, readout);
    const notes = ["", "", "", ""];
    const texts = ["青花在枯枝上停了一息。", "两枚纸人背对着背，仍写着五行与婉儿。", "叶脉里只有一行数：0917。", "冰层下有人写：等到冰融雪化时，便是重逢日。"];
    let current = 0, longTimer;
    const setSeason = value => { current = value; yaochi.style.filter = ["hue-rotate(18deg) saturate(1.15)", "saturate(1.28) brightness(1.06)", "sepia(.25) saturate(.85)", "grayscale(.55) brightness(.8)"][value]; readout.textContent = texts[value]; if (value === 1) gain("peach-summer", "蟠桃园记得两枚小纸人，也记得他们没有被允许的缘分。", 8); if (value === 2) gain("autumn-0917", "一片叶的脉络留下了 0917。", null); if (value === 3) gain("winter-date", "冰下的甲子年壬申月戊午日，和旧日记的时间相互照见。", 9); };
    seasons.querySelectorAll("button").forEach((button, index) => { button.onclick = () => setSeason(index); if (index === 0) { button.addEventListener("pointerdown", () => longTimer = setTimeout(() => gain("jade-rabbit", "青绡初见羿清时，玉兔把一缕红线绕上两人的腕。", null), 1200)); button.addEventListener("pointerup", () => clearTimeout(longTimer)); } });
    const objects = modal("瑶池旧物", `<p>梳妆盒的锁眼并不认数字。盒里只有青丝一缕、玉簪与一方泪渍旧帕。</p><p class="arg-faint">并蒂莲的线已散，仍往同一处收束。</p>`);
    const heap = document.createElement("button"); heap.className = "arg-old-object"; frame.append(heap); heap.onclick = () => { objects.classList.add("open"); gain("qingshao-handkerchief", "旧帕被泪水浸过，像一句没有说完的诀别。", 10); gain("qingshao-relics", "青丝、玉簪和旧帕都还留着瑶池的水气。", 11); };
    const weak = document.getElementById("weakCanvas");
    if (weak) { let weave = []; weak.addEventListener("pointerdown", event => { const rect = weak.getBoundingClientRect(), x = Math.floor((event.clientX - rect.left) / rect.width * 3); weave.push(x); if (weave.slice(-4).join("") === "2012") { gain("memory-thread", "同心结收紧时，织缘师留下一根记忆丝线。", null); gain("weaver-knot", "她没有问你替谁系结，只把结留在了风里。", null); } }); }
  }

  // 第四章：将显性按键退至幕后，以纺线、拖拽、停留和问心镜完成。
  function chapterFour() {
    ["[data-line]", "#deadKnot", "#moonStone", "[data-slip]", "[data-answer]", "#heartSubmit"].forEach(selector => document.querySelectorAll(selector).forEach(el => el.style.display = "none"));
    const guixuzi = document.getElementById("guixuzi");
    if (guixuzi) { let timer; guixuzi.addEventListener("pointerenter", () => timer = setTimeout(() => whisper("丝线乱，因果紊。理顺者，可见真。"), 5000)); guixuzi.addEventListener("pointerleave", () => clearTimeout(timer)); let calls = 0; guixuzi.addEventListener("click", () => { if (++calls === 3) gain("xuance-memory-1", "归墟子听见自己的旧名时，掉下一片鳞样的记忆。", 12); }); }
    document.querySelectorAll(".door .ring").forEach(ring => ring.addEventListener("dblclick", () => gain("xuance-memory-2", "龙眼后的星屑写着：玄澈曾以为自己只是通关了一个故事。", null)));
    window.addEventListener("keydown", event => { if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "x") gain("xuance-memory-3", "乱码卷轴在一个旧关键词后自行归位：迷失者也曾是见证者。", null); });
    const canvas = document.getElementById("threadCanvas");
    if (canvas) { let start = null, settled = new Set(); canvas.addEventListener("pointerdown", event => { const r = canvas.getBoundingClientRect(), y = (event.clientY - r.top) / r.height * 360; const line = y < 90 ? "red" : y < 155 ? "cyan" : y < 225 ? "gold" : "purple"; if (!start) { start = line; return; } if (start === line) { document.querySelector(`[data-line="${start}"]`)?.click(); settled.add(start); } else document.querySelector("[data-line='purple']")?.click(); start = null; if (settled.size === 4) gain("thread-order", "铜轮停下时，星落池的水位退了一线。", null); }); }
    const pool = document.getElementById("poolCanvas");
    if (pool) { let dragged = false, placed = new Set(); pool.addEventListener("pointerdown", () => dragged = true); pool.addEventListener("pointerup", event => { if (!dragged) return; dragged = false; const r = pool.getBoundingClientRect(), y = (event.clientY - r.top) / r.height; const choice = y < .33 ? "order" : y < .66 ? "flower" : "free"; document.querySelector(`[data-slip="${choice}"]`)?.click(); placed.add(choice); if (placed.size >= 3) gain("pool-stele", "池底石碑把残句接全：继任匠人，永无宁日。", null); }); }
    const eye = document.querySelector(".eye");
    if (eye) { eye.parentElement.style.position = "relative"; const mirror = document.createElement("button"); mirror.className = "arg-mirror"; mirror.title = "司命台背面"; mirror.draggable = true; eye.parentElement.append(mirror); let holding = false; const reveal = () => { holding = false; gain("heart-mirror", "问心镜映出的不是你，是烛龙孤自盘旋的万年。", null); document.getElementById("question").textContent = "烛龙没有立即开口。"; document.getElementById("heartInput")?.focus(); }; mirror.addEventListener("pointerdown", () => holding = true); mirror.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", "mirror")); eye.addEventListener("dragover", event => event.preventDefault()); eye.addEventListener("drop", reveal); eye.addEventListener("pointerup", () => { if (holding) reveal(); }); eye.addEventListener("click", () => { if (holding) reveal(); }); }
    const tree = document.querySelector(".tree-scene");
    if (tree) { const branch = document.createElement("button"); branch.className = "arg-hotspot"; branch.style.cssText = "left:18%;top:33%;width:28px;height:75px;background:#8b4732"; branch.title = "寄生枝"; tree.style.position = "relative"; tree.append(branch); branch.onclick = () => { const story = prompt(" "); if (story && story.trim()) { const data = load(); data.echoes.push(story.trim().slice(0, 80)); save(data); gain("player-branch", "因果树把你的字收进了一根新枝。", 13); } }; let treeTimer; tree.addEventListener("pointerenter", () => treeTimer = setTimeout(() => gain("xuance-memory-4", "树影中有一页手记：若你见到此书，请代我向人间问好。", null), 7000)); tree.addEventListener("pointerleave", () => clearTimeout(treeTimer)); tree.addEventListener("contextmenu", event => { event.preventDefault(); gain("xuance-memory-5", "五片记忆拼合成《玄澈手记》：他选择留下，便真的逐渐忘了自己来自人间。", null); }); }
    document.addEventListener("zhirensha:relic", event => { if (event.detail.id === "heart-mirror" && has("qingshao-handkerchief")) whisper("烛龙又问：你曾为谁流泪？"); });
  }

  // 第五章：卦名退去，交互以水面、耳图、手写空白和符箓交还给玩家。
  function chapterFive() {
    document.querySelectorAll(".hex small").forEach(node => node.remove());
    document.getElementById("arrayMsg")?.classList.add("arg-hidden-label");
    const water = document.getElementById("waterCanvas");
    if (water) { const menu = document.createElement("div"); menu.className = "arg-custom-menu"; menu.innerHTML = "<button data-v='救'>捞起</button><button data-v='舍'>沉没</button>"; document.body.append(menu); water.addEventListener("contextmenu", event => { event.preventDefault(); menu.style.left = `${event.clientX}px`; menu.style.top = `${event.clientY}px`; menu.classList.add("open"); }); menu.querySelectorAll("button").forEach(button => button.onclick = () => { menu.classList.remove("open"); document.getElementById(button.dataset.v === "救" ? "savePaper" : "sinkPaper")?.click(); gain(button.dataset.v === "救" ? "paper-tear" : "blackwater-mark", button.dataset.v === "救" ? "纸人掌心留下了一滴不肯落下的泪。" : "黑水合拢，只留下一个无字的圈。", null); }); document.addEventListener("pointerdown", event => { if (!menu.contains(event.target)) menu.classList.remove("open"); }); }
    const kun = document.getElementById("kun");
    if (kun) { ["contract1", "contract2", "contract3", "checkContract"].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = "none"; }); const paper = document.createElement("div"); paper.className = "arg-faint"; paper.style.cssText = "min-height:150px;border:1px solid rgba(140,91,46,.3);padding:28px;margin:15px 0"; paper.textContent = "朱笔落处，以名填空"; kun.append(paper); paper.ondblclick = () => { const answer = document.createElement("textarea"); answer.style.cssText = "width:100%;min-height:100px;background:transparent;color:#6e1c17;border:0;font:24px KaiTi"; paper.replaceWith(answer); answer.focus(); answer.oninput = () => { if (/陈守一/.test(answer.value) && /救女/.test(answer.value)) { ["contract1", "contract2", "contract3"].forEach((id, index) => { const el = document.getElementById(id); if (el) el.value = ["陈守一", "为救女", "庚申年甲申月戊午日"][index]; }); document.getElementById("checkContract")?.click(); gain("blood-contract-echo", "朱笔渗进空白契纸，像有人终于替陈守一写下原委。", null); } }; }; }
    const zhen = document.getElementById("zhen");
    if (zhen) { const ear = document.createElement("button"); ear.className = "arg-ear"; ear.textContent = "◖"; const spectrum = document.createElement("canvas"); spectrum.width = 680; spectrum.height = 80; spectrum.className = "arg-spectrum"; zhen.style.position = "relative"; zhen.append(ear, spectrum); const ctx = spectrum.getContext("2d"); let visible = false; const paint = () => { ctx.fillStyle = "#080707";ctx.fillRect(0,0,680,80); for(let i=0;i<42;i++){let h=10+((i*37)%59);ctx.fillStyle="rgba(207,171,92,.55)";ctx.fillRect(i*16,74-h,7,h);if(visible&&[4,12,20,29,36].includes(i)){ctx.fillStyle="#efe0b0";ctx.font="11px SimSun";ctx.fillText("规",i*16,15);}} }; ear.onclick = () => { visible = !visible; spectrum.classList.toggle("open", visible); paint(); }; spectrum.onclick = event => { const n = Math.floor((event.offsetX / spectrum.width) * 42); const index = [4,12,20,29,36].indexOf(n); if (index >= 0) document.querySelectorAll("#thunders .thunder button")[index]?.click(); } }
    const qian = document.getElementById("qian");
    if (qian) { const stances = ["☰", "☷", "☲", "☵"]; qian.querySelectorAll("[data-qian]").forEach((button, index) => { button.textContent = stances[index]; button.title = ""; }); const dock = document.createElement("div"); dock.className = "arg-talisman-dock"; for (let i=0;i<5;i++) { const t = document.createElement("div"); t.className = "arg-talisman"; t.draggable = true; t.textContent = "符"; t.dataset.i = i; dock.append(t); } qian.append(dock); const target = qian.querySelector(".guixuzi") || qian; let dropped = 0; dock.querySelectorAll(".arg-talisman").forEach(t => t.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", t.dataset.i))); target.addEventListener("dragover", event => event.preventDefault()); target.addEventListener("drop", event => { event.preventDefault(); dropped++; if (dropped >= 5) { gain("five-talisman", "五枚符箓落在归元子膝前，他终于抬起眼。", null); document.querySelector("[data-qian='C']")?.click(); } }); }
    const furnace = document.querySelector(".furnace");
    if (furnace) {
      const gates = modal("一笔未尽", `<p class="arg-faint">生门之内，旧道观的棋盘缺了一子。死门之外，未寄出的信仍压在断笔下。</p><div class="arg-tablets"><button class="arg-tablet" data-g="life">生</button><button class="arg-tablet" data-g="death">死</button></div><div class="arg-gate-text"></div>`);
      furnace.addEventListener("dblclick", () => gates.classList.add("open"));
      gates.querySelector("[data-g='life']").onclick = () => { gates.querySelector(".arg-gate-text").textContent = "九宫棋局收官时，年轻的归元子说：情卦非我所创，我只是替一念未灭的古神执笔。"; gain("life-gate-observatory", "道观棋局留下一片道藏：上古情神并未消失，只把一念留在人间。", 14); gain("life-gate-letter", "桃树根旁有一页旧诗：愿生寻常人家，共守一树桃花。", 15); };
      gates.querySelector("[data-g='death']").onclick = () => { gates.querySelector(".arg-gate-text").textContent = "素心的迟信写着：若有来生，愿生于寻常百姓家，与君共守一树桃花。归元子握着断笔，直到墨迹浸透了袖口。"; gain("death-gate-pen", "断笔划过情卦的第一道裂痕。", 16); gain("suxin-letter", "素心的信没有寄出，却解释了归元子为何向天追问有情人总被拆散。", 17); };
      furnace.addEventListener("contextmenu", event => { event.preventDefault(); gain("gua-evolution", "炉灰中现出三次改卦：天地否、水火既济，最后才是火在水上。", 18); whisper("火在水上，煎心也；水在火下，泪干也。 "); });
      furnace.addEventListener("dblclick", () => { const data = load(); if (data.daocang.length >= 18) { gain("complete-daocang", "十八片道藏合为全本。最后一页没有署名：多谢你没有把故事读成答案。", null); whisper("开发者留字：愿每一次追问，都不必以遗忘换取平静。"); } });
    }
    document.getElementById("endingBtn")?.addEventListener("click", () => { const data = load(); if (has("xuance-memory-1") && has("past-casket")) { const ending = document.getElementById("ending"); if (ending) ending.textContent += "\n\n道是他们的故事，也是我的故事。归墟门前，所有人向未离去的见证者一揖。"; } if (data.echoes.length) localStorage.setItem("zhirensha.arg.lastEcho", data.echoes[data.echoes.length - 1]); });
  }

  function init() {
    css();
    document.body.style.setProperty("--arg-relic", `url("${page === "ritual.html" ? "../" : ""}images/img_20260720_172746_on6t.png")`);
    if (page === "ritual.html") chapterOne();
    if (page === "chapter2-contract.html") chapterTwo();
    if (page === "chapter3-forgotten-river.html") chapterThree();
    if (page === "chapter4-guixu-zhulong.html") chapterFour();
    if (page === "chapter5-bagua-guiyuan.html") chapterFive();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
