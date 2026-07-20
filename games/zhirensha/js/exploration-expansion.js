/* Optional cross-chapter investigations. Each scene verifies evidence; it never advances on a narration click. */
(() => {
  "use strict";

  const path = location.pathname.replace(/\\/g, "/");
  const chapter = path.includes("chapter5") ? "ch5" : path.includes("chapter4") ? "ch4" : path.includes("chapter3") ? "ch3" : path.includes("chapter2") ? "ch2" : "ch1";
  const key = `zhirensha.explore.v3.${chapter}`;
  const effectsKey = "zhirensha.explore.effects";

  const CONFIG = {
    ch1: { title: "陈五行老宅", scenes: [
      { id: "study", name: "书房", image: "images/home-study.png", intro: "油灯下压着六页虫蛀的扎纸秘录。最末一页的笔势被人改过，只有依着旧稿的生气才能复原。", prompt: "将被改写的五行次序复原。", puzzle: { type: "sequence", options: ["金", "水", "木", "火", "土"], answer: "木火土金水" }, rewards: ["陈氏秘录残页", "陈守一忏悔信"], effect: "confession" },
      { id: "bedroom", name: "婚房", image: "images/chapter1-ritual-hall.png", intro: "红帐褪成灰色，铜镜朝下扣在妆台。镜背有三道新鲜指痕，像有人想把一个名字从镜里擦掉。", prompt: "镜面结霜后留下的署名，和哪份私人札记相同？", puzzle: { type: "choice", options: ["陈五行", "苏婉", "陈守一"], answer: "苏婉" }, rewards: ["苏婉心语：纸人不是我"], effect: "suwanVoice" },
      { id: "workshop", name: "扎纸工坊", image: "images/chapter1-paper-bride.png", intro: "未点睛的纸人立在案上。胸前合婚针穿过两层旧纸，却没有接到木柜锁芯。它要辨认的不是生辰，而是施术者犯下的禁忌。", prompt: "旧稿写明：纸人若把魂门与归路调换，便会反锁施术者。输入这四字禁忌。", puzzle: { type: "text", answer: "日时倒置" }, rewards: ["皮影残卷：雨中初见"], effect: "firstMeeting" },
      { id: "yard", name: "后院", image: "images/home-old-house.png", intro: "枯树上系着一张未烧尽的许愿符。纸背的针孔与合婚帖残页一模一样，末尾只余四个未被火吞掉的字。", prompt: "输入合婚帖纸背留下的四字。", puzzle: { type: "text", answer: "时辰错了" }, rewards: ["未烧尽的许愿符"], effect: "wish" }
    ]},
    ch2: { title: "判官档案室", scenes: [
      { id: "private", name: "未归档契约", image: "images/chapter2-contract-archive.png", intro: "三份被判官私自压下的契约躺在案上。它们都有血印，却都缺少同一种证明。", prompt: "缺失的那一页，原本应当证明什么？", puzzle: { type: "choice", options: ["自愿签押", "债务数额", "焚毁日期"], answer: "自愿签押" }, rewards: ["判官笔碎片·一", "判官笔碎片·二", "判官笔碎片·三"], effect: "judgeFragments" },
      { id: "maintenance", name: "役鬼维护室", image: "images/chapter2-archive.png", intro: "销毁簿被朱砂划了三遍，最后一笔没有落下。灰仓重量也没有随着销毁记录减少。", prompt: "在异常销毁记录中，缺席的编号是？", puzzle: { type: "text", answer: "037" }, rewards: ["叁柒异常日志"], effect: "no37" },
      { id: "journal", name: "陆判起居注", image: "images/chapter2-qingyi-spirit.png", intro: "竹简夹在判笔架背后，墨迹写到一角青衣时骤然断开。每页边缘都被人反复折向同一个名字。", prompt: "被陆斩藏进批注的人名是？", puzzle: { type: "text", answer: "青绡" }, rewards: ["陆斩手记：规则之外"], effect: "luzhanDiary" }
    ]},
    ch3: { title: "忘川渡补遗", scenes: [
      { id: "register", name: "瑶池仙籍", image: "images/chapter3-yaochi-banquet.png", intro: "十二片玉牒藏在被划掉的神职名后。玉光扫过时，只留下一个没有被剔除的名字。", prompt: "仙籍真正要复原的是谁的卷宗？", puzzle: { type: "text", answer: "青绡" }, rewards: ["瑶池玉牒碎片·十二", "瑶池仙籍·青绡卷"], effect: "jadeBook" },
      { id: "stone", name: "三生石背面", image: "images/chapter3-wangchuan.png", intro: "石灵把八卦刻在背面，拒绝回答任何泛泛的提问。它只记得那个被问了三次的名字。", prompt: "以同一名字叩问三次。", puzzle: { type: "text", answer: "青绡" }, rewards: ["石灵玉符"], effect: "stoneSpirit" },
      { id: "maze", name: "红线心防", image: "images/chapter3-peach-heart.png", intro: "红线不是墙，是每一世不肯承认的一句质问。最细的一根线在掌心收紧，像在等一个回答。", prompt: "红线反复留下的那句质问是？", puzzle: { type: "choice", options: ["为什么", "是谁", "何时"], answer: "为什么" }, rewards: ["青绡心防记录", "青丝结"], effect: "qingxiaoTrust" }
    ]},
    ch4: { title: "归墟旁卷", scenes: [
      { id: "travellers", name: "无名旅人卷", image: "images/chapter4-guixu.png", intro: "五卷并非你的经历。每一卷里都有一个人替你作出了另一种抉择，卷末没有署名。", prompt: "这些卷宗共同记录的不是结局，而是什么？", puzzle: { type: "choice", options: ["另一种选择", "同一段记忆", "一场审判"], answer: "另一种选择" }, rewards: ["平行卷轴批注"], effect: "parallelStories" },
      { id: "scribe", name: "归墟子问答", image: "images/chapter4-guixu-gate.png", intro: "归墟子不再问谜题。他只确认调查者是否记得被归档的人，也是否听过他未被写入卷首的真名。", prompt: "输入归墟子自称的名字。", puzzle: { type: "text", answer: "玄澈" }, rewards: ["归墟子真名：玄澈"], effect: "guixuzi" },
      { id: "knots", name: "纪念结", image: "images/chapter4-causality-tree-ding.png", intro: "多余的丝线没有被投进鼎中。它们曾系住两个人的旧名，编法也被留在卷边的折痕里。", prompt: "依卷边折痕排出结法。", puzzle: { type: "sequence", options: ["十字结", "同心结", "盘长结"], answer: "十字结同心结盘长结" }, rewards: ["陆斩与青绡的纪念结"], effect: "memorialKnot" }
    ]},
    ch5: { title: "归元补遗", scenes: [
      { id: "dao", name: "归元道藏", image: "images/chapter5-bagua.png", intro: "八页手札的纸色不同，像来自归元子人生里八个不敢回头的时辰。最早的一笔，被反复涂成了别的字。", prompt: "被涂改的第一笔，原来写的是哪一卦？", puzzle: { type: "text", answer: "情卦" }, rewards: ["归元道藏"], effect: "daoBook" },
      { id: "gates", name: "生死二门", image: "images/chapter5-guiyuan-altar.png", intro: "生门没有花，死门没有尸。两处都只留下同一件断物，像是有人拒绝再替天道落字。", prompt: "两门之间共同留下的断物是？", puzzle: { type: "choice", options: ["朱砂笔", "红线", "玉牌"], answer: "朱砂笔" }, rewards: ["写缘笔"], effect: "fateBrush" },
      { id: "wall", name: "最终留言墙", image: "images/chapter5-guiyuan-furnace.png", intro: "宣纸墙没有题头。这里留下的话，下一次会成为故事里听不清的天外之音。", prompt: "留下至少六个字，作为不写进判词的那一句。", puzzle: { type: "message" }, rewards: ["天外之音"], effect: "message" }
    ]}
  };

  function readStore(storeKey, fallback) {
    try { return JSON.parse(localStorage.getItem(storeKey) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }

  const saved = readStore(key, { collected: [] });
  const collected = new Set(saved.collected || []);
  const effects = readStore(effectsKey, {});
  const data = CONFIG[chapter];

  function imagePath(source) {
    return path.includes("/secret/") ? `../${source}` : source;
  }

  const style = document.createElement("style");
  style.textContent = `
    .explore-entry{position:fixed;left:14px;bottom:14px;z-index:9999;width:42px;height:42px;border:1px solid #ae9156;border-radius:50%;background:#15120c;color:#e8d5a6;font:22px "STXingkai","KaiTi",serif;opacity:.78;box-shadow:0 0 12px rgba(118,22,18,.42);cursor:pointer}.explore-entry:hover,.explore-entry:focus-visible{opacity:1;outline:2px solid #caa45a;outline-offset:3px}
    .explore-modal{position:fixed;inset:12px;z-index:9998;display:none;overflow:auto;background:rgba(8,9,8,.98);color:#e8e0ce;border:1px solid #92753d;padding:clamp(14px,3vw,30px);font-family:"SimSun","宋体",serif}.explore-modal.show{display:block}.explore-head{display:flex;justify-content:space-between;gap:16px;align-items:center;border-bottom:1px solid rgba(185,154,85,.62);padding-bottom:10px}.explore-head h2{font:2rem "STXingkai","KaiTi",serif;color:#d8bf82;margin:0}.explore-close,.scene-map button{border:1px solid #9e8148;background:#17130d;color:#ead9ae;padding:9px 12px;font:inherit;cursor:pointer}.explore-close:hover,.scene-map button:hover,.scene-map button:focus-visible{border-color:#d84a3e;background:#31110e}
    .explore-intro{color:#a8a193;line-height:1.8}.scene-map{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:18px 0}.scene-map button{text-align:left;min-height:76px}.scene-map b{display:block;color:#d9bd78;font-family:"STXingkai","KaiTi",serif;font-size:1.1rem}.scene-map small{display:block;margin-top:6px;color:#9d978a}.scene-map .done{border-color:#6fa68a;color:#d9f0e0}
    .scene-stage{position:relative;min-height:540px;border:1px solid rgba(185,154,85,.62);background:#100e0a;overflow:hidden}.scene-art{position:absolute;inset:0;background:center/cover no-repeat;filter:brightness(.48) saturate(.68);transform:scale(1.015)}.scene-art:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(8,8,7,.92),rgba(8,8,7,.55) 50%,rgba(8,8,7,.32)),linear-gradient(0deg,rgba(8,8,7,.95),transparent 58%)}.scene-sheet{position:relative;z-index:1;display:flex;min-height:540px;max-width:760px;flex-direction:column;justify-content:end;padding:clamp(20px,4vw,44px)}.scene-sheet h3{margin:0;color:#e2c47f;font:2.1rem "STXingkai","KaiTi",serif;font-weight:normal}.scene-sheet p{max-width:650px;margin:12px 0;color:#ddd0b3;line-height:1.9}.evidence-prompt{margin-top:12px!important;color:#e8d7a6!important}.evidence-form{margin-top:12px}.evidence-choice,.evidence-sequence{display:flex;gap:9px;flex-wrap:wrap}.evidence-choice button,.evidence-sequence button,.evidence-submit{border:1px solid rgba(196,157,81,.76);background:rgba(15,13,10,.8);color:#ead9ae;padding:10px 13px;font:inherit;cursor:pointer}.evidence-choice button:hover,.evidence-choice button:focus-visible,.evidence-sequence button.selected,.evidence-submit:hover{border-color:#e5c471;background:rgba(105,28,20,.78);outline:none}.evidence-sequence button{min-width:52px}.evidence-form input{width:min(420px,100%);border:1px solid #9e8148;background:rgba(8,8,7,.9);color:#f2e6c8;padding:11px 12px;font:inherit}.evidence-submit{margin-top:10px;display:block}.scene-log{min-height:1.8em;margin-top:14px!important;color:#c59b62!important}.scene-log.error{color:#d87b6e!important}.codex{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-top:16px}.codex div{border:1px dashed #675f4d;padding:8px;color:#817a6c}.codex .got{border-color:#72aa88;color:#d7efe0}.explore-note{margin-top:16px;padding:10px;border-left:3px solid #8f1d18;color:#c6ba9f;line-height:1.8}
    @media(max-width:600px){.explore-entry{left:10px;bottom:10px}.explore-modal{inset:8px}.scene-stage,.scene-sheet{min-height:560px}.scene-art{background-position:60% center}.evidence-choice button{width:100%;text-align:left}}
  `;
  document.head.appendChild(style);

  const entry = document.createElement("button");
  entry.className = "explore-entry";
  entry.type = "button";
  entry.title = "洞神探幽";
  entry.setAttribute("aria-label", "打开洞神探幽");
  entry.textContent = "☯";
  document.body.appendChild(entry);

  const modal = document.createElement("section");
  modal.className = "explore-modal";
  modal.setAttribute("aria-label", "洞神探幽探索界面");
  modal.innerHTML = `<div class="explore-head"><h2>洞神探幽 · ${data.title}</h2><button class="explore-close" type="button">合卷</button></div><p class="explore-intro">每件证物都要经过案卷核验。错误的判断会留下痕迹，但不会替你打开下一页。</p><div class="scene-map"></div><div class="scene-stage" aria-live="polite"><div class="scene-sheet"><h3>选择一个地点</h3><p>卷宗允许从任何地点开始调查。</p></div></div><h3>已归档证物</h3><div class="codex"></div><p class="explore-note" id="exploreNote">档案室保持安静。</p>`;
  document.body.appendChild(modal);

  const sceneMap = modal.querySelector(".scene-map");
  const stage = modal.querySelector(".scene-stage");
  const codex = modal.querySelector(".codex");
  const note = modal.querySelector("#exploreNote");

  function normalize(value) { return String(value).replace(/\s+/g, "").trim(); }
  function isDone(scene) { return scene.rewards.every(item => collected.has(item)); }
  function save() {
    localStorage.setItem(key, JSON.stringify({ collected: [...collected] }));
    localStorage.setItem(effectsKey, JSON.stringify(effects));
  }

  function renderMap() {
    sceneMap.innerHTML = "";
    data.scenes.forEach(scene => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = isDone(scene) ? "done" : "";
      button.innerHTML = `<b>${scene.name}</b><small>${isDone(scene) ? "证物已归档" : "等待案卷核验"}</small>`;
      button.onclick = () => openScene(scene.id);
      sceneMap.appendChild(button);
    });
  }

  function renderCodex() {
    const all = data.scenes.flatMap(scene => scene.rewards);
    codex.innerHTML = all.map(item => `<div class="${collected.has(item) ? "got" : ""}">${collected.has(item) ? item : "尚未归档的证物"}</div>`).join("");
  }

  function finishScene(scene) {
    scene.rewards.forEach(item => collected.add(item));
    effects[scene.effect] = true;
    save();
    note.textContent = `证物已归档：${scene.rewards.join("、")}。这份记录会留给后续卷宗。`;
    renderMap();
    renderCodex();
  }

  function showResult(scene, log, correct) {
    log.textContent = correct ? "核验通过。纸页边缘浮出一行未被抄录的字。" : "核验失败。墨迹没有回应这个判断。";
    log.classList.toggle("error", !correct);
    if (correct) setTimeout(() => finishScene(scene), 420);
  }

  function renderPuzzle(scene, host, log) {
    const puzzle = scene.puzzle;
    if (puzzle.type === "choice") {
      const choices = document.createElement("div");
      choices.className = "evidence-choice";
      puzzle.options.forEach(option => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = option;
        button.onclick = () => showResult(scene, log, option === puzzle.answer);
        choices.appendChild(button);
      });
      host.appendChild(choices);
      return;
    }

    if (puzzle.type === "sequence") {
      const sequence = [];
      const choices = document.createElement("div");
      choices.className = "evidence-sequence";
      puzzle.options.forEach(option => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = option;
        button.onclick = () => {
          if (button.classList.contains("selected")) {
            sequence.splice(sequence.indexOf(option), 1);
            button.classList.remove("selected");
          } else {
            sequence.push(option);
            button.classList.add("selected");
          }
        };
        choices.appendChild(button);
      });
      const submit = document.createElement("button");
      submit.type = "button";
      submit.className = "evidence-submit";
      submit.textContent = "提交复原";
      submit.onclick = () => showResult(scene, log, sequence.join("") === puzzle.answer);
      host.append(choices, submit);
      return;
    }

    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.setAttribute("aria-label", "输入核验内容");
    const submit = document.createElement("button");
    submit.type = "button";
    submit.className = "evidence-submit";
    submit.textContent = puzzle.type === "message" ? "封入纸中" : "提交核验";
    submit.onclick = () => {
      const value = normalize(input.value);
      if (puzzle.type === "message") {
        if (value.length < 6) { showResult(scene, log, false); return; }
        localStorage.setItem("zhirensha.explore.message", value);
        effects.message = value;
        showResult(scene, log, true);
        return;
      }
      showResult(scene, log, value === normalize(puzzle.answer));
    };
    input.addEventListener("keydown", event => { if (event.key === "Enter") submit.click(); });
    host.append(input, submit);
  }

  function openScene(id) {
    const scene = data.scenes.find(item => item.id === id);
    if (isDone(scene)) {
      stage.innerHTML = `<div class="scene-art" style="background-image:url('${imagePath(scene.image)}')"></div><div class="scene-sheet"><h3>${scene.name}</h3><p>${scene.intro}</p><p class="scene-log">证物已经归档。图像仍停在你核验完成的那一刻。</p></div>`;
      return;
    }
    stage.innerHTML = `<div class="scene-art" style="background-image:url('${imagePath(scene.image)}')"></div><div class="scene-sheet"><h3>${scene.name}</h3><p>${scene.intro}</p><p class="evidence-prompt">${scene.prompt}</p><div class="evidence-form"></div><p class="scene-log"></p></div>`;
    renderPuzzle(scene, stage.querySelector(".evidence-form"), stage.querySelector(".scene-log"));
  }

  function openModal() { modal.classList.add("show"); renderMap(); renderCodex(); }
  function closeModal() { modal.classList.remove("show"); entry.focus(); }
  entry.onclick = openModal;
  modal.querySelector(".explore-close").onclick = closeModal;
  window.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("show")) closeModal(); });

  renderMap();
  renderCodex();
})();
