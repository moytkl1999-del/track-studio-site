"use strict";

const STORAGE_KEY = "light-health-habits-v1";
const HABITS = [
  { id: "breakfast", icon: "🥣", title: "规律吃饭", detail: "吃一顿均衡的正餐" },
  { id: "movement", icon: "🚶", title: "活动一下", detail: "步行或拉伸 20 分钟" },
  { id: "vegetable", icon: "🥬", title: "蔬菜水果", detail: "给餐盘添一点颜色" },
  { id: "windDown", icon: "🌙", title: "准备休息", detail: "睡前减少刷屏" }
];

const RECIPES = [
  { id: "oats", meal: "breakfast", label: "早餐", icon: "🥣", title: "燕麦酸奶水果碗", meta: "约 10 分钟 · 纤维与蛋白质", ingredients: "原味燕麦、无糖酸奶或牛奶、香蕉或当季水果、一小把坚果。", steps: "燕麦加酸奶拌匀；放上切好的水果和坚果即可。", tip: "乳糖不耐受可换成无糖豆浆或植物酸奶。" },
  { id: "eggToast", meal: "breakfast", label: "早餐", icon: "🍳", title: "鸡蛋蔬菜全麦三明治", meta: "约 12 分钟 · 饱腹又方便", ingredients: "全麦面包、鸡蛋、生菜、番茄、少量牛油果或无糖酸奶。", steps: "鸡蛋煮熟或少油煎熟；与洗净的蔬菜夹入全麦面包。", tip: "可用豆腐或鹰嘴豆泥替换鸡蛋。" },
  { id: "chickenBowl", meal: "lunch", label: "午餐", icon: "🥗", title: "鸡胸肉杂粮蔬菜碗", meta: "约 20 分钟 · 主食、蛋白质、蔬菜", ingredients: "熟米饭或杂粮饭、鸡胸肉、青菜、胡萝卜、玉米粒。", steps: "鸡胸肉少油煎熟切片；蔬菜焯熟或清炒；和半碗杂粮饭一起装盘。", tip: "不必完全不吃主食，按饥饿程度调整饭量。" },
  { id: "tofuNoodles", meal: "lunch", label: "午餐", icon: "🍜", title: "番茄豆腐蔬菜面", meta: "约 18 分钟 · 清爽的家常午餐", ingredients: "番茄、嫩豆腐、青菜、全麦面或普通面、葱姜。", steps: "番茄炒出汁后加水煮开；加入豆腐、面和青菜煮熟。", tip: "少放油和盐，口味可用香菇、海带或胡椒增加层次。" },
  { id: "fishDinner", meal: "dinner", label: "晚餐", icon: "🐟", title: "清蒸鱼配时蔬", meta: "约 25 分钟 · 轻盈而有蛋白质", ingredients: "鱼块、时令绿叶菜、菌菇、少量米饭或红薯。", steps: "鱼加姜片蒸熟；蔬菜焯熟或清炒；搭配一份适量主食。", tip: "可用虾、鸡蛋或豆腐替代鱼类。" },
  { id: "tofuStirfry", meal: "dinner", label: "晚餐", icon: "🥘", title: "彩椒菌菇豆腐炒", meta: "约 15 分钟 · 植物蛋白晚餐", ingredients: "北豆腐、彩椒、菌菇、西兰花、蒜末。", steps: "豆腐煎至表面微黄；加入蔬菜快速翻炒，加少量生抽调味。", tip: "若运动量较大，可配半碗米饭或一小个红薯。" },
  { id: "yogurtSnack", meal: "snack", label: "加餐", icon: "🍓", title: "酸奶水果坚果杯", meta: "约 5 分钟 · 下午的温和加餐", ingredients: "无糖酸奶、草莓或苹果、少量原味坚果。", steps: "水果切块后拌入酸奶，撒上少量坚果。", tip: "加餐是为了减少过度饥饿，不需要吃到很饱。" },
  { id: "edamameSnack", meal: "snack", label: "加餐", icon: "🫛", title: "毛豆与小番茄", meta: "约 8 分钟 · 简单补充蛋白质", ingredients: "冷冻或新鲜毛豆、小番茄。", steps: "毛豆煮熟沥干；与洗净的小番茄一起食用。", tip: "注意少盐调味，口渴时优先喝水。" }
];

