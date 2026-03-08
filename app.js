const STORAGE_KEY = "efficio-lion-planner-v1";

const DAILY_TIMES = [
  "6a", "7a", "8a", "9a", "10a", "11a", "12p", "1p",
  "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p",
];

const DEFAULT_PROFESSIONAL = [
  "Trimble onboarding tasks",
  "Partner management (QBRs, Corpay, ADP, EarlyTrade)",
  "New opportunities and AI prompt ideas",
];

const DEFAULT_PERSONAL = [
  "Best husband and father",
  "Walk Maverick",
  "Family time",
  "Household or investments",
  "Coaching baseball",
  "Podcast planning",
  "Other personal tasks",
];

const WELLNESS_CATALOG = [
  ["Physical", "Workout"],
  ["Physical", "Cold plunge"],
  ["Physical", "Walk or run"],
  ["Physical", "Biking"],
  ["Physical", "Scootering"],
  ["Mental", "Meditation"],
  ["Mental", "Neurofeedback"],
  ["Mental", "AI workflows"],
  ["Mental", "Creating or writing"],
  ["Creative", "Inventing"],
  ["Creative", "Darts"],
  ["Creative", "Wiffle ball"],
  ["Creative", "Redbull"],
  ["Creative", "Showering"],
  ["Entrepreneurial", "Working"],
  ["Entrepreneurial", "Entrepreneurial habits"],
  ["Entrepreneurial", "Stand up for what's right"],
];

const BUDGET_CATEGORIES = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Medical & Healthcare",
  "Savings & Debt",
  "Personal Spending",
  "Recreation & Entertainment",
  "Miscellaneous",
];

const AREA_OPTIONS = [
  "Career",
  "Health",
  "Personal development",
  "Relationships",
  "Finances",
];

const RANKS = [
  "Cub in Training",
  "Trail Runner",
  "Momentum Hunter",
  "Focus Guardian",
  "Arena Builder",
  "Lion Commander",
];

const uid = () => Math.random().toString(36).slice(2, 10);
const todayIso = () => new Date().toISOString().slice(0, 10);
const monthKeyFromDate = (date) => date.slice(0, 7);
const prettyDate = (date) =>
  new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
const escapeHtml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function makeDay(date) {
  return {
    date,
    topSignals: Array.from({ length: 5 }, () => ""),
    objective: "",
    keyResults: "",
    metricTarget: "",
    schedule: DAILY_TIMES.map((time) => ({ time, task: "", done: false })),
    professional: DEFAULT_PROFESSIONAL.map((text) => ({
      id: uid(),
      text,
      done: false,
      notes: "",
    })),
    personal: DEFAULT_PERSONAL.map((text) => ({
      id: uid(),
      text,
      done: false,
      notes: "",
    })),
    wellness: WELLNESS_CATALOG.map(([category, habit]) => ({
      id: uid(),
      category,
      habit,
      done: false,
      notes: "",
    })),
    frequencyAlignment: 50,
    restHours: 8,
    resourceChecklist: {
      streamDeck: "",
      apps: "",
      tools: "",
    },
    mindMap: "",
    notes: "",
    reflection: {
      wentWell: "",
      improve: "",
      gratitude: "",
      rating: 7,
    },
  };
}

function makeBudget(month) {
  return {
    month,
    rows: BUDGET_CATEGORIES.map((category) => ({
      id: uid(),
      category,
      budget: "",
      actual: "",
    })),
    notes: "",
  };
}

function makeGoal() {
  return {
    id: uid(),
    title: "",
    area: "Career",
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timeBound: "",
    progress: 0,
    notes: "",
    steps: [
      { id: uid(), text: "", done: false },
      { id: uid(), text: "", done: false },
    ],
  };
}

function makeMeeting(type = "General Meeting") {
  return {
    id: uid(),
    type,
    date: todayIso(),
    time: "",
    attendees: "",
    agenda: "",
    discussion: "",
    notes: "",
    actionItems: [
      { id: uid(), item: "", owner: "", due: "", done: false },
    ],
  };
}

function makeContact() {
  return {
    id: uid(),
    name: "",
    role: "",
    organization: "",
    contactInfo: "",
    relationship: "",
    notes: "",
  };
}

function makeMonthlyContract(month) {
  return {
    month,
    commitment: "Today I commit to my best self.",
    signature: "",
    date: month ? `${month}-01` : "",
  };
}

