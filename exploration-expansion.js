(() => {
  "use strict";

  const path = location.pathname.replace(/\\/g, "/");
  const chapter = path.includes("chapter2-") ? "ch2" : path.includes("chapter3-") ? "ch3" : path.includes("chapter4-") ? "ch4" : path.includes("chapter5-") ? "ch5" : null;
  if (!chapter) return;

  const CONFIG = {
    ch2: {
      caseId: "CASE / CHEN-1874-ZZ",
      title: "阴契现场记录",
      image: "images/chapter2-contract-archive.png",
      caption: "第七殿档案司的扫描件在每次判词落下后都会发生像素偏移。",
      events: {
        recordAlteration: "墨污登记请求已写入边缘日志。",
        unlockEcho: "旧录音的波形被截取了一小段。",
        helpQingyi: "纸鹤折痕指向了一条未签名的批注。",
        makeSentient: "工坊成品被标记为“自主缺陷”。",
        makePerfect: "工坊成品被标记为“标准役鬼”。"
      }
    },
    ch3: {
      caseId: "FERRY / KUNLUN-079",
      title: "忘川回声记录",
      image: "images/chapter3-wangchuan.png",
      caption: "桥下的水声不是环境音。它在重复某些被卷宗删去的姓名。",
      events: {
        doSearch: "三生石接受了一次新的查询。",
        answerWeak: "弱水短暂静止，水面留下了一道折光。",
        answerFifth: "瑶池席位的缺口被重新比对。",
        tellLuzhan: "守桥人的身份链出现了一处回声。",
        answerNinth: "昆仑雾中传来一次未署名的答复。"
      }
    },
    ch4: {
      caseId: "ABYSS / CAUSAL-007",
      title: "归墟因果记录",
      image: "images/chapter4-guixu-gate.png",
      caption: "红线穿过七宿时，所有既有结局都开始被重新编号。",
      events: {
        checkGate: "门环读取了一次星图排列。",
        moonStone: "月光石照亮了星落池的背面。",
        heartSubmit: "竖瞳收录了一句没有归档的回应。",
        selfReflection: "池水没有映出任何人，只有调查者本人。",
        sealOutcome: "因果鼎尝试将现有证词炼成判印。"
      }
    },
    ch5: {
      caseId: "RETURN / HEXA-006",
      title: "归元阵现场记录",
      image: "images/chapter5-guiyuan-furnace.png",
      caption: "炉灰中的六字纤维不肯燃尽，像在等待一条不同的归路。",
      events: {
        checkContract: "坤地旧契接受了一次补录。",
        replyDragon: "风把一段人声送入烛龙鳞下。",
        ignite: "丹炉火候发生了一次可见偏移。",
        endingBtn: "归元印开始汇总所有已留存的记录。"
      }
    }
  };

  const config = CONFIG[chapter];
  const storageKey = `zhirensha.arg.recorder.${chapter}`;
  const globalKey = "zhirensha.arg.recorder.notes";

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }

  const state = read(storageKey, { events: [], note: "", reality: null, relays: [] });
  state.events ||= [];
  state.relays ||= [];
  state.note ||= "";
  const allNotes = read(globalKey, {});

  const style = document.createElement("style");
  style.textContent = `
    .arg-recorder-trigger{position:fixed;right:16px;bottom:16px;z-index:9996;width:44px;height:44px;border:1px solid rgba(211,166,83,.78);border-radius:50%;background:#120d0a;color:#e7cc8b;font:1.25rem "STXingkai","KaiTi",serif;box-shadow:0 8px 20px rgba(0,0,0,.42),inset 0 0 0 3px rgba(159,29,24,.18);cursor:pointer}.arg-recorder-trigger::before{content:"";position:absolute;left:50%;top:7px;width:5px;height:5px;border-radius:50%;translate:-50% 0;background:#b52a20;box-shadow:0 0 8px #b52a20}.arg-recorder-trigger:hover,.arg-recorder-trigger:focus-visible{border-color:#f0d184;box-shadow:0 0 20px rgba(206,55,39,.42);outline:2px solid rgba(240,209,132,.55);outline-offset:3px}
    .arg-recorder{position:fixed;z-index:9997;inset:0;display:none;place-items:center;padding:18px;background:rgba(2,3,3,.78);color:#e8ddc6;font-family:"SimSun","宋体",serif}.arg-recorder.show{display:grid}.arg-recorder-shell{width:min(1020px,100%);max-height:min(760px,calc(100vh - 36px));overflow:auto;border:1px solid rgba(202,164,90,.7);background:#0d0e0d;box-shadow:0 28px 90px rgba(0,0,0,.7)}.arg-recorder-top{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px 18px;border-bottom:1px solid rgba(202,164,90,.34);background:linear-gradient(90deg,#25120f,#0b0c0c)}.arg-recorder-top p{margin:0;color:#ad9d7b;font:12px Consolas,monospace}.arg-recorder-top h2{margin:4px 0 0;color:#e2c37d;font:1.55rem "STXingkai","KaiTi",serif;font-weight:normal}.arg-recorder-close{width:34px;height:34px;border:1px solid rgba(202,164,90,.52);background:transparent;color:#e5d4ad;font-size:1.1rem;cursor:pointer}.arg-recorder-main{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr);min-height:460px}.arg-recorder-visual{position:relative;min-height:460px;overflow:hidden;background:#060707}.arg-recorder-visual img{width:100%;height:100%;min-height:460px;object-fit:cover;opacity:.58;filter:saturate(.68) contrast(1.08)}.arg-recorder-visual::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(7,8,8,.96),transparent 65%),linear-gradient(90deg,rgba(7,8,8,.18),rgba(7,8,8,.62))}.arg-recorder-caption{position:absolute;z-index:1;right:22px;bottom:20px;left:22px;margin:0;color:#d7c7a3;line-height:1.8}.arg-recorder-panel{padding:20px;border-left:1px solid rgba(202,164,90,.27);background:repeating-linear-gradient(0deg,rgba(238,211,147,.025) 0 1px,transparent 1px 5px),#12110e}.arg-recorder-panel h3{margin:0 0 10px;color:#e0bd71;font:1.2rem "STXingkai","KaiTi",serif;font-weight:normal}.arg-wave{display:block;width:100%;height:72px;margin:0 0 14px;border:1px solid rgba(202,164,90,.32);background:#090a09}.arg-event-list{display:grid;gap:8px;max-height:184px;overflow:auto;padding-right:4px}.arg-event{padding:9px 10px;border-left:2px solid #6a4931;background:rgba(255,239,183,.035);color:#aaa391;font-size:.9rem;line-height:1.55}.arg-event time{display:block;margin-bottom:3px;color:#8a6644;font:10px Consolas,monospace}.arg-empty{color:#746f65;font-size:.9rem;line-height:1.7}.arg-note{margin-top:18px;padding-top:14px;border-top:1px dashed rgba(202,164,90,.28)}.arg-note textarea{width:100%;min-height:88px;resize:vertical;border:1px solid rgba(202,164,90,.48);background:#080908;color:#efe0bd;padding:10px;font:inherit;line-height:1.65}.arg-note button{margin-top:8px;border:1px solid #b78b45;background:#32130f;color:#f0d69b;padding:8px 12px;font:inherit;cursor:pointer}.arg-note-status{min-height:1.5em;margin:8px 0 0;color:#a7c89a;font-size:.86rem}.arg-recorder-foot{display:flex;justify-content:space-between;gap:12px;padding:10px 18px;border-top:1px solid rgba(202,164,90,.26);color:#857d6d;font:11px Consolas,monospace}@media(max-width:700px){.arg-recorder-trigger{right:10px;bottom:10px}.arg-recorder{padding:8px}.arg-recorder-main{grid-template-columns:1fr}.arg-recorder-visual,.arg-recorder-visual img{min-height:240px}.arg-recorder-panel{border-top:1px solid rgba(202,164,90,.27);border-left:0}.arg-recorder-foot{align-items:start;flex-direction:column}}
  `;
  document.head.appendChild(style);

  const relayStyle = document.createElement("style");
  relayStyle.textContent = `
    .arg-relay{margin-top:18px;padding-top:14px;border-top:1px dashed rgba(202,164,90,.28)}.arg-relay textarea{width:100%;min-height:58px;resize:vertical;border:1px solid rgba(202,164,90,.4);background:#080908;color:#d8c9aa;padding:8px;font:10px/1.5 Consolas,monospace}.arg-relay-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.arg-relay button{border:1px solid rgba(202,164,90,.54);background:#18120d;color:#e8d3a1;padding:7px 9px;font:inherit;font-size:.82rem;cursor:pointer}.arg-relay button:hover{border-color:#d34b3d;background:#35110d}.arg-relay-status{min-height:1.5em;margin:8px 0 0;color:#9ec290;font-size:.84rem;line-height:1.5}
  `;
  document.head.appendChild(relayStyle);

  const trigger = document.createElement("button");
  trigger.className = "arg-recorder-trigger";
  trigger.type = "button";
  trigger.title = "现场记录器";
  trigger.setAttribute("aria-label", "打开现场记录器");
  trigger.textContent = "录";
  document.body.appendChild(trigger);

  const modal = document.createElement("section");
  modal.className = "arg-recorder";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", config.title);
  modal.innerHTML = `<div class="arg-recorder-shell"><header class="arg-recorder-top"><div><p>${config.caseId}</p><h2>${config.title}</h2></div><button class="arg-recorder-close" type="button" aria-label="关闭现场记录器">&#215;</button></header><div class="arg-recorder-main"><figure class="arg-recorder-visual"><img src="${config.image}" alt="${config.title}的恢复画面"><figcaption class="arg-recorder-caption">${config.caption}</figcaption></figure><section class="arg-recorder-panel"><h3>接收波形</h3><canvas class="arg-wave" width="360" height="72"></canvas><h3>现场残留</h3><div class="arg-event-list"></div><div class="arg-note"><h3>调查者笔记</h3><textarea maxlength="180" placeholder=""></textarea><button type="button">封存笔记</button><p class="arg-note-status"></p></div></section></div><footer class="arg-recorder-foot"><span>LOCAL TRACE / ${chapter.toUpperCase()}</span><span class="arg-recorder-count"></span></footer></div>`;
  document.body.appendChild(modal);
  modal.querySelector(".arg-note").insertAdjacentHTML("afterend", `<div class="arg-relay"><h3>同案中继</h3><textarea class="arg-relay-code" readonly aria-label="联络码"></textarea><div class="arg-relay-actions"><button type="button" data-relay="copy">复制联络码</button><button type="button" data-relay="share">发送同案记录</button><button type="button" data-relay="download">导出卷宗</button></div><textarea class="arg-relay-import" aria-label="导入联络码"></textarea><div class="arg-relay-actions"><button type="button" data-relay="import">接收同案记录</button></div><p class="arg-relay-status"></p></div>`);
  modal.querySelector(".arg-recorder-foot").insertAdjacentHTML("afterbegin", `<span class="arg-local-clock"></span>`);

  const list = modal.querySelector(".arg-event-list");
  const noteInput = modal.querySelector("textarea");
  const noteStatus = modal.querySelector(".arg-note-status");
  const noteButton = modal.querySelector(".arg-note button");
  const count = modal.querySelector(".arg-recorder-count");
  const clock = modal.querySelector(".arg-local-clock");
  const relayCode = modal.querySelector(".arg-relay-code");
  const relayImport = modal.querySelector(".arg-relay-import");
  const relayStatus = modal.querySelector(".arg-relay-status");
  const wave = modal.querySelector("canvas");
  const waveCtx = wave.getContext("2d");
  let waveFrame = 0;
  let active = false;

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(state));
    localStorage.setItem(globalKey, JSON.stringify(allNotes));
  }

  function encode(value) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(value))));
  }

  function decode(value) {
    return JSON.parse(decodeURIComponent(escape(atob(value.trim()))));
  }

  function localStamp() {
    const now = new Date();
    return {
      time: now.toLocaleString("zh-CN", { hour12: false }),
      zone: Intl.DateTimeFormat().resolvedOptions().timeZone || "local",
      language: navigator.language || "unknown"
    };
  }

  function relayPayload() {
    return {
      version: 1,
      chapter,
      caseId: config.caseId,
      recordedAt: state.reality,
      note: state.note || "",
      traces: state.events.slice(-8).map(event => event.text)
    };
  }

  function render() {
    noteInput.value = state.note || "";
    count.textContent = `${state.events.length.toString().padStart(2, "0")} TRACE(S) SEALED`;
    clock.textContent = state.reality ? `${state.reality.time} / ${state.reality.zone}` : "LOCAL CLOCK UNREAD";
    relayCode.value = encode(relayPayload());
    list.innerHTML = state.events.length
      ? state.events.slice().reverse().map(event => `<article class="arg-event"><time>${escapeHtml(event.time)}</time>${escapeHtml(event.text)}</article>`).join("")
      : `<p class="arg-empty">接收器没有捕捉到可归属的现场残留。</p>`;
  }

  function record(text) {
    if (state.events.some(event => event.text === text)) return;
    state.events.push({ text, time: new Date().toLocaleTimeString("zh-CN", { hour12: false }) });
    save();
    render();
  }

  function drawWave() {
    const width = wave.width;
    const height = wave.height;
    waveCtx.fillStyle = "#090a09";
    waveCtx.fillRect(0, 0, width, height);
    waveCtx.strokeStyle = "rgba(202,164,90,.16)";
    waveCtx.lineWidth = 1;
    for (let x = 0; x < width; x += 24) { waveCtx.beginPath(); waveCtx.moveTo(x, 0); waveCtx.lineTo(x, height); waveCtx.stroke(); }
    const amplitude = 12 + Math.min(state.events.length * 3, 22);
    waveCtx.beginPath();
    for (let x = 0; x <= width; x += 4) {
      const y = height / 2 + Math.sin((x + waveFrame) / 17) * amplitude * .45 + Math.sin((x + waveFrame) / 5) * amplitude * .16;
      x ? waveCtx.lineTo(x, y) : waveCtx.moveTo(x, y);
    }
    waveCtx.strokeStyle = state.note ? "#a8cb9a" : "#c99d57";
    waveCtx.shadowColor = waveCtx.strokeStyle;
    waveCtx.shadowBlur = 8;
    waveCtx.stroke();
    waveCtx.shadowBlur = 0;
    if (active && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      waveFrame += 3;
      requestAnimationFrame(drawWave);
    }
  }

  function open() {
    if (!state.reality) {
      state.reality = localStamp();
      save();
    }
    active = true;
    modal.classList.add("show");
    render();
    drawWave();
  }

  function close() {
    active = false;
    modal.classList.remove("show");
    trigger.focus();
  }

  trigger.addEventListener("click", open);
  modal.querySelector(".arg-recorder-close").addEventListener("click", close);
  modal.addEventListener("click", event => { if (event.target === modal) close(); });
  window.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("show")) close(); });

  noteButton.addEventListener("click", () => {
    const note = noteInput.value.trim();
    if (note.length < 6) {
      noteStatus.textContent = "这段笔记还不足以留下可辨认的痕迹。";
      return;
    }
    state.note = note;
    allNotes[chapter] = note;
    save();
    noteStatus.textContent = "笔记已封入本地记录。";
    render();
  });

  async function copyRelay() {
    relayCode.focus();
    relayCode.select();
    try {
      await navigator.clipboard.writeText(relayCode.value);
      relayStatus.textContent = "联络码已复制到当前设备。";
    } catch {
      document.execCommand("copy");
      relayStatus.textContent = "联络码已选中，可交给同案人。";
    }
  }

  function downloadRecord() {
    const payload = relayPayload();
    const content = [config.title, config.caseId, `设备时间：${payload.recordedAt?.time || "未读取"}`, `时区：${payload.recordedAt?.zone || "未读取"}`, "", "调查者笔记：", payload.note || "（未留）", "", "现场残留：", ...payload.traces.map(trace => `- ${trace}`), "", `联络码：${relayCode.value}`].join("\n");
    const href = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `${chapter}-现场记录.txt`;
    anchor.click();
    URL.revokeObjectURL(href);
    relayStatus.textContent = "卷宗已导出。";
  }

  async function shareRelay() {
    const text = `${config.caseId}\n${relayCode.value}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: config.title, text });
        relayStatus.textContent = "同案记录已交由系统分享。";
        return;
      } catch {}
    }
    await copyRelay();
  }

  function importRelay() {
    try {
      const payload = decode(relayImport.value);
      if (!payload || payload.version !== 1 || !payload.chapter || !Array.isArray(payload.traces)) throw new Error("invalid");
      const relayId = `${payload.chapter}:${payload.recordedAt?.time || "unknown"}:${payload.note || payload.traces.join("|")}`;
      if (!state.relays.includes(relayId)) {
        state.relays.push(relayId);
        payload.traces.slice(0, 4).forEach(text => record(`同案回传：${text}`));
        if (String(payload.note || "").trim().length >= 6) allNotes[`relay-${relayId}`] = payload.note;
        save();
      }
      relayStatus.textContent = `已接收来自 ${payload.chapter.toUpperCase()} 的同案记录。`;
      render();
    } catch {
      relayStatus.textContent = "这段联络码无法被当前记录器识别。";
    }
  }

  modal.querySelector('[data-relay="copy"]').addEventListener("click", copyRelay);
  modal.querySelector('[data-relay="share"]').addEventListener("click", shareRelay);
  modal.querySelector('[data-relay="download"]').addEventListener("click", downloadRecord);
  modal.querySelector('[data-relay="import"]').addEventListener("click", importRelay);

  document.addEventListener("click", event => {
    const target = event.target.closest("button, [role=button]");
    if (!target || !target.id) return;
    const text = config.events[target.id];
    if (text) window.setTimeout(() => record(text), 0);
  }, true);

  document.getElementById("endingBtn")?.addEventListener("click", () => {
    window.setTimeout(() => {
      const ending = document.getElementById("ending");
      const notes = Object.entries(read(globalKey, {})).filter(([, value]) => String(value).trim().length >= 6);
      if (!ending || !notes.length || ending.querySelector(".arg-fieldnote-echo")) return;
      const echo = document.createElement("p");
      echo.className = "arg-fieldnote-echo";
      echo.textContent = `归元印另存的调查者笔记：${notes.map(([, value]) => value).join(" / ")}`;
      ending.appendChild(echo);
    }, 0);
  });

  render();
})();