const defaultState = () => ({
  mode: "jyn",
  profile: { heightCm: 175, age: 27, targetWeight: 69.5, startWeight: 75 },
  today: { date: localDate(), weight: "", sleep: "", activity: "", water: 0, habits: {} },
  history: [],
  reminder: null
});

let state = loadState();
let reminderTimer = null;
let selectedMeal = "all";
let recipeOffset = 0;

const el = {
  todayLabel: document.querySelector("#todayLabel"), dayStatus: document.querySelector("#dayStatus"),
  waterRing: document.querySelector("#waterRing"), waterRingValue: document.querySelector("#waterRingValue"),
  waterText: document.querySelector("#waterText"), progressBar: document.querySelector("#progressBar"),
  progressMessage: document.querySelector("#progressMessage"), progressDetail: document.querySelector("#progressDetail"),
  weight: document.querySelector("#weightInput"), sleep: document.querySelector("#sleepInput"), activity: document.querySelector("#activityInput"),
  form: document.querySelector("#recordForm"), waterAdd: document.querySelector("#waterAdd"), waterSubtract: document.querySelector("#waterSubtract"),
  habits: document.querySelector("#habitList"), advice: document.querySelector("#adviceList"),
  reminderTime: document.querySelector("#reminderTime"), reminderStatus: document.querySelector("#reminderStatus"),
  scheduleReminder: document.querySelector("#scheduleReminder"), testReminder: document.querySelector("#testReminder"),
  historyEmpty: document.querySelector("#historyEmpty"), historyTableWrap: document.querySelector("#historyTableWrap"),
  historyBody: document.querySelector("#historyBody"), reset: document.querySelector("#resetButton"), toast: document.querySelector("#toast"),
  recipeList: document.querySelector("#recipeList"), recipeFilters: document.querySelector("#recipeFilters"),
  refreshRecipes: document.querySelector("#refreshRecipes"), recipeIntro: document.querySelector("#recipeIntro"),
  modeSwitch: document.querySelector("#modeSwitch"), jynPlan: document.querySelector("#jynPlan"),
  profileForm: document.querySelector("#profileForm"), height: document.querySelector("#heightInput"), age: document.querySelector("#ageInput"),
  targetWeight: document.querySelector("#targetWeightInput"), jynProfileSummary: document.querySelector("#jynProfileSummary"),
  currentBmi: document.querySelector("#currentBmi"), bmiStatus: document.querySelector("#bmiStatus"), monthGoal: document.querySelector("#monthGoal"),
  monthGoalDetail: document.querySelector("#monthGoalDetail"), targetGoal: document.querySelector("#targetGoal"), trainingLevel: document.querySelector("#trainingLevel"),
  trainingMetrics: document.querySelector("#trainingMetrics"), trainingRecommendation: document.querySelector("#trainingRecommendation")
};

function localDate(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return defaultState();
    const defaults = defaultState();
    if (saved.today?.date !== localDate()) saved.today = { ...defaults.today };
    return { ...defaults, ...saved, profile: { ...defaults.profile, ...saved.profile }, today: { ...defaults.today, ...saved.today } };
  } catch { return defaultState(); }
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => el.toast.classList.remove("show"), 2700);
}

function todayLabel() {
  return new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date());
}

function completedCount() {
  return Object.values(state.today.habits).filter(Boolean).length;
}

function recordCount() {
  return Number(state.today.weight !== "") + Number(state.today.sleep !== "") + Number(state.today.water > 0) + Number(completedCount() > 0);
}