function defaultState() {
  const date = todayIso();
  const month = monthKeyFromDate(date);
  return {
    activeDate: date,
    monthlyContracts: {
      [month]: makeMonthlyContract(month),
    },
    days: {
      [date]: makeDay(date),
    },
    goals: [
      {
        ...makeGoal(),
        title: "Lead a lion-level workday",
        area: "Career",
        specific: "Protect the top 3 signals and finish one important outcome before noon.",
        measurable: "4 focused workdays each week.",
        achievable: "Use the daily schedule and shut down distractions.",
        relevant: "Improves consistency and lowers overwhelm.",
        timeBound: month,
        progress: 45,
      },
    ],
    budgets: {
      [month]: makeBudget(month),
    },
    meetings: [],
    contacts: [],
    importStamp: null,
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeChecklistItems(items, fallbackFactory) {
  const source = Array.isArray(items) ? items : [];
  if (!source.length) return [];
  return source.map((item) => ({
    ...fallbackFactory(),
    ...item,
    id: item?.id || uid(),
    text: String(item?.text || ""),
    notes: String(item?.notes || ""),
    done: Boolean(item?.done),
  }));
}

function normalizeGoalSteps(steps) {
  const source = Array.isArray(steps) ? steps : [];
  return source.length
    ? source.map((step) => ({
        id: step?.id || uid(),
        text: String(step?.text || ""),
        done: Boolean(step?.done),
      }))
    : clone(makeGoal().steps);
}

function normalizeActionItems(items) {
  const source = Array.isArray(items) ? items : [];
  return source.length
    ? source.map((item) => ({
        id: item?.id || uid(),
        item: String(item?.item || ""),
        owner: String(item?.owner || ""),
        due: String(item?.due || ""),
        done: Boolean(item?.done),
      }))
    : clone(makeMeeting().actionItems);
}

function normalizeSchedule(schedule) {
  const source = Array.isArray(schedule) ? schedule : [];
  return DAILY_TIMES.map((time, index) => ({
    time,
    task: String(source[index]?.task || ""),
    done: Boolean(source[index]?.done),
  }));
}

function normalizeWellness(wellness) {
  const source = Array.isArray(wellness) ? wellness : [];
  return WELLNESS_CATALOG.map(([category, habit], index) => ({
    id: source[index]?.id || uid(),
    category,
    habit,
    done: Boolean(source[index]?.done),
    notes: String(source[index]?.notes || ""),
  }));
}

function normalizeDay(dayInput, date) {
  const fallback = makeDay(date);
  const day = dayInput || {};
  return {
    ...fallback,
    ...day,
    date,
    topSignals: Array.from({ length: 5 }, (_, index) => String(day.topSignals?.[index] || "")),
    objective: String(day.objective || ""),
    keyResults: String(day.keyResults || ""),
    metricTarget: String(day.metricTarget || ""),
    schedule: normalizeSchedule(day.schedule),
    professional: normalizeChecklistItems(day.professional, () => ({ id: uid(), text: "", done: false, notes: "" })),
    personal: normalizeChecklistItems(day.personal, () => ({ id: uid(), text: "", done: false, notes: "" })),
    wellness: normalizeWellness(day.wellness),
    frequencyAlignment: Math.max(0, Math.min(100, Number(day.frequencyAlignment ?? fallback.frequencyAlignment) || 0)),
    restHours: Math.max(0, Number(day.restHours ?? fallback.restHours) || 0),
    resourceChecklist: {
      streamDeck: String(day.resourceChecklist?.streamDeck || ""),
      apps: String(day.resourceChecklist?.apps || ""),
      tools: String(day.resourceChecklist?.tools || ""),
    },
    mindMap: String(day.mindMap || ""),
    notes: String(day.notes || ""),
    reflection: {
      wentWell: String(day.reflection?.wentWell || ""),
      improve: String(day.reflection?.improve || ""),
      gratitude: String(day.reflection?.gratitude || ""),
      rating: Math.max(1, Math.min(10, Number(day.reflection?.rating ?? fallback.reflection.rating) || fallback.reflection.rating)),
    },
  };
}

function normalizeBudget(budgetInput, month) {
  const fallback = makeBudget(month);
  const rowsByCategory = new Map(
    (Array.isArray(budgetInput?.rows) ? budgetInput.rows : []).map((row) => [row?.category, row]),
  );
  return {
    ...fallback,
    ...budgetInput,
    month,
    rows: BUDGET_CATEGORIES.map((category) => {
      const row = rowsByCategory.get(category) || {};
      return {
        id: row.id || uid(),
        category,
        budget: row.budget ?? "",
        actual: row.actual ?? "",
      };
    }),
    notes: String(budgetInput?.notes || ""),
  };
}

function normalizeGoal(goalInput) {
  const fallback = makeGoal();
  const goal = goalInput || {};
  return {
    ...fallback,
    ...goal,
    id: goal.id || uid(),
    title: String(goal.title || ""),
    area: AREA_OPTIONS.includes(goal.area) ? goal.area : fallback.area,
    specific: String(goal.specific || ""),
    measurable: String(goal.measurable || ""),
    achievable: String(goal.achievable || ""),
    relevant: String(goal.relevant || ""),
    timeBound: String(goal.timeBound || ""),
    progress: Math.max(0, Math.min(100, Number(goal.progress ?? fallback.progress) || 0)),
    notes: String(goal.notes || ""),
    steps: normalizeGoalSteps(goal.steps),
  };
}

function normalizeMeeting(meetingInput) {
  const fallback = makeMeeting(meetingInput?.type);
  const meeting = meetingInput || {};
  return {
    ...fallback,
    ...meeting,
    id: meeting.id || uid(),
    type: String(meeting.type || fallback.type),
    date: String(meeting.date || todayIso()),
    time: String(meeting.time || ""),
    attendees: String(meeting.attendees || ""),
    agenda: String(meeting.agenda || ""),
    discussion: String(meeting.discussion || ""),
    notes: String(meeting.notes || ""),
    actionItems: normalizeActionItems(meeting.actionItems),
  };
}

function normalizeContact(contactInput) {
  const fallback = makeContact();
  const contact = contactInput || {};
  return {
    ...fallback,
    ...contact,
    id: contact.id || uid(),
    name: String(contact.name || ""),
    role: String(contact.role || ""),
    organization: String(contact.organization || ""),
    contactInfo: String(contact.contactInfo || ""),
    relationship: String(contact.relationship || ""),
    notes: String(contact.notes || ""),
  };
}

function normalizeMonthlyContract(contractInput, month) {
  const fallback = makeMonthlyContract(month);
  const contract = contractInput || {};
  return {
    ...fallback,
    ...contract,
    month,
    commitment: String(contract.commitment || fallback.commitment),
    signature: String(contract.signature || ""),
    date: String(contract.date || fallback.date),
  };
}

function normalizeState(input = {}) {
  const base = defaultState();
  const activeDate = typeof input.activeDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.activeDate)
    ? input.activeDate
    : base.activeDate;
  const activeMonth = monthKeyFromDate(activeDate);
  const normalizedDays = Object.fromEntries(
    Object.entries(input.days || {}).map(([date, day]) => [date, normalizeDay(day, date)]),
  );
  const normalizedBudgets = Object.fromEntries(
    Object.entries(input.budgets || {}).map(([month, budget]) => [month, normalizeBudget(budget, month)]),
  );
  const normalizedContracts = Object.fromEntries(
    Object.entries(input.monthlyContracts || {}).map(([month, contract]) => [month, normalizeMonthlyContract(contract, month)]),
  );

  if (!normalizedDays[activeDate]) normalizedDays[activeDate] = normalizeDay(null, activeDate);
  if (!normalizedBudgets[activeMonth]) normalizedBudgets[activeMonth] = normalizeBudget(null, activeMonth);
  if (!normalizedContracts[activeMonth]) normalizedContracts[activeMonth] = normalizeMonthlyContract(null, activeMonth);

  return {
    ...base,
    ...input,
    activeDate,
    monthlyContracts: normalizedContracts,
    days: normalizedDays,
    goals: (Array.isArray(input.goals) ? input.goals : base.goals).map(normalizeGoal),
    budgets: normalizedBudgets,
    meetings: (Array.isArray(input.meetings) ? input.meetings : base.meetings).map(normalizeMeeting),
    contacts: (Array.isArray(input.contacts) ? input.contacts : base.contacts).map(normalizeContact),
    importStamp: input.importStamp || null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizeState();
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return normalizeState();
  }
}

function saveState() {
  state = normalizeState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveMeta.lastSavedAt = new Date().toISOString();
  saveMeta.lastError = "";
}

function ensureDay(appState, date) {
  if (!appState.days[date]) {
    appState.days[date] = makeDay(date);
  }
  appState.activeDate = date;
  return appState.days[date];
}

function ensureBudget(appState, month) {
  if (!appState.budgets[month]) {
    appState.budgets[month] = makeBudget(month);
  }
  return appState.budgets[month];
}

function ensureMonthlyContract(appState, month) {
  if (!appState.monthlyContracts[month]) {
    appState.monthlyContracts[month] = makeMonthlyContract(month);
  }
  return appState.monthlyContracts[month];
}

function updateAndRender(mutator) {
  mutator();
  saveState();
  render();
}

function persistOnly(mutator) {
  mutator();
  saveState();
}

function percent(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

function filledCount(values) {
  return values.filter((item) => String(item || "").trim()).length;
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function currentDay() {
  return ensureDay(state, state.activeDate);
}

function currentMonth() {
  return monthKeyFromDate(state.activeDate);
}

function currentBudget() {
  return ensureBudget(state, currentMonth());
}

function currentContract() {
  return ensureMonthlyContract(state, currentMonth());
}

function computeStats() {
  const day = currentDay();
  const budget = currentBudget();

  const topSignalsDone = filledCount(day.topSignals);
  const scheduleDone = day.schedule.filter((slot) => slot.done).length;
  const schedulePlanned = day.schedule.filter((slot) => slot.task.trim()).length;
  const professionalDone = day.professional.filter((item) => item.done).length;
  const personalDone = day.personal.filter((item) => item.done).length;
  const wellnessDone = day.wellness.filter((item) => item.done).length;
  const goalProgressAverage = state.goals.length
    ? Math.round(sum(state.goals.map((goal) => Number(goal.progress) || 0)) / state.goals.length)
    : 0;
  const goalStepsDone = state.goals.flatMap((goal) => goal.steps).filter((step) => step.done).length;
  const reflectionFields = [
    day.reflection.wentWell,
    day.reflection.improve,
    day.reflection.gratitude,
  ];
  const reflectionDone = filledCount(reflectionFields);
  const meetingActionsOpen = state.meetings.flatMap((meeting) => meeting.actionItems).filter((item) => item.item.trim() && !item.done).length;
  const meetingsThisMonth = state.meetings.filter((meeting) => meeting.date.startsWith(currentMonth())).length;
  const contactsCount = state.contacts.filter((contact) => contact.name.trim()).length;
  const budgetRows = budget.rows.map((row) => ({
    ...row,
    budget: Number(row.budget) || 0,
    actual: Number(row.actual) || 0,
  }));
  const budgetTotal = sum(budgetRows.map((row) => row.budget));
  const actualTotal = sum(budgetRows.map((row) => row.actual));
  const varianceTotal = budgetTotal - actualTotal;
  const dayCompletion = percent(
    topSignalsDone + scheduleDone + professionalDone + personalDone + wellnessDone + reflectionDone,
    5 + day.schedule.length + day.professional.length + day.personal.length + day.wellness.length + 3,
  );
  const xp =
    topSignalsDone * 8 +
    scheduleDone * 5 +
    professionalDone * 10 +
    personalDone * 9 +
    wellnessDone * 6 +
    reflectionDone * 12 +
    goalStepsDone * 10 +
    Math.round(goalProgressAverage / 2) +
    meetingsThisMonth * 14 +
    contactsCount * 6;
  const level = Math.floor(xp / 150) + 1;
  const rank = RANKS[Math.min(RANKS.length - 1, Math.floor((level - 1) / 2))];
  const nextLevelXp = level * 150;
  const levelProgress = percent(xp - (level - 1) * 150, 150);

  let streak = 0;
  const dates = Object.keys(state.days).sort().reverse();
  let cursor = new Date(`${todayIso()}T12:00:00`);
  for (const key of dates) {
    const dayEntry = state.days[key];
    const score = scoreDay(dayEntry);
    if (key === cursor.toISOString().slice(0, 10) && score >= 35) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const achievements = [
    topSignalsDone >= 3 ? "Signal Keeper" : null,
    scheduleDone >= 8 ? "Clock Tamer" : null,
    wellnessDone >= 5 ? "Flow Protector" : null,
    goalProgressAverage >= 70 ? "Vision Closer" : null,
    varianceTotal >= 0 && actualTotal > 0 ? "Budget Guardian" : null,
    streak >= 3 ? "Streak Roarer" : null,
  ].filter(Boolean);

  return {
    dayCompletion,
    schedulePlanned,
    scheduleDone,
    topSignalsDone,
    professionalDone,
    personalDone,
    wellnessDone,
    goalProgressAverage,
    meetingActionsOpen,
    meetingsThisMonth,
    contactsCount,
    budgetTotal,
    actualTotal,
    varianceTotal,
    xp,
    level,
    rank,
    nextLevelXp,
    levelProgress,
    streak,
    achievements,
  };
}

function scoreDay(day) {
  return (
    filledCount(day.topSignals) * 6 +
    day.schedule.filter((slot) => slot.done).length * 4 +
    day.professional.filter((item) => item.done).length * 7 +
    day.personal.filter((item) => item.done).length * 6 +
    day.wellness.filter((item) => item.done).length * 4 +
    filledCount([day.reflection.wentWell, day.reflection.improve, day.reflection.gratitude]) * 8
  );
}

let state = loadState();
const saveMeta = {
  lastSavedAt: null,
  lastError: "",
};

function saveStatusMarkup() {
  const label = saveMeta.lastError
    ? "Save issue"
    : saveMeta.lastSavedAt
      ? "Saved locally"
      : "Local browser storage";
  const detail = saveMeta.lastError
    ? saveMeta.lastError
    : saveMeta.lastSavedAt
      ? `Last saved ${new Date(saveMeta.lastSavedAt).toLocaleString()}. Visible only in this browser unless you export or deploy changes.`
      : "This planner stores data only in this browser. Export JSON or deploy updated files if you want changes to appear elsewhere.";
  return `
    <div class="save-status ${saveMeta.lastError ? "error" : ""}">
      <strong>${label}</strong>
      <span>${escapeHtml(detail)}</span>
    </div>
  `;
}

function render() {
  const day = currentDay();
  const month = currentMonth();
  const budget = currentBudget();
  const contract = currentContract();
  const stats = computeStats();

  document.querySelector("#app").innerHTML = `
    <div class="shell">
      <section class="hero">
        <div class="panel hero-copy">
          <div class="eyebrow">Efficio Lion Planner</div>
          <div class="hero-headline">
            <h1>Focused. Fierce. Fulfilled.</h1>
            <div class="hero-date-pill">${prettyDate(state.activeDate)}</div>
          </div>
          <p>
            A cleaner command center for daily execution: priorities, flow, meetings, money, and reflection
            aligned in one place so the next right move is obvious.
          </p>
          <div class="hero-lead-grid">
            ${heroLeadCard("Signals locked", `${stats.topSignalsDone}/5`, "Top priorities captured for the day")}
            ${heroLeadCard("Open actions", `${stats.meetingActionsOpen}`, "Meeting follow-through still in motion")}
            ${heroLeadCard("Achievements", `${stats.achievements.length}`, "Momentum badges unlocked this cycle")}
          </div>
          <div class="hero-actions">
            <button class="primary" data-action="jump" data-target="today">Enter today's plan</button>
            <button class="secondary" data-action="jump" data-target="goals">Review goals</button>
            <button class="secondary" data-action="jump" data-target="budget">Check budget</button>
          </div>
        </div>
        <div class="hero-sidebar">
          <div class="rank-card">
            <div class="splitline">
              <div>
                <small>Current rank</small>
                <h2>${stats.rank}</h2>
              </div>
              <div class="pill">Level ${stats.level}</div>
            </div>
            <p class="tagline">XP rises when you plan, finish, reflect, and stay in motion.</p>
            <div class="rank-meta">
              <div class="stat-chip"><small>XP</small><strong>${stats.xp}</strong></div>
              <div class="stat-chip"><small>Streak</small><strong>${stats.streak}d</strong></div>
              <div class="stat-chip"><small>Today</small><strong>${stats.dayCompletion}%</strong></div>
            </div>
            <div class="helper">${Math.max(0, stats.nextLevelXp - stats.xp)} XP until next level</div>
            <div class="progress"><span style="width:${stats.levelProgress}%"></span></div>
          </div>
          <div class="panel toolbar">
            <div class="toolbar-header">
              <div>
                <div class="eyebrow toolbar-eyebrow">Firmament Control Panel</div>
                <h3>Steer the planner from one clean command deck.</h3>
              </div>
              <div class="pill toolbar-pill">Live view: ${prettyDate(state.activeDate)}</div>
            </div>
            <div class="toolbar-grid">
              <div class="toolbar-card">
                <small>Planner day</small>
                <label for="active-date">Focus the daily board</label>
                <input id="active-date" type="date" value="${state.activeDate}" />
                <div class="helper">Switch the execution view without losing saved progress.</div>
              </div>
              <div class="toolbar-card">
                <small>Budget month</small>
                <label for="active-month">Shift the financial lens</label>
                <input id="active-month" type="month" value="${month}" />
                <div class="helper">Jump between contracts, budgets, and the matching month context.</div>
              </div>
            </div>
            <div class="toolbar-actions toolbar-actions-panel">
              <button class="secondary" data-action="export">Export JSON</button>
              <button class="secondary" data-action="import">Import JSON</button>
              <input id="import-file" type="file" accept="application/json" hidden />
            </div>
            ${saveStatusMarkup()}
          </div>
        </div>
      </section>

      <section class="metric-grid">
        ${metricCard("Momentum score", `${stats.dayCompletion}%`, `${stats.scheduleDone}/${Math.max(stats.schedulePlanned, 1)} planned blocks completed`, "Today")}
        ${metricCard("Wellness flow", `${stats.wellnessDone}/${day.wellness.length}`, `${day.restHours}h rest, alignment ${day.frequencyAlignment}%`, "Energy")}
        ${metricCard("Goal velocity", `${stats.goalProgressAverage}%`, `${state.goals.length} active goals, ${state.goals.flatMap((goal) => goal.steps).filter((step) => step.done).length} steps done`, "Progress")}
        ${metricCard("Budget variance", currency(stats.varianceTotal), `${currency(stats.actualTotal)} spent of ${currency(stats.budgetTotal)} planned`, "Money")}
      </section>

      <div class="layout">
        <nav class="panel nav">
          <div class="nav-header">
            <div>
              <h3>Planner Map</h3>
              <small>Move through the system without hunting for the next section.</small>
            </div>
            <div class="nav-badge">Day ${stats.dayCompletion}%</div>
          </div>
          <div class="nav-stack">
            ${navLink("contract", "Monthly contract", contract.signature ? "ready" : "open")}
            ${navLink("today", "Daily execution", `${stats.dayCompletion}%`)}
            ${navLink("priorities", "Professional + personal", `${stats.professionalDone + stats.personalDone} done`)}
            ${navLink("wellness", "Wellness + flow", `${stats.wellnessDone}`)}
            ${navLink("mindmap", "Mind map + reflection", `${day.reflection.rating}/10`)}
            ${navLink("goals", "Goals + vision", `${state.goals.length}`)}
            ${navLink("budget", "Budget tracker", currency(stats.varianceTotal))}
            ${navLink("meetings", "Meeting templates", `${stats.meetingsThisMonth}`)}
            ${navLink("contacts", "Contacts + stakeholders", `${stats.contactsCount}`)}
            ${navLink("insights", "Achievements", `${stats.achievements.length}`)}
          </div>
        </nav>

        <main class="content">
          <section id="contract" class="panel section">
            <div class="section-header">
              <div>
                <h2>Monthly Foreword & Self Contract</h2>
                <small>Page 2 of the planner, converted into a reusable monthly commitment ritual.</small>
              </div>
              <div class="pill">${month}</div>
            </div>
            <div class="subgrid">
              <div class="stack">
                <div class="mini-card">
                  <h4>Commitment</h4>
                  <textarea data-bind="monthlyContracts.${month}.commitment">${escapeHtml(contract.commitment)}</textarea>
                </div>
                <div class="field-row compact">
                  <div class="field">
                    <label>Signature</label>
                    <input data-bind="monthlyContracts.${month}.signature" value="${escapeHtml(contract.signature)}" />
                  </div>
                  <div class="field">
                    <label>Date</label>
                    <input type="date" data-bind="monthlyContracts.${month}.date" value="${contract.date}" />
                  </div>
                </div>
              </div>
              <div class="mini-card">
                <h4>Arena reminder</h4>
                <p class="tagline">
                  You do not need a perfect streak. You need a system that makes it easier to re-enter the arena.
                  Use this contract as your monthly reset when attention slips.
                </p>
                <div class="helper">Signed contracts help unlock the “Arena Builder” rank faster because they anchor the month.</div>
              </div>
            </div>
          </section>

          <section id="today" class="panel section">
            <div class="section-header">
              <div>
                <h2>Daily Execution Guide</h2>
                <small>${prettyDate(state.activeDate)}</small>
              </div>
              <div class="pill">${stats.topSignalsDone}/5 top signals locked</div>
            </div>
            <div class="subgrid">
              <div class="stack">
                <div class="mini-card">
                  <h4>Top Signals</h4>
                  <div class="stack">
                    ${day.topSignals.map((signal, index) => `
                      <input data-bind="days.${state.activeDate}.topSignals.${index}" placeholder="Signal ${index + 1}" value="${escapeHtml(signal)}" />
                    `).join("")}
                  </div>
                </div>
                <div class="field-row compact">
                  <div class="field">
                    <label>Objective</label>
                    <input data-bind="days.${state.activeDate}.objective" value="${escapeHtml(day.objective)}" placeholder="One meaningful outcome" />
                  </div>
                  <div class="field">
                    <label>Metric / target</label>
                    <input data-bind="days.${state.activeDate}.metricTarget" value="${escapeHtml(day.metricTarget)}" placeholder="Example: 3 calls, 2 pages, 1 proposal" />
                  </div>
                </div>
                <div class="field">
                  <label>Key results</label>
                  <textarea data-bind="days.${state.activeDate}.keyResults">${escapeHtml(day.keyResults)}</textarea>
                </div>
              </div>
              <div class="table-card">
                <h4>Daily Schedule (6a-9p)</h4>
                <div class="table">
                  <div class="table-row schedule header"><span>Time</span><span>Task</span><span>Done</span></div>
                  ${day.schedule.map((slot, index) => `
                    <div class="table-row schedule">
                      <span class="value">${slot.time}</span>
                      <input data-bind="days.${state.activeDate}.schedule.${index}.task" value="${escapeHtml(slot.task)}" placeholder="Time block, meeting, buffer, rest, reset" />
                      <input type="checkbox" data-bind="days.${state.activeDate}.schedule.${index}.done" ${slot.done ? "checked" : ""} />
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>
          </section>

          <section id="priorities" class="panel section">
            <div class="section-header">
              <div>
                <h2>Professional & Personal Priorities</h2>
                <small>Pages 4 and 5 turned into checklists with notes and custom add-ons.</small>
              </div>
            </div>
            <div class="subgrid">
              ${renderChecklistBlock("Professional priorities", "professional", day.professional, state.activeDate)}
              ${renderChecklistBlock("Personal & family priorities", "personal", day.personal, state.activeDate)}
            </div>
          </section>

          <section id="wellness" class="panel section">
            <div class="section-header">
              <div>
                <h2>Wellness & Flow State Tracking</h2>
                <small>Tracks habits, notes, rest, and “frequency alignment” from page 6.</small>
              </div>
              <div class="pill">${stats.wellnessDone} habits completed</div>
            </div>
            <div class="subgrid">
              <div class="table-card">
                <div class="table">
                  <div class="table-row header"><span>Habit</span><span>Category</span><span>Notes</span><span>Done</span></div>
                  ${day.wellness.map((habit, index) => `
                    <div class="table-row">
                      <span class="value">${escapeHtml(habit.habit)}</span>
                      <span class="value">${escapeHtml(habit.category)}</span>
                      <input data-bind="days.${state.activeDate}.wellness.${index}.notes" value="${escapeHtml(habit.notes)}" placeholder="Duration, trigger, win" />
                      <input type="checkbox" data-bind="days.${state.activeDate}.wellness.${index}.done" ${habit.done ? "checked" : ""} />
                    </div>
                  `).join("")}
                </div>
              </div>
              <div class="stack">
                <div class="mini-card">
                  <h4>Rest & recovery</h4>
                  <div class="field-row compact">
                    <div class="field">
                      <label>Hours of rest</label>
                      <input type="number" min="0" max="24" step="0.5" data-bind="days.${state.activeDate}.restHours" value="${day.restHours}" />
                    </div>
                    <div class="field">
                      <label>Frequency alignment toward 7.83 Hz</label>
                      <input type="range" min="0" max="100" data-bind="days.${state.activeDate}.frequencyAlignment" value="${day.frequencyAlignment}" />
                      <div class="helper">${day.frequencyAlignment}% aligned</div>
                    </div>
                  </div>
                </div>
                <div class="mini-card">
                  <h4>Flow insights</h4>
                  <div class="achievement-list">
                    <div class="achievement">Physical: ${day.wellness.filter((item) => item.category === "Physical" && item.done).length}</div>
                    <div class="achievement">Mental: ${day.wellness.filter((item) => item.category === "Mental" && item.done).length}</div>
                    <div class="achievement">Creative: ${day.wellness.filter((item) => item.category === "Creative" && item.done).length}</div>
                    <div class="achievement">Entrepreneurial: ${day.wellness.filter((item) => item.category === "Entrepreneurial" && item.done).length}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="mindmap" class="panel section">
            <div class="section-header">
              <div>
                <h2>Mind Map, Resource Hub & Reflection</h2>
                <small>Page 7 preserved as strategy scratch space plus closeout prompts.</small>
              </div>
              <div class="pill">Day rating ${day.reflection.rating}/10</div>
            </div>
            <div class="subgrid">
              <div class="stack">
                <div class="mini-card">
                  <h4>Mind map</h4>
                  <textarea data-bind="days.${state.activeDate}.mindMap" placeholder="Sketch your strategy, map dependencies, externalize clutter.">${escapeHtml(day.mindMap)}</textarea>
                </div>
                <div class="mini-card">
                  <h4>Quick access checklist</h4>
                  <div class="stack">
                    <input data-bind="days.${state.activeDate}.resourceChecklist.streamDeck" value="${escapeHtml(day.resourceChecklist.streamDeck)}" placeholder="Stream Deck commands" />
                    <input data-bind="days.${state.activeDate}.resourceChecklist.apps" value="${escapeHtml(day.resourceChecklist.apps)}" placeholder="Apps" />
                    <input data-bind="days.${state.activeDate}.resourceChecklist.tools" value="${escapeHtml(day.resourceChecklist.tools)}" placeholder="Tools" />
                  </div>
                </div>
              </div>
              <div class="stack">
                <div class="mini-card">
                  <h4>End of day reflection</h4>
                  <div class="stack">
                    <textarea class="inline-textarea" data-bind="days.${state.activeDate}.reflection.wentWell" placeholder="What went well today?">${escapeHtml(day.reflection.wentWell)}</textarea>
                    <textarea class="inline-textarea" data-bind="days.${state.activeDate}.reflection.improve" placeholder="What can improve tomorrow?">${escapeHtml(day.reflection.improve)}</textarea>
                    <textarea class="inline-textarea" data-bind="days.${state.activeDate}.reflection.gratitude" placeholder="Gratitude / wins">${escapeHtml(day.reflection.gratitude)}</textarea>
                  </div>
                  <div class="helper">Reflection entries are high-value XP because they make tomorrow easier.</div>
                </div>
                <div class="mini-card">
                  <h4>Day rating</h4>
                  <div class="rating">
                    ${Array.from({ length: 10 }, (_, index) => index + 1).map((value) => `
                      <button data-rating="${value}" class="${day.reflection.rating === value ? "active" : ""}">${value}</button>
                    `).join("")}
                  </div>
                  <div class="field">
                    <label>Notes</label>
                    <textarea class="inline-textarea" data-bind="days.${state.activeDate}.notes" placeholder="Loose ideas, tomorrow seeds, reminders">${escapeHtml(day.notes)}</textarea>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="goals" class="panel section">
            <div class="section-header">
              <div>
                <h2>Goals & Vision</h2>
                <small>SMART goals, reverse-engineered steps, and planner-connected progress.</small>
              </div>
              <button class="secondary" data-action="add-goal">Add goal</button>
            </div>
            <div class="card-stack">
              ${state.goals.length ? state.goals.map(renderGoalCard).join("") : `<div class="empty">No goals yet. Add one to start turning vision into scoreable progress.</div>`}
            </div>
          </section>

          <section id="budget" class="panel section">
            <div class="section-header">
              <div>
                <h2>Monthly Budget Tracker</h2>
                <small>Page 9 with live variance math and monthly notes.</small>
              </div>
              <div class="pill">${month}</div>
            </div>
            <div class="table-card">
              <div class="table">
                <div class="table-row budget header"><span>Category</span><span>Budget</span><span>Actual</span><span>Variance</span></div>
                ${budget.rows.map((row, index) => {
                  const variance = (Number(row.budget) || 0) - (Number(row.actual) || 0);
                  return `
                    <div class="table-row budget">
                      <span class="value">${escapeHtml(row.category)}</span>
                      <input type="number" step="0.01" data-bind="budgets.${month}.rows.${index}.budget" value="${row.budget}" />
                      <input type="number" step="0.01" data-bind="budgets.${month}.rows.${index}.actual" value="${row.actual}" />
                      <span class="value">${currency(variance)}</span>
                    </div>
                  `;
                }).join("")}
              </div>
              <div class="pill-row">
                <div class="pill">Planned ${currency(stats.budgetTotal)}</div>
                <div class="pill">Actual ${currency(stats.actualTotal)}</div>
                <div class="pill">Variance ${currency(stats.varianceTotal)}</div>
              </div>
              <div class="field">
                <label>Notes / reflections</label>
                <textarea data-bind="budgets.${month}.notes">${escapeHtml(budget.notes)}</textarea>
              </div>
            </div>
          </section>

          <section id="meetings" class="panel section">
            <div class="section-header">
              <div>
                <h2>Meeting Templates</h2>
                <small>General meetings and case/review calls from pages 10 and 11.</small>
              </div>
              <div class="stack-actions">
                <button class="secondary" data-action="add-meeting" data-type="General Meeting">Add general meeting</button>
                <button class="secondary" data-action="add-meeting" data-type="Case / Review Call">Add case review</button>
              </div>
            </div>
            <div class="card-stack">
              ${state.meetings.length ? state.meetings.map(renderMeetingCard).join("") : `<div class="empty">No meetings logged yet.</div>`}
            </div>
          </section>

          <section id="contacts" class="panel section">
            <div class="section-header">
              <div>
                <h2>Contacts & Stakeholders</h2>
                <small>Relationship tracker from page 12 plus space for notes and context.</small>
              </div>
              <button class="secondary" data-action="add-contact">Add contact</button>
            </div>
            <div class="card-stack">
              ${state.contacts.length ? state.contacts.map(renderContactCard).join("") : `<div class="empty">No contacts yet.</div>`}
            </div>
          </section>

          <section id="insights" class="panel section">
            <div class="section-header">
              <div>
                <h2>Guidance, Suggestions & Achievements</h2>
                <small>Page 13 reframed as ongoing coaching and momentum signals.</small>
              </div>
            </div>
            <div class="subgrid">
              <div class="mini-card">
                <h4>Planner guidance</h4>
                <div class="stack">
                  <div class="achievement">Identify key focus areas: career, health, personal development, relationships, finances.</div>
                  <div class="achievement">Make goals specific, measurable, achievable, relevant, and time bound.</div>
                  <div class="achievement">Reverse-engineer each goal into steps that can be scheduled in the day planner.</div>
                  <div class="achievement">Map your ideal day to your actual energy, not somebody else's template.</div>
                </div>
              </div>
              <div class="mini-card">
                <h4>Unlocked achievements</h4>
                <div class="achievement-list">
                  ${stats.achievements.length ? stats.achievements.map((item) => `<div class="achievement">${item}</div>`).join("") : `<div class="helper">Keep logging activity to unlock badges.</div>`}
                </div>
                <div class="helper">Open actions: ${stats.meetingActionsOpen}. Meetings this month: ${stats.meetingsThisMonth}. Contacts tracked: ${stats.contactsCount}.</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  `;

  bindEvents();
}

function heroLeadCard(label, value, detail) {
  return `
    <div class="hero-mini-stat">
      <small>${label}</small>
      <strong>${value}</strong>
      <span>${detail}</span>
    </div>
  `;
}

function metricCard(label, value, detail, kicker = "") {
  return `
    <div class="panel metric">
      <div class="metric-kicker">${kicker}</div>
      <small>${label}</small>
      <strong>${value}</strong>
      <div class="helper">${detail}</div>
    </div>
  `;
}

function navLink(target, label, count) {
  return `<a href="#${target}"><span>${label}</span><span class="nav-count">${count}</span></a>`;
}

function renderChecklistBlock(title, listType, items, dateKey) {
  return `
    <div class="table-card">
      <div class="splitline">
        <h3>${title}</h3>
        <button class="secondary" data-action="add-checklist-item" data-list="${listType}">Add item</button>
      </div>
      <div class="card-stack">
        ${items.map((item, index) => `
          <div class="list-card ${item.done ? "done" : ""}">
            <div class="checkline">
              <input type="checkbox" data-bind="days.${dateKey}.${listType}.${index}.done" ${item.done ? "checked" : ""} />
              <input data-bind="days.${dateKey}.${listType}.${index}.text" value="${escapeHtml(item.text)}" />
            </div>
            <textarea class="inline-textarea" data-bind="days.${dateKey}.${listType}.${index}.notes" placeholder="Context, blockers, next move">${escapeHtml(item.notes)}</textarea>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderGoalCard(goal, index) {
  const completedSteps = goal.steps.filter((step) => step.done).length;
  return `
    <div class="table-card">
      <div class="splitline">
        <div class="goal-title">
          <h3>${escapeHtml(goal.title || `Goal ${index + 1}`)}</h3>
          <div class="pill">${goal.area}</div>
        </div>
        <button class="danger" data-action="delete-goal" data-id="${goal.id}">Remove</button>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Title</label>
          <input data-bind-goal="${goal.id}.title" value="${escapeHtml(goal.title)}" />
        </div>
        <div class="field">
          <label>Focus area</label>
          <select data-bind-goal="${goal.id}.area">
            ${AREA_OPTIONS.map((option) => `<option value="${option}" ${goal.area === option ? "selected" : ""}>${option}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label>Time bound</label>
          <input type="month" data-bind-goal="${goal.id}.timeBound" value="${goal.timeBound}" />
        </div>
        <div class="field">
          <label>Progress</label>
          <input type="range" min="0" max="100" data-bind-goal="${goal.id}.progress" value="${goal.progress}" />
          <div class="helper">${goal.progress}% complete</div>
        </div>
      </div>
      <div class="subgrid">
        <div class="stack">
          <textarea class="inline-textarea" data-bind-goal="${goal.id}.specific" placeholder="Specific">${escapeHtml(goal.specific)}</textarea>
          <textarea class="inline-textarea" data-bind-goal="${goal.id}.measurable" placeholder="Measurable">${escapeHtml(goal.measurable)}</textarea>
          <textarea class="inline-textarea" data-bind-goal="${goal.id}.achievable" placeholder="Achievable">${escapeHtml(goal.achievable)}</textarea>
        </div>
        <div class="stack">
          <textarea class="inline-textarea" data-bind-goal="${goal.id}.relevant" placeholder="Relevant">${escapeHtml(goal.relevant)}</textarea>
          <textarea class="inline-textarea" data-bind-goal="${goal.id}.notes" placeholder="Vision / notes">${escapeHtml(goal.notes)}</textarea>
          <div class="progress"><span style="width:${goal.progress}%"></span></div>
          <div class="helper">${completedSteps}/${goal.steps.length} reverse-engineered steps completed</div>
        </div>
      </div>
      <div class="splitline">
        <h4>Reverse engineer steps</h4>
        <button class="secondary" data-action="add-goal-step" data-id="${goal.id}">Add step</button>
      </div>
      <div class="goal-steps">
        ${goal.steps.map((step, stepIndex) => `
          <div class="checkline">
            <input type="checkbox" data-bind-goal-step="${goal.id}.${stepIndex}.done" ${step.done ? "checked" : ""} />
            <input data-bind-goal-step="${goal.id}.${stepIndex}.text" value="${escapeHtml(step.text)}" placeholder="Small enough to schedule" />
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderMeetingCard(meeting) {
  return `
    <div class="table-card">
      <div class="splitline">
        <h3>${escapeHtml(meeting.type)}</h3>
        <div class="stack-actions">
          <button class="secondary" data-action="add-action-item" data-id="${meeting.id}">Add action item</button>
          <button class="danger" data-action="delete-meeting" data-id="${meeting.id}">Remove</button>
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label>Date</label><input type="date" data-bind-meeting="${meeting.id}.date" value="${meeting.date}" /></div>
        <div class="field"><label>Time</label><input data-bind-meeting="${meeting.id}.time" value="${escapeHtml(meeting.time)}" /></div>
        <div class="field"><label>Attendees</label><input data-bind-meeting="${meeting.id}.attendees" value="${escapeHtml(meeting.attendees)}" placeholder="Name and role" /></div>
        <div class="field"><label>Agenda</label><input data-bind-meeting="${meeting.id}.agenda" value="${escapeHtml(meeting.agenda)}" /></div>
      </div>
      <div class="subgrid">
        <textarea data-bind-meeting="${meeting.id}.discussion" placeholder="Discussion points">${escapeHtml(meeting.discussion)}</textarea>
        <textarea data-bind-meeting="${meeting.id}.notes" placeholder="Notes">${escapeHtml(meeting.notes)}</textarea>
      </div>
      <div class="table">
        <div class="table-row actions header"><span>Item</span><span>Owner</span><span>Due</span><span>Done</span><span></span></div>
        ${meeting.actionItems.map((item, index) => `
          <div class="table-row actions">
            <input data-bind-action="${meeting.id}.${index}.item" value="${escapeHtml(item.item)}" />
            <input data-bind-action="${meeting.id}.${index}.owner" value="${escapeHtml(item.owner)}" />
            <input type="date" data-bind-action="${meeting.id}.${index}.due" value="${item.due}" />
            <input type="checkbox" data-bind-action="${meeting.id}.${index}.done" ${item.done ? "checked" : ""} />
            <button class="danger" data-action="delete-action-item" data-id="${meeting.id}" data-index="${index}">X</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderContactCard(contact) {
  return `
    <div class="table-card">
      <div class="splitline">
        <h3>${escapeHtml(contact.name || "Stakeholder")}</h3>
        <button class="danger" data-action="delete-contact" data-id="${contact.id}">Remove</button>
      </div>
      <div class="field-row">
        <div class="field"><label>Name / role</label><input data-bind-contact="${contact.id}.name" value="${escapeHtml(contact.name)}" /></div>
        <div class="field"><label>Role</label><input data-bind-contact="${contact.id}.role" value="${escapeHtml(contact.role)}" /></div>
        <div class="field"><label>Organization</label><input data-bind-contact="${contact.id}.organization" value="${escapeHtml(contact.organization)}" /></div>
        <div class="field"><label>Contact info</label><input data-bind-contact="${contact.id}.contactInfo" value="${escapeHtml(contact.contactInfo)}" /></div>
      </div>
      <div class="subgrid">
        <textarea data-bind-contact="${contact.id}.relationship" placeholder="Relationship notes">${escapeHtml(contact.relationship)}</textarea>
        <textarea data-bind-contact="${contact.id}.notes" placeholder="Additional notes">${escapeHtml(contact.notes)}</textarea>
      </div>
    </div>
  `;
}

function currency(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function bindEvents() {
  document.querySelectorAll("[data-action='jump']").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.getElementById("active-date").addEventListener("change", (event) => {
    updateAndRender(() => {
      ensureDay(state, event.target.value);
      ensureBudget(state, monthKeyFromDate(event.target.value));
      ensureMonthlyContract(state, monthKeyFromDate(event.target.value));
    });
  });

  document.getElementById("active-month").addEventListener("change", (event) => {
    const month = event.target.value;
    updateAndRender(() => {
      ensureBudget(state, month);
      ensureMonthlyContract(state, month);
      state.activeDate = `${month}-01`;
      ensureDay(state, state.activeDate);
    });
  });

  document.querySelectorAll("[data-bind]").forEach((element) => {
    const saveHandler = () => persistOnly(() => setByPath(state, element.dataset.bind, inputValue(element)));
    const renderHandler = () => updateAndRender(() => setByPath(state, element.dataset.bind, inputValue(element)));
    if (element.type === "checkbox" || element.type === "date" || element.tagName === "SELECT") {
      element.addEventListener("change", renderHandler);
    } else if (element.type === "range" || element.type === "number") {
      element.addEventListener("input", renderHandler);
      element.addEventListener("change", renderHandler);
    } else {
      element.addEventListener("input", saveHandler);
      element.addEventListener("change", renderHandler);
    }
  });

  document.querySelectorAll("[data-rating]").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        state.days[state.activeDate].reflection.rating = Number(button.dataset.rating);
      });
    });
  });

  document.querySelector("[data-action='export']").addEventListener("click", exportState);
  document.querySelector("[data-action='import']").addEventListener("click", () => {
    document.getElementById("import-file").click();
  });
  document.getElementById("import-file").addEventListener("change", importState);

  document.querySelectorAll("[data-action='add-checklist-item']").forEach((button) => {
    button.addEventListener("click", () => {
      const list = button.dataset.list;
      updateAndRender(() => {
        state.days[state.activeDate][list].push({ id: uid(), text: "", done: false, notes: "" });
      });
    });
  });

  const addGoal = document.querySelector("[data-action='add-goal']");
  if (addGoal) {
    addGoal.addEventListener("click", () => {
      updateAndRender(() => state.goals.push(makeGoal()));
    });
  }

  document.querySelectorAll("[data-action='delete-goal']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        state.goals = state.goals.filter((goal) => goal.id !== button.dataset.id);
      });
    });
  });

  document.querySelectorAll("[data-bind-goal]").forEach((element) => {
    const [goalId, ...pathParts] = element.dataset.bindGoal.split(".");
    const path = pathParts.join(".");
    const saveHandler = () => {
      persistOnly(() => {
        const goal = state.goals.find((item) => item.id === goalId);
        setByPath(goal, path, inputValue(element));
      });
    };
    const renderHandler = () => {
      updateAndRender(() => {
        const goal = state.goals.find((item) => item.id === goalId);
        setByPath(goal, path, inputValue(element));
      });
    };
    if (element.type === "date" || element.tagName === "SELECT") {
      element.addEventListener("change", renderHandler);
    } else if (element.type === "range") {
      element.addEventListener("input", renderHandler);
      element.addEventListener("change", renderHandler);
    } else {
      element.addEventListener("input", saveHandler);
      element.addEventListener("change", renderHandler);
    }
  });

  document.querySelectorAll("[data-action='add-goal-step']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        const goal = state.goals.find((item) => item.id === button.dataset.id);
        goal.steps.push({ id: uid(), text: "", done: false });
      });
    });
  });

  document.querySelectorAll("[data-bind-goal-step]").forEach((element) => {
    const [goalId, index, field] = element.dataset.bindGoalStep.split(".");
    const saveHandler = () => {
      persistOnly(() => {
        const goal = state.goals.find((item) => item.id === goalId);
        if (!goal?.steps?.[Number(index)]) return;
        goal.steps[Number(index)][field] = inputValue(element);
      });
    };
    const renderHandler = () => {
      updateAndRender(() => {
        const goal = state.goals.find((item) => item.id === goalId);
        if (!goal?.steps?.[Number(index)]) return;
        goal.steps[Number(index)][field] = inputValue(element);
      });
    };
    if (element.type === "checkbox") {
      element.addEventListener("change", renderHandler);
    } else {
      element.addEventListener("input", saveHandler);
      element.addEventListener("change", renderHandler);
    }
  });

  document.querySelectorAll("[data-action='add-meeting']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => state.meetings.unshift(makeMeeting(button.dataset.type)));
    });
  });

  document.querySelectorAll("[data-action='delete-meeting']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        state.meetings = state.meetings.filter((meeting) => meeting.id !== button.dataset.id);
      });
    });
  });

  document.querySelectorAll("[data-bind-meeting]").forEach((element) => {
    const [meetingId, ...pathParts] = element.dataset.bindMeeting.split(".");
    const path = pathParts.join(".");
    const saveHandler = () => {
      persistOnly(() => {
        const meeting = state.meetings.find((item) => item.id === meetingId);
        if (!meeting) return;
        setByPath(meeting, path, inputValue(element));
      });
    };
    const renderHandler = () => {
      updateAndRender(() => {
        const meeting = state.meetings.find((item) => item.id === meetingId);
        if (!meeting) return;
        setByPath(meeting, path, inputValue(element));
      });
    };
    if (element.type === "date" || element.tagName === "SELECT") {
      element.addEventListener("change", renderHandler);
    } else {
      element.addEventListener("input", saveHandler);
      element.addEventListener("change", renderHandler);
    }
  });

  document.querySelectorAll("[data-action='add-action-item']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        const meeting = state.meetings.find((item) => item.id === button.dataset.id);
        meeting.actionItems.push({ id: uid(), item: "", owner: "", due: "", done: false });
      });
    });
  });

  document.querySelectorAll("[data-action='delete-action-item']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        const meeting = state.meetings.find((item) => item.id === button.dataset.id);
        meeting.actionItems.splice(Number(button.dataset.index), 1);
      });
    });
  });

  document.querySelectorAll("[data-bind-action]").forEach((element) => {
    const [meetingId, index, field] = element.dataset.bindAction.split(".");
    const saveHandler = () => {
      persistOnly(() => {
        const meeting = state.meetings.find((item) => item.id === meetingId);
        if (!meeting?.actionItems?.[Number(index)]) return;
        meeting.actionItems[Number(index)][field] = inputValue(element);
      });
    };
    const renderHandler = () => {
      updateAndRender(() => {
        const meeting = state.meetings.find((item) => item.id === meetingId);
        if (!meeting?.actionItems?.[Number(index)]) return;
        meeting.actionItems[Number(index)][field] = inputValue(element);
      });
    };
    if (element.type === "checkbox" || element.type === "date") {
      element.addEventListener("change", renderHandler);
    } else {
      element.addEventListener("input", saveHandler);
      element.addEventListener("change", renderHandler);
    }
  });

  const addContact = document.querySelector("[data-action='add-contact']");
  if (addContact) {
    addContact.addEventListener("click", () => {
      updateAndRender(() => state.contacts.unshift(makeContact()));
    });
  }

  document.querySelectorAll("[data-action='delete-contact']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        state.contacts = state.contacts.filter((contact) => contact.id !== button.dataset.id);
      });
    });
  });

  document.querySelectorAll("[data-bind-contact]").forEach((element) => {
    const [contactId, ...pathParts] = element.dataset.bindContact.split(".");
    const path = pathParts.join(".");
    const saveHandler = () => {
      persistOnly(() => {
        const contact = state.contacts.find((item) => item.id === contactId);
        if (!contact) return;
        setByPath(contact, path, inputValue(element));
      });
    };
    const renderHandler = () => {
      updateAndRender(() => {
        const contact = state.contacts.find((item) => item.id === contactId);
        if (!contact) return;
        setByPath(contact, path, inputValue(element));
      });
    };
    element.addEventListener("input", saveHandler);
    element.addEventListener("change", renderHandler);
  });
}

function inputValue(element) {
  if (element.type === "checkbox") return element.checked;
  if (element.type === "number" || element.type === "range") return Number(element.value);
  return element.value;
}

function setByPath(target, path, value) {
  const keys = path.split(".");
  let cursor = target;
  while (keys.length > 1) {
    const key = keys.shift();
    cursor = cursor[key];
  }
  cursor[keys[0]] = value;
}

function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `efficio-lion-planner-${state.activeDate}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importState(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      state = normalizeState(parsed);
      state.importStamp = new Date().toISOString();
      saveState();
      render();
    } catch {
      window.alert("That file could not be imported. Please choose a valid planner JSON export.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

render();
