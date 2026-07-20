(() => {
  "use strict";

  const talismanCode = "3704";
  const cabinetCode = "5791";
  const order = ["木", "火", "土", "金", "水"];
  const gateStage = document.getElementById("gateStage");
  const compassStage = document.getElementById("compassStage");
  const talismanStage = document.getElementById("talismanStage");
  const sealStage = document.getElementById("sealStage");
  const endingStage = document.getElementById("endingStage");
  const compassWrap = document.getElementById("compassWrap");
  const whisperHotspot = document.getElementById("whisperHotspot");
  const canvas = document.getElementById("talismanCanvas");
  const ctx = canvas.getContext("2d");
  const slider = document.getElementById("yangSlider");
  const bloodLine = document.getElementById("bloodLine");
  const codePanel = document.getElementById("codePanel");
  const keypad = document.getElementById("keypad");
  const slots = document.getElementById("slots");
  const errorText = document.getElementById("errorText");
  const sealKeypad = document.getElementById("sealKeypad");
  const sealSlots = document.getElementById("sealSlots");
  const sealError = document.getElementById("sealError");
  const cabinet = document.getElementById("cabinet");
  const lockPanel = document.getElementById("lockPanel");
  const paperBride = document.getElementById("paperBride");
  const endingCopy = document.getElementById("endingCopy");
  const gateMessage = document.getElementById("gateMessage");

  let index = 0;
  let input = "";
  let sealInput = "";
  const noise = Array.from({ length: 620 }, () => ({
    x: Math.random() * 360,
    y: Math.random() * 540,
    w: 1 + Math.random() * 2.5,
    a: .06 + Math.random() * .18
  }));

  function show(stage) {
    [gateStage, compassStage, talismanStage, sealStage, endingStage].forEach(item => item.classList.toggle("hidden", item !== stage));
  }

  function checkPrerequisites() {
    const missing = [];
    if (localStorage.getItem("wuxing.readDraft") !== "1") {
      missing.push("风水旧稿：罗盘顺序与死门逻辑");
    }
    if (localStorage.getItem("wuxing.readWedding") !== "1") {
      missing.push("合婚帖残页：新娘八字与木柜密码");
    }

    if (!missing.length) {
      show(compassStage);
      return;
    }

    gateMessage.innerHTML = `缺少：<br>${missing.map(item => `・${item}`).join("<br>")}`;
    show(gateStage);
  }

  function ring(freq, duration, type = "sine") {
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      const audio = ring.audio || new AudioCtor();
      ring.audio = audio;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(.08, audio.currentTime + .01);
      gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);
      osc.connect(gain).connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + duration + .02);
    } catch {}
  }

  function draw(power) {
    const p = Math.max(0, Math.min(100, Number(power))) / 100;
    ctx.clearRect(0, 0, 360, 540);
    const grad = ctx.createLinearGradient(0, 0, 360, 540);
    grad.addColorStop(0, "#dec174");
    grad.addColorStop(.54, "#c79f58");
    grad.addColorStop(1, "#b4863d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 360, 540);

    noise.forEach(dot => {
      ctx.fillStyle = `rgba(66,36,13,${dot.a * (1.15 - p * .75)})`;
      ctx.fillRect(dot.x, dot.y, dot.w, dot.w);
    });

    ctx.save();
    ctx.strokeStyle = `rgba(117,17,14,${.03 + p * .76})`;
    ctx.lineWidth = 6;
    ctx.shadowColor = `rgba(208,51,34,${p * .62})`;
    ctx.shadowBlur = p * 18;
    ctx.beginPath();
    ctx.moveTo(100, 80);
    ctx.lineTo(180, 128);
    ctx.lineTo(258, 88);
    ctx.moveTo(180, 128);
    ctx.lineTo(132, 228);
    ctx.lineTo(236, 280);
    ctx.lineTo(146, 378);
    ctx.lineTo(276, 448);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(123,10,9,${.02 + p * .92})`;
    ctx.shadowColor = `rgba(208,51,34,${p * .72})`;
    ctx.shadowBlur = 12 * p;
    ctx.font = "700 46px STXingkai, 华文行楷, LiSu, KaiTi, serif";
    ctx.fillText("纸骨镇煞", 180, 108);
    ctx.font = "700 31px STXingkai, 华文行楷, LiSu, KaiTi, serif";
    ctx.fillText("数三七零四", 180, 158);
    ctx.font = "900 74px STXingkai, 华文行楷, LiSu, SimSun, serif";
    ctx.fillText("3", 88, 286);
    ctx.fillText("7", 255, 244);
    ctx.fillText("0", 126, 402);
    ctx.fillText("4", 262, 430);
    ctx.restore();

    ctx.strokeStyle = "rgba(79,36,11,.36)";
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 340, 520);

    const visible = p > .96;
    bloodLine.classList.toggle("visible", visible);
    codePanel.classList.toggle("visible", visible);
  }

  function renderSlots(root, value) {
    Array.from(root.querySelectorAll(".digit-slot")).forEach((slot, i) => {
      slot.textContent = value[i] || "";
    });
  }

  function buildKeypad(root, onDigit, onBack) {
    "0123456789".split("").forEach(num => {
      const button = document.createElement("button");
      button.className = "bronze-btn";
      button.type = "button";
      button.textContent = num;
      button.addEventListener("click", () => onDigit(num));
      root.appendChild(button);
    });
    const back = document.createElement("button");
    back.className = "bronze-btn";
    back.type = "button";
    back.textContent = "退";
    back.addEventListener("click", onBack);
    root.appendChild(back);
  }

  document.querySelectorAll(".wuxing").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.element === order[index]) {
        button.classList.add("active");
        ring(440 + index * 40, .06);
        index += 1;
        if (index === order.length) {
          setTimeout(() => {
            show(talismanStage);
            draw(0);
          }, 600);
        }
        return;
      }
      index = 0;
      document.querySelectorAll(".wuxing").forEach(item => item.classList.remove("active"));
      compassWrap.classList.remove("shake");
      void compassWrap.offsetWidth;
      compassWrap.classList.add("shake");
      ring(80, .12, "sawtooth");
    });
  });

  whisperHotspot.addEventListener("pointerdown", () => whisperHotspot.classList.add("revealed"));
  slider.addEventListener("input", event => draw(event.target.value));

  buildKeypad(keypad, num => {
    if (input.length >= 4) return;
    input += num;
    renderSlots(slots, input);
  }, () => {
    input = input.slice(0, -1);
    renderSlots(slots, input);
  });

  document.getElementById("enterSeal").addEventListener("click", () => {
    if (input === talismanCode) {
      show(sealStage);
      ring(520, .12, "triangle");
      return;
    }
    input = "";
    renderSlots(slots, input);
    errorText.textContent = "阴气反冲";
    codePanel.classList.remove("shake");
    void codePanel.offsetWidth;
    codePanel.classList.add("shake");
  });

  buildKeypad(sealKeypad, num => {
    if (sealInput.length >= 4) return;
    sealInput += num;
    renderSlots(sealSlots, sealInput);
  }, () => {
    sealInput = sealInput.slice(0, -1);
    renderSlots(sealSlots, sealInput);
  });

  document.getElementById("sealButton").addEventListener("click", () => {
    if (sealInput !== cabinetCode) {
      sealInput = "";
      renderSlots(sealSlots, sealInput);
      sealError.textContent = "锁舌倒转";
      lockPanel.classList.remove("shake");
      void lockPanel.offsetWidth;
      lockPanel.classList.add("shake");
      return;
    }

    cabinet.classList.add("open");
    lockPanel.style.opacity = "0";
    lockPanel.style.pointerEvents = "none";
    setTimeout(() => paperBride.classList.add("burn"), 1600);
    setTimeout(() => {
      show(endingStage);
      localStorage.setItem("wuxing.chapter1Cleared", "1");
      typeText("红妆既破，迷障已清。陈五行魂魄归位，谢君再造。\n\n你成功破解了风水迷局，阻止了纸人还魂。失踪的学者陈五行在现实世界的旧宅中被发现，陷入昏迷但生机尚存。那封邮件的时间戳，正是中元节子时三刻。");
    }, 4300);
  });

  function typeText(text) {
    endingCopy.textContent = "";
    let i = 0;
    const timer = setInterval(() => {
      endingCopy.textContent += text[i] || "";
      i += 1;
      if (i >= text.length) clearInterval(timer);
    }, 42);
  }

  draw(0);
  checkPrerequisites();
})();