function render() {
  el.todayLabel.textContent = todayLabel();
  el.weight.value = state.today.weight;
  el.sleep.value = state.today.sleep;
  el.activity.value = state.today.activity;
  const water = state.today.water;
  const waterPercent = Math.min(water / 8, 1);
  el.waterRing.style.background = `conic-gradient(var(--primary) ${waterPercent * 360}deg, #e7efe9 0deg)`;
  el.waterRingValue.textContent = water;
  el.waterText.textContent = `${water} / 8`;
  const total = recordCount();
  const percentage = total / 4;
  el.progressBar.style.width = `${percentage * 100}%`;
  el.progressDetail.textContent = `完成 ${total} / 4 项今日健康行动`;
  el.dayStatus.textContent = total === 4 ? "状态很好" : total >= 2 ? "稳步进行" : "刚开始";
  el.progressMessage.textContent = total === 4 ? "今天的记录和行动都完成了，继续保持这种温和的节奏。" : total >= 2 ? "你已经做得不错，选择下一件最容易完成的小事。" : "先喝一杯水，开启今天的健康节奏。";
  renderMode(); renderJynPersonalPlan(); renderHabits(); renderAdvice(); renderRecipes(); renderHistory(); renderReminderStatus();
}

function renderMode() {
  el.jynPlan.hidden = state.mode !== "jyn";
  el.modeSwitch.querySelectorAll("[data-mode]").forEach(button => button.classList.toggle("active", button.dataset.mode === state.mode));
}

function latestWeight() {
  const todayWeight = Number(state.today.weight);
  if (todayWeight > 0) return todayWeight;
  const historyWeight = state.history.find(record => Number(record.weight) > 0);
  return historyWeight ? Number(historyWeight.weight) : Number(state.profile.startWeight);
}

function bmiStatus(bmi) {
  if (bmi < 18.5) return "BMI 偏低，当前不建议继续减重";
  if (bmi < 24) return "BMI 在中国成人正常范围内";
  if (bmi < 28) return "BMI 属于中国成人超重范围";
  return "BMI 达到肥胖范围，建议结合专业评估";
}

function trendMessage() {
  const weights = state.history.filter(record => Number(record.weight) > 0).slice(0, 8);
  if (weights.length < 7) return "连续保存 7 天以上体重后，会显示更可靠的周趋势提醒。";
  const change = Number(weights[0].weight) - Number(weights[weights.length - 1].weight);
  if (change < -1) return `最近记录下降约 ${Math.abs(change).toFixed(1)} kg，速度偏快；不要继续减少餐量或突然加大运动。`;
  if (change <= -0.25) return `最近记录下降约 ${Math.abs(change).toFixed(1)} kg，保持当前节奏即可。`;
  return "近期趋势平稳；先检查 2 周饮食和运动完成度，再考虑每周增加少量步行时间。";
}

function renderJynPersonalPlan() {
  const height = Number(state.profile.heightCm);
  const age = Number(state.profile.age);
  const target = Number(state.profile.targetWeight);
  const weight = latestWeight();
  const bmi = weight / Math.pow(height / 100, 2);
  el.height.value = height; el.age.value = age; el.targetWeight.value = target;
  el.jynProfileSummary.textContent = `${height} cm · 最新体重 ${weight.toFixed(1)} kg · ${age} 岁 · 无健身房起步`;
  el.currentBmi.textContent = bmi.toFixed(1); el.bmiStatus.textContent = bmiStatus(bmi);
  el.targetGoal.textContent = `${target.toFixed(1)} kg`;
  if (bmi >= 24 && weight > target) {
    const lower = Math.max(target, weight - 3); const upper = Math.max(target, weight - 2);
    el.monthGoal.textContent = `${lower.toFixed(1)}–${upper.toFixed(1)} kg`;
    el.monthGoalDetail.textContent = "约减 2–3 kg，先建立可持续习惯";
  } else {
    el.monthGoal.textContent = "保持或微调";
    el.monthGoalDetail.textContent = "不因 BMI 单项数据强行加大减重";
  }
  let level; let plan;
  if (bmi < 18.5) {
    level = "暂停减重";
    plan = ["目前 BMI 偏低，不建议继续减重或限制饮食。应优先咨询医生或营养专业人员。", "如要运动，以轻松步行、拉伸和恢复性力量练习为主，不追求消耗。"];
  } else if (bmi < 24) {
    level = "体重维持";
    plan = ["BMI 已在正常范围内。优先改善体能和体脂，而不是继续大幅减体重。", "每周快走 150 分钟左右，加 2 次自重力量训练；饮食保持规律、不过度节食。"];
  } else if (bmi < 28) {
    level = "稳步减脂";
    plan = ["推荐本周完成 155–180 分钟中等强度快走，分散到 4–5 天；能说短句但呼吸明显加快即可。", "安排 2–3 次 25–30 分钟自重力量训练：深蹲、桌边俯卧撑、臀桥、平板支撑，每项 2 组起步。", "今天的训练优先级：先完成 30–40 分钟步行；不适合刚起步就跳绳、冲刺跑或每天高强度训练。"];
  } else {
    level = "低冲击起步";
    plan = ["先从每次 20–30 分钟快走或骑行开始，每周 4–5 天；优先低冲击运动，避免靠硬撑完成跳跃训练。", "力量训练从每周 2 次开始，使用靠墙俯卧撑、坐站深蹲和臀桥；每项 1–2 组，感觉关节不适就停止。", "若有血压、血糖、睡眠呼吸暂停、膝腰疼痛或正在用药，开始增加运动量前应先咨询医生。"];
  }
  const activity = Number(state.today.activity);
  if (!state.today.activity) plan.push("今天还没有记录运动分钟数；完成任意一次步行后填写它，计划会据此提醒你是否达标。");
  else if (activity < 20) plan.push(`今天已记录 ${activity} 分钟活动；如果身体感觉良好，可再补 10–20 分钟轻松步行。`);
  else plan.push(`今天已记录 ${activity} 分钟活动。注意补水、拉伸和睡眠，不需要为了数字额外加练。`);
  plan.push(trendMessage());
  el.trainingLevel.textContent = level;
  el.trainingMetrics.textContent = `按最新体重 ${weight.toFixed(1)} kg、身高 ${height} cm 计算：BMI ${bmi.toFixed(1)}。保存每日体重、睡眠和运动分钟后，会持续更新。`;
  el.trainingRecommendation.innerHTML = plan.map(item => `<li>${item}</li>`).join("");
}

function renderHabits() {
  el.habits.innerHTML = HABITS.map(habit => {
    const done = Boolean(state.today.habits[habit.id]);
    return `<button class="habit ${done ? "done" : ""}" type="button" data-habit="${habit.id}" aria-pressed="${done}">
      <span class="habit-icon">${habit.icon}</span><strong>${habit.title}</strong><small>${done ? "已完成 ✓" : habit.detail}</small>
    </button>`;
  }).join("");
}

function adviceItems() {
  const advice = [];
  const sleep = Number(state.today.sleep);
  if (state.mode === "jyn") advice.push("JYN 首月先以规律饮食、每周步行和自重力量训练为主；看每周平均体重，不追求单日快速下降。");
  if (!state.today.sleep) advice.push("记录昨晚的睡眠时长，可以更容易发现自己的作息规律。");
  else if (sleep < 7) advice.push("昨晚睡眠不足 7 小时，今天安排温和活动，并尽量提前放下手机休息。");
  else if (sleep <= 9) advice.push("睡眠时长不错。规律的作息比偶尔补觉更能帮助身体恢复。");
  else advice.push("睡眠较长。如果持续感到疲惫或作息变化明显，可以关注自己的精神状态并咨询专业人士。");
  if (state.today.water < 4) advice.push(`今天已记录 ${state.today.water} 杯水。现在喝一杯，之后每隔一段时间补充一次即可。`);
  else if (state.today.water < 8) advice.push(`距离 8 杯的小目标还差 ${8 - state.today.water} 杯，慢慢补足，不必一次喝很多。`);
  else advice.push("今天的喝水目标已经完成。出汗多或天气炎热时，可根据身体感觉适当补充水分。");
  if (!state.today.habits.movement) advice.push("如果久坐较多，试试散步、拉伸或轻度家务。短暂活动也很有价值。");
  else advice.push("已经完成活动打卡。循序渐进比突然进行高强度运动更容易坚持。");
  if (state.today.activity && Number(state.today.activity) < 20) advice.push("今天记录的活动时间较短，晚饭后补一段轻松步行会比高强度突击更容易坚持。");
  if (!state.today.habits.vegetable) advice.push("下一餐可以加一份蔬菜或水果，并优先选择少糖饮料和清淡烹调方式。");
  return advice.slice(0, 4);
}

function renderAdvice() { el.advice.innerHTML = adviceItems().map(item => `<li>${item}</li>`).join(""); }

function renderRecipes() {
  const candidates = RECIPES.filter(recipe => selectedMeal === "all" || recipe.meal === selectedMeal);
  const displayed = candidates.map((_, index) => candidates[(index + recipeOffset) % candidates.length]).slice(0, Math.min(3, candidates.length));
  if (Number(state.today.sleep) > 0 && Number(state.today.sleep) < 7) el.recipeIntro.textContent = "昨晚休息较少，优先选择准备简单、蛋白质和蔬菜兼顾的餐食。";
  else if (state.today.water < 4) el.recipeIntro.textContent = "今天喝水记录较少；进餐时可以配水或清淡汤品，慢慢补充水分。";
  else el.recipeIntro.textContent = "选择一份做起来不费劲的均衡餐食：有主食、蛋白质和蔬菜就很好。";
  el.recipeList.innerHTML = displayed.map(recipe => `<article class="recipe">
    <div class="recipe-topline"><span class="recipe-icon" aria-hidden="true">${recipe.icon}</span><span class="meal-badge">${recipe.label}</span></div>
    <h3>${recipe.title}</h3><p class="recipe-meta">${recipe.meta}</p>
    <details><summary>查看食材和做法</summary><p><strong>食材：</strong>${recipe.ingredients}</p><p><strong>做法：</strong>${recipe.steps}</p><p class="recipe-tip"><strong>替换提示：</strong>${recipe.tip}</p></details>
  </article>`).join("");
  el.recipeFilters.querySelectorAll("[data-meal]").forEach(button => button.classList.toggle("active", button.dataset.meal === selectedMeal));
}

function renderHistory() {
  const rows = state.history.slice(0, 7);
  el.historyEmpty.hidden = rows.length > 0;
  el.historyTableWrap.hidden = rows.length === 0;
  el.historyBody.innerHTML = rows.map(row => `<tr><td>${formatDate(row.date)}</td><td>${row.weight ? `${row.weight} kg` : "—"}</td><td>${row.sleep ? `${row.sleep} 小时` : "—"}</td><td>${row.activity ? `${row.activity} 分钟` : "—"}</td><td>${row.water} 杯</td></tr>`).join("");
}

function formatDate(value) { return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(new Date(`${value}T12:00:00`)); }

function saveTodayToHistory() {
  const record = { date: state.today.date, weight: state.today.weight, sleep: state.today.sleep, activity: state.today.activity, water: state.today.water };
  state.history = [record, ...state.history.filter(item => item.date !== record.date)].sort((a, b) => b.date.localeCompare(a.date));
}

function saveCurrentHistoryIfPresent() {
  if (state.history.some(record => record.date === state.today.date)) saveTodayToHistory();
  saveState();
}

function renderReminderStatus() {
  if (!state.reminder) { el.reminderStatus.textContent = "尚未设置提醒。"; return; }
  const time = new Date(state.reminder.at);
  if (time <= new Date()) { el.reminderStatus.textContent = "上次提醒时间已过，可重新设置。"; return; }
  el.reminderStatus.textContent = `已设置：${time.toLocaleString("zh-CN", { hour: "2-digit", minute: "2-digit" })} 提醒喝水（请保持网页打开）。`;
}

function prepareNotificationPermission() {
  if (!("Notification" in window)) return;
  // Permission needs to be requested directly from a user click, not from a delayed timer.
  if (Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission !== "granted") showToast("未允许浏览器通知，到点时仍会在页面内显示提醒。");
    });
  }
}

function requestAndNotify() {
  const title = "轻养成提醒";
  const body = "喝一杯水，起身活动一下吧。";
  if ("Notification" in window && Notification.permission === "granted") new Notification(title, { body });
  showToast("提醒时间到了：喝一杯水，活动一下吧。");
  state.reminder = null; saveState(); renderReminderStatus();
}

function scheduleAt(date) {
  clearTimeout(reminderTimer);
  state.reminder = { at: date.toISOString() }; saveState(); renderReminderStatus();
  reminderTimer = setTimeout(requestAndNotify, Math.max(0, date.getTime() - Date.now()));
}

function scheduleSavedReminder() {
  if (!state.reminder) return;
  const date = new Date(state.reminder.at);
  if (date > new Date()) scheduleAt(date);
}

el.form.addEventListener("submit", event => {
  event.preventDefault();
  state.today.weight = el.weight.value.trim();
  state.today.sleep = el.sleep.value.trim();
  state.today.activity = el.activity.value.trim();
  saveTodayToHistory(); saveState(); render(); showToast("今日记录已保存。");
});
el.waterAdd.addEventListener("click", () => { state.today.water = Math.min(20, state.today.water + 1); saveCurrentHistoryIfPresent(); render(); });
el.waterSubtract.addEventListener("click", () => { state.today.water = Math.max(0, state.today.water - 1); saveCurrentHistoryIfPresent(); render(); });
el.habits.addEventListener("click", event => {
  const button = event.target.closest("[data-habit]"); if (!button) return;
  const id = button.dataset.habit; state.today.habits[id] = !state.today.habits[id]; saveCurrentHistoryIfPresent(); render();
});
el.modeSwitch.addEventListener("click", event => {
  const button = event.target.closest("[data-mode]"); if (!button) return;
  state.mode = button.dataset.mode; saveState(); render();
});
el.profileForm.addEventListener("submit", event => {
  event.preventDefault();
  state.profile.heightCm = Number(el.height.value);
  state.profile.age = Number(el.age.value);
  state.profile.targetWeight = Number(el.targetWeight.value);
  saveState(); render(); showToast("JYN 个人数据已更新，训练建议已重新计算。");
});
el.recipeFilters.addEventListener("click", event => {
  const button = event.target.closest("[data-meal]"); if (!button) return;
  selectedMeal = button.dataset.meal; recipeOffset = 0; renderRecipes();
});
el.refreshRecipes.addEventListener("click", () => { recipeOffset += 3; renderRecipes(); });
el.scheduleReminder.addEventListener("click", () => {
  if (!el.reminderTime.value) { showToast("请先选择一个提醒时间。"); return; }
  const [hours, minutes] = el.reminderTime.value.split(":").map(Number);
  const scheduled = new Date(); scheduled.setHours(hours, minutes, 0, 0);
  if (scheduled <= new Date()) scheduled.setDate(scheduled.getDate() + 1);
  prepareNotificationPermission(); scheduleAt(scheduled); showToast("提醒已设置。请保持网页打开以进行测试。");
});
el.testReminder.addEventListener("click", () => { prepareNotificationPermission(); scheduleAt(new Date(Date.now() + 60_000)); showToast("将在 1 分钟后提醒。请保持网页打开。 "); });
el.reset.addEventListener("click", () => {
  if (!window.confirm("确定清空本浏览器中保存的全部健康记录吗？此操作不能恢复。")) return;
  clearTimeout(reminderTimer); localStorage.removeItem(STORAGE_KEY); state = defaultState(); render(); showToast("本地记录已清空。");
});

render(); scheduleSavedReminder();
