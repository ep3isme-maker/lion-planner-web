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

const OPS_LOG_LIMIT = 24;
const OPS_QUEUE_LIMIT = 18;

function makeOpsStatusCheck(name, detail, status = "pass", lastRunAt = "") {
  return {
    id: uid(),
    name: String(name || "Unnamed check"),
    detail: String(detail || ""),
    status,
    lastRunAt: String(lastRunAt || ""),
  };
}

function makeAutonomyAgent(name, objective, state = "ready", confidence = 90) {
  return {
    id: uid(),
    name: String(name || "Autonomy agent"),
    objective: String(objective || ""),
    state: state || "ready",
    confidence: Math.max(0, Math.min(100, Number(confidence) || 0)),
    lastActionAt: new Date().toISOString(),
  };
}

function makeAutonomyQueueItem({
  title,
  owner = "Execution Copilot",
  risk = "medium",
  confidence = 88,
  impact = "planner quality",
  requiresApproval = true,
  state = requiresApproval ? "awaiting_approval" : "queued",
  etaMinutes = 45,
  nextAction = "Approve to run this item.",
  notes = "",
} = {}) {
  return {
    id: uid(),
    title: String(title || "Unspecified autonomous action"),
    owner: String(owner || "Execution Copilot"),
    risk,
    confidence: Math.max(0, Math.min(100, Number(confidence) || 0)),
    impact: String(impact || ""),
    requiresApproval: Boolean(requiresApproval),
    state,
    etaMinutes: Math.max(1, Number(etaMinutes) || 45),
    createdAt: new Date().toISOString(),
    updatedAt: "",
    nextAction: String(nextAction || ""),
    snoozedUntil: "",
    notes: String(notes || ""),
  };
}

function makeOpsEvent(message, level = "info", actor = "Lion Command Room") {
  return {
    id: uid(),
    message: String(message || ""),
    level: String(level || "info"),
    actor: String(actor || "Lion Command Room"),
    at: new Date().toISOString(),
  };
}

function makeOpsState() {
  return {
    mode: "Adaptive",
    lastHeartbeatAt: new Date().toISOString(),
    lastHealthRunAt: "",
    approvalQueue: [
      makeAutonomyQueueItem({
        title: "Review tomorrow's executive-function warmup sequence",
        owner: "Strategy Copilot",
        risk: "low",
        confidence: 96,
        impact: "productivity rhythm",
        requiresApproval: false,
        state: "queued",
        etaMinutes: 20,
        nextAction: "Run safe default if no blockers in queue.",
        notes: "Auto-generates a calm 15-minute opening routine.",
      }),
      makeAutonomyQueueItem({
        title: "Publish cross-platform distraction nudge settings",
        owner: "Flow Keeper",
        risk: "medium",
        confidence: 87,
        impact: "focus signal quality",
        requiresApproval: true,
        state: "awaiting_approval",
        etaMinutes: 90,
        nextAction: "Approve to push with soft rollout.",
        notes: "Keep text curious, not critical.",
      }),
      makeAutonomyQueueItem({
        title: "Schedule global backup snapshot",
        owner: "SRE Watch",
        risk: "low",
        confidence: 99,
        impact: "data continuity",
        requiresApproval: false,
        state: "auto_executed",
        etaMinutes: 15,
        nextAction: "Auto-run at next daylight boundary.",
        notes: "Last manual run succeeded.",
      }),
    ],
    agents: [
      makeAutonomyAgent("Execution Copilot", "Sequence tasks to reduce startup friction", "ready", 93),
      makeAutonomyAgent("Nudge Engine", "Keep nudges non-disruptive and effective", "ready", 90),
      makeAutonomyAgent("Release Steward", "Keep command surface clean and deploy-safe", "ready", 86),
    ],
    statusChecks: [
      makeOpsStatusCheck("Command shell", "Planner renders and binds all required controls.", "pass"),
      makeOpsStatusCheck("Persistence", "Local write/read path is live and parseable.", "pass"),
      makeOpsStatusCheck("Autonomy policy", "Cooldown, confidence cap, and approval gates are active.", "pass"),
    ],
    eventLog: [
      makeOpsEvent("Command center initialized in local browser.", "success"),
      makeOpsEvent("No approval blockers detected in seed state.", "info"),
      makeOpsEvent("Welcome lane active: low-friction collaboration mode on.", "info"),
    ],
  };
}

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
    ops: makeOpsState(),
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

function normalizeOpsStatusChecks(checks) {
  const source = Array.isArray(checks) ? checks : [];
  return source.length
    ? source.map((item, index) => ({
        id: item?.id || uid(),
        name: String(item?.name || `Status check ${index + 1}`),
        detail: String(item?.detail || ""),
        status: ["pass", "warn", "fail", "skip"].includes(item?.status) ? item.status : "pass",
        lastRunAt: String(item?.lastRunAt || ""),
      }))
    : [
        makeOpsStatusCheck("Command shell", "Planner renders and binds all required controls.", "pass"),
        makeOpsStatusCheck("Persistence", "Local write/read path is live and parseable.", "pass"),
        makeOpsStatusCheck("Autonomy policy", "Cooldown, confidence cap, and approval gates are active.", "pass"),
      ];
}

function normalizeAutonomyAgents(agents) {
  const source = Array.isArray(agents) ? agents : [];
  return source.length
    ? source.map((agent) => ({
        id: agent?.id || uid(),
        name: String(agent?.name || "Autonomy agent"),
        objective: String(agent?.objective || ""),
        state: String(agent?.state || "ready"),
        confidence: Math.max(0, Math.min(100, Number(agent?.confidence) || 0)),
        lastActionAt: String(agent?.lastActionAt || new Date().toISOString()),
      }))
    : [
        makeAutonomyAgent("Execution Copilot", "Sequence tasks to reduce startup friction", "ready", 93),
        makeAutonomyAgent("Nudge Engine", "Keep nudges non-disruptive and effective", "ready", 90),
        makeAutonomyAgent("Release Steward", "Keep command surface clean and deploy-safe", "ready", 86),
      ];
}

function normalizeAutonomyQueue(items) {
  const source = Array.isArray(items) ? items : [];
  return source.length
    ? source.slice(0, OPS_QUEUE_LIMIT).map((item) => ({
        id: item?.id || uid(),
        title: String(item?.title || "Unspecified autonomous action"),
        owner: String(item?.owner || "Execution Copilot"),
        risk: ["low", "medium", "high"].includes(item?.risk) ? item.risk : "medium",
        confidence: Math.max(0, Math.min(100, Number(item?.confidence) || 0)),
        impact: String(item?.impact || "planner quality"),
        requiresApproval: Boolean(item?.requiresApproval),
        state: ["queued", "awaiting_approval", "approved", "rejected", "snoozed", "auto_executed", "running"].includes(item?.state)
          ? item.state
          : "queued",
        etaMinutes: Math.max(1, Number(item?.etaMinutes) || 45),
        createdAt: String(item?.createdAt || new Date().toISOString()),
        updatedAt: String(item?.updatedAt || ""),
        snoozedUntil: String(item?.snoozedUntil || ""),
        nextAction: String(item?.nextAction || ""),
        notes: String(item?.notes || ""),
      }))
    : [
        makeAutonomyQueueItem({
          title: "Review tomorrow's executive-function warmup sequence",
          owner: "Strategy Copilot",
          risk: "low",
          confidence: 96,
          impact: "productivity rhythm",
          requiresApproval: false,
          state: "queued",
          etaMinutes: 20,
          nextAction: "Run safe default if no blockers in queue.",
          notes: "Auto-generates a calm 15-minute opening routine.",
        }),
      ];
}

function normalizeOpsEvents(events) {
  const source = Array.isArray(events) ? events : [];
  return source
    .slice(0, OPS_LOG_LIMIT)
    .map((event) => ({
      id: event?.id || uid(),
      actor: String(event?.actor || "Lion Command Room"),
      message: String(event?.message || ""),
      level: ["info", "warn", "error", "success"].includes(event?.level) ? event.level : "info",
      at: String(event?.at || new Date().toISOString()),
    }))
    .reverse()
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .reverse();
}

function normalizeOpsState(input = {}) {
  const fallback = makeOpsState();
  return {
    ...fallback,
    ...input,
    approvalQueue: normalizeAutonomyQueue(input.approvalQueue),
    agents: normalizeAutonomyAgents(input.agents),
    statusChecks: normalizeOpsStatusChecks(input.statusChecks),
    eventLog: normalizeOpsEvents(input.eventLog),
    lastHeartbeatAt: String(input.lastHeartbeatAt || fallback.lastHeartbeatAt),
    lastHealthRunAt: String(input.lastHealthRunAt || ""),
    lastDispatchAt: String(input.lastDispatchAt || ""),
    mode: String(input.mode || fallback.mode),
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
    ops: normalizeOpsState(input.ops || {}),
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function formatOpsAge(dateValue) {
  const diffMs = Date.now() - new Date(dateValue).getTime();
  const safeMs = Number.isFinite(diffMs) ? Math.max(0, diffMs) : 0;
  const minutes = Math.floor(safeMs / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function opsQueueStateLabel(state) {
  return state === "awaiting_approval"
    ? "Awaiting approval"
    : state === "auto_executed"
      ? "Auto-executed"
      : state === "running"
        ? "Running"
        : state === "approved"
          ? "Approved"
          : state === "rejected"
            ? "Rejected"
            : state === "snoozed"
              ? "Snoozed"
              : "Queued";
}

function opsClassForState(state) {
  return state === "awaiting_approval"
    ? "warn"
    : state === "rejected"
      ? "error"
      : state === "snoozed"
        ? "muted"
        : "success";
}

function buildDayTrend() {
  const keys = Object.keys(state.days).sort().slice(-7);
  return keys.map((date) => {
    const day = state.days[date];
    const score = scoreDay(day);
    const normalized = clamp(Math.round((score / 120) * 100), 0, 100);
    return {
      date,
      score: normalized,
      label: new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  });
}

function evaluateOpsChecks(snapshot, queue, opsState) {
  const today = new Date().toISOString();
  const heartbeatAgeMinutes = opsState.lastHeartbeatAt
    ? Math.max(0, (Date.now() - new Date(opsState.lastHeartbeatAt).getTime()) / 60000)
    : Infinity;
  const needsApproval = queue.filter((item) => item.state === "awaiting_approval").length;
  const checks = [
    {
      name: "Planner command shell",
      status: snapshot.dayCompletion > 0 ? "pass" : "warn",
      detail: snapshot.dayCompletion > 0 ? "Execution board is active." : "Capture at least one signal to warm the dashboard.",
    },
    {
      name: "Local persistence",
      status: "pass",
      detail: "localStorage is live and normalized on boot.",
    },
    {
      name: "Approval risk controls",
      status: needsApproval > 3 ? "warn" : "pass",
      detail: `${needsApproval} approvals pending. Cooldown + confidence caps are active.`,
    },
    {
      name: "Autonomy heartbeat",
      status: heartbeatAgeMinutes > 8 ? "warn" : "pass",
      detail: heartbeatAgeMinutes > 8 ? "Heartbeat is stale. Re-synced on next render." : `Last heartbeat ${Math.round(heartbeatAgeMinutes)}m ago.`,
    },
    {
      name: "Autonomy agents",
      status: "pass",
      detail: "Agents are reporting no hard-blocking conditions.",
    },
  ];
  return checks.map((check, index) => ({
    id: `check-${index}`,
    name: check.name,
    status: check.status,
    detail: check.detail,
    lastRunAt: today,
  }));
}

function computeOpsDashboard(stats) {
  const opsState = state.ops || makeOpsState();
  const queue = Array.isArray(opsState.approvalQueue) ? opsState.approvalQueue : [];
  const agents = Array.isArray(opsState.agents) ? opsState.agents : [];
  const events = Array.isArray(opsState.eventLog) ? opsState.eventLog : [];
  const trend = buildDayTrend();
  const pendingApprovals = queue.filter((item) => item.state === "awaiting_approval").length;
  const safeQueue = queue.filter((item) => !item.requiresApproval || item.state !== "awaiting_approval").length;
  const healthChecks = normalizeOpsStatusChecks(evaluateOpsChecks(stats, queue, opsState));
  const failedChecks = healthChecks.filter((check) => check.status === "fail").length;
  const warningChecks = healthChecks.filter((check) => check.status === "warn").length;
  const systemHealth = clamp(100 - pendingApprovals * 14 - failedChecks * 28 - warningChecks * 6 + safeQueue * 2, 25, 100);
  const approvalPressure = clamp(Math.round((queue.length ? (pendingApprovals / queue.length) * 100 : 0)), 0, 100);
  const throughput = clamp(
    Math.round((100 - approvalPressure) * 0.42 + (stats.dayCompletion * 0.43) + (safeQueue * 3)),
    0,
    100,
  );
  const noApprovalsRequired = pendingApprovals === 0;
  const averageTrend = trend.length ? Math.round(sum(trend.map((item) => item.score)) / trend.length) : 0;

  return {
    mode: opsState.mode || "Adaptive",
    queue,
    agents,
    events: events.slice(0, 10),
    trend,
    healthChecks,
    pendingApprovals,
    approvalPressure,
    systemHealth,
    throughput,
    noApprovalsRequired,
    averageTrend,
    lastHeartbeatAt: opsState.lastHeartbeatAt || new Date().toISOString(),
    lastHealthRunAt: opsState.lastHealthRunAt || "",
  };
}

function ensureOpsState() {
  if (!state.ops) state.ops = makeOpsState();
  state.ops = normalizeOpsState(state.ops);
  return state.ops;
}

function appendOpsEvent(message, level = "info", actor = "Lion Command Room") {
  const ops = ensureOpsState();
  const entry = makeOpsEvent(message, level, actor);
  ops.eventLog = [entry, ...(Array.isArray(ops.eventLog) ? ops.eventLog : [])].slice(0, OPS_LOG_LIMIT);
}

function refreshOpsClock() {
  const now = new Date().toISOString();
  ensureOpsState().lastHeartbeatAt = now;
  setOpsLiveTime();
}

function getPendingApprovalCount(queue = []) {
  return queue.filter((item) => item.state === "awaiting_approval").length;
}

function withQueueItemById(itemId, callback) {
  const ops = ensureOpsState();
  const item = Array.isArray(ops.approvalQueue)
    ? ops.approvalQueue.find((entry) => entry.id === itemId)
    : null;
  if (!item) return null;
  callback(item);
  item.updatedAt = new Date().toISOString();
  return item;
}

function runAutonomousSweep() {
  const ops = ensureOpsState();
  const now = new Date();
  let executedCount = 0;
  let requeuedCount = 0;
  let expiredSnoozes = 0;
  const nowMs = now.getTime();
  ops.approvalQueue = normalizeAutonomyQueue(ops.approvalQueue).map((item) => {
    if (item.state === "snoozed" && item.snoozedUntil && new Date(item.snoozedUntil).getTime() <= nowMs) {
      expiredSnoozes += 1;
      return {
        ...item,
        state: "queued",
        snoozedUntil: "",
        nextAction: "Snooze period expired. Ready for queue.",
        updatedAt: now.toISOString(),
      };
    }

    if (
      item.state === "queued" &&
      item.confidence >= 88 &&
      item.risk === "low" &&
      !item.requiresApproval
    ) {
      executedCount += 1;
      return {
        ...item,
        state: "auto_executed",
        nextAction: "Safe-lane execution complete.",
        updatedAt: now.toISOString(),
      };
    }

    if (item.state === "approved") {
      requeuedCount += 1;
      return {
        ...item,
        state: "queued",
        nextAction: "Auto-flow replay. Re-queued after confirmation.",
        updatedAt: now.toISOString(),
      };
    }
    return item;
  });
  ops.lastDispatchAt = now.toISOString();
  return { executedCount, requeuedCount, expiredSnoozes };
}

function runHealthChecksExplicit() {
  const ops = ensureOpsState();
  const checks = evaluateOpsChecks(computeStats(), ops.approvalQueue, ops);
  ops.statusChecks = normalizeOpsStatusChecks(checks);
  ops.lastHealthRunAt = new Date().toISOString();
}

function toggleSafeLane() {
  const ops = ensureOpsState();
  const pendingApprovals = getPendingApprovalCount(ops.approvalQueue);
  if (pendingApprovals > 0) {
    ops.mode = "Paused";
    appendOpsEvent(
      `Safe lane hold active. ${pendingApprovals} item(s) still require human approval first.`,
      "warn",
      "Command Room",
    );
    return { executedCount: 0, requeuedCount: 0, expiredSnoozes: 0, skipped: true };
  }
  const result = runAutonomousSweep();
  ops.mode = "Safe lane";
  return result;
}

let opsClockInterval = null;

function setOpsLiveTime() {
  const liveTime = document.getElementById("ops-live-time");
  if (!liveTime) return;
  liveTime.textContent = new Date().toLocaleTimeString();
}

function startOpsClock() {
  setOpsLiveTime();
  refreshOpsClock();
  if (opsClockInterval) return;
  opsClockInterval = setInterval(() => {
    refreshOpsClock();
  }, 30 * 1000);
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
  ensureOpsState();
  state.ops.lastHeartbeatAt = new Date().toISOString();
  const stats = computeStats();
  const ops = computeOpsDashboard(stats);

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
            <button class="secondary" data-action="jump" data-target="command-center">Open command center</button>
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

      <section id="command-center" class="panel section">
        <div class="section-header">
          <div>
            <h2>Lion Command Center</h2>
            <small>Global live-state cockpit for real-time quality, approvals, and autonomous collaboration.</small>
          </div>
          <div class="pill">
            Live timestamp: <span id="ops-live-time">${new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div class="command-grid">
          <div class="dial-column">
            ${renderOpsDial("System health", `${ops.systemHealth}%`, `${ops.systemHealth}/100`, ops.systemHealth >= 85 ? "success" : ops.systemHealth >= 70 ? "warn" : "error")}
            ${renderOpsDial("Approval pressure", `${ops.approvalPressure}%`, `${ops.pendingApprovals} queue holds`, ops.approvalPressure <= 35 ? "success" : ops.approvalPressure <= 70 ? "warn" : "error")}
            ${renderOpsDial("Autonomy throughput", `${ops.throughput}%`, `${ops.mode}`, ops.throughput >= 75 ? "success" : "warn")}
          </div>
          <div class="ops-grid">
            ${renderOpsQueue(ops.queue, ops.noApprovalsRequired)}
            ${renderOpsStatusChecks(ops.healthChecks)}
            ${renderOpsTrend(ops.trend, ops.averageTrend)}
          </div>
          <div class="ops-grid">
            ${renderOpsAgents(ops.agents)}
            ${renderOpsEventLog(ops.events)}
            <div class="table-card">
              <h4>Auto-flow controls</h4>
              <div class="helper">
                ${ops.noApprovalsRequired ? "No items awaiting approval. Safe lane is active." : `${ops.pendingApprovals} items still require human confirmation.`}
              </div>
              <div class="stack-actions">
                <button class="secondary" data-action="ops-simulate-sweep">Run autonomous sweep</button>
                <button class="secondary" data-action="ops-toggle-safe-lane">${ops.noApprovalsRequired ? "Keep safe lane active" : "Run safe lane now"}</button>
              </div>
            </div>
          </div>
        </div>
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
            ${navLink("command-center", "Command center", `${ops.pendingApprovals} approvals`)}
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

function renderOpsDial(label, value, valueLabel, tone = "gold") {
  return `
    <div class="mini-card dial-card">
      <div class="dial-labels">
        <small>${escapeHtml(label)}</small>
        <span class="status-chip ${tone}">${escapeHtml(tone)}</span>
      </div>
      <div class="dial-shell dial-${tone}" style="--dial-value:${value}">
        <div class="dial-value">${valueLabel}</div>
      </div>
    </div>
  `;
}

function renderOpsStatusChecks(checks) {
  return `
    <div class="table-card">
      <div class="splitline">
        <h4>Status checks</h4>
        <div class="small-actions">
          <button class="secondary" data-action="ops-run-checks">Run checks</button>
          <button class="secondary" data-action="ops-reset-stream">Reset stream</button>
        </div>
      </div>
      <div class="ops-check-list">
        ${checks
          .map(
            (check) => `
              <div class="ops-check-row">
                <div>
                  <strong>${escapeHtml(check.name)}</strong>
                  <div class="helper">${escapeHtml(check.detail)}</div>
                </div>
                <span class="status-chip ${check.status}">${check.status}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderOpsQueue(queue, noApprovalsRequired) {
  if (!queue.length) {
    return `
      <div class="table-card">
        <h4>Approval queue</h4>
        <div class="empty">No active queue items. Add an autonomous action to begin.</div>
      </div>
    `;
  }

  return `
    <div class="table-card">
      <div class="splitline">
        <h4>Approval queue</h4>
        <span class="status-chip ${noApprovalsRequired ? "success" : "warn"}">${noApprovalsRequired ? "No approvals needed" : "Approvals in flight"}</span>
      </div>
      <div class="ops-queue">
        ${queue
          .map(
            (item) => `
              <div class="ops-queue-item">
                <div>
                  <div class="ops-queue-title">${escapeHtml(item.title)}</div>
                  <div class="helper">${escapeHtml(item.nextAction || item.notes || "No next action defined.")}</div>
                </div>
                <div class="ops-queue-meta">
                  <span class="status-chip ${opsClassForState(item.state)}">${opsQueueStateLabel(item.state)}</span>
                  <span class="status-chip ${item.risk}">${escapeHtml(item.risk)} risk</span>
                  <span>${escapeHtml(item.owner)} • ${item.confidence}% confidence • ${formatOpsAge(item.updatedAt || item.createdAt)}</span>
                </div>
                <div class="stack-actions">
                  ${
                    item.state === "awaiting_approval"
                      ? `
                          <button class="secondary" data-action="ops-approve" data-id="${item.id}">Approve</button>
                          <button class="secondary" data-action="ops-snooze" data-id="${item.id}">Snooze</button>
                          <button class="secondary" data-action="ops-escalate" data-id="${item.id}">Escalate</button>
                          <button class="danger" data-action="ops-reject" data-id="${item.id}">Reject</button>
                        `
                      : item.state === "queued" || item.state === "auto_executed" || item.state === "running"
                        ? `
                          <button class="secondary" data-action="ops-requeue" data-id="${item.id}">Re-queue</button>
                          <button class="secondary" data-action="ops-rescore" data-id="${item.id}">Adjust confidence</button>
                        `
                        : `
                          <button class="secondary" data-action="ops-requeue" data-id="${item.id}">Re-queue</button>
                        `
                  }
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderOpsTrend(trend, averageTrend) {
  return `
    <div class="table-card">
      <div class="splitline">
        <h4>Execution trend (7 days)</h4>
        <span class="small muted">${averageTrend}% rolling average</span>
      </div>
      <div class="ops-bar-chart">
        ${trend
          .map(
            (item) => `
              <div class="ops-bar">
                <div class="ops-bar-fill" style="--height:${item.score}%"></div>
                <span class="muted">${item.label}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderOpsAgents(agents) {
  return `
    <div class="table-card">
      <div class="splitline">
        <h4>Autonomous work stream</h4>
        <span class="small muted">${agents.length} active agents</span>
      </div>
      <div class="ops-agent-list">
        ${agents
          .map(
            (agent) => `
              <div class="ops-agent">
                <strong>${escapeHtml(agent.name)}</strong>
                <span>${escapeHtml(agent.objective || "No objective set.")}</span>
                <div class="progress"><span style="width:${agent.confidence}%"></span></div>
                <div class="helper">
                  <span>${escapeHtml(agent.state)} · confidence ${agent.confidence}%</span>
                  <span>${formatOpsAge(agent.lastActionAt || new Date().toISOString())}</span>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderOpsEventLog(events) {
  return `
    <div class="table-card">
      <div class="splitline">
        <h4>Ops event stream</h4>
        <button class="secondary" data-action="ops-add-note">Add operator note</button>
      </div>
      <div class="ops-log">
        ${events.length ? events.map((event) => `
          <div class="ops-log-row">
            <span class="status-chip ${event.level}">${escapeHtml(event.level)}</span>
            <strong>${escapeHtml(event.actor)}</strong>
            <span>${escapeHtml(event.message)}</span>
            <small>${escapeHtml(formatOpsAge(event.at))}</small>
          </div>
        `).join("") : `<div class="helper">No events yet. Start a check or action to seed the log.</div>`}
      </div>
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
  const requestNumber = (message, defaultValue = 0) => {
    const raw = window.prompt(message, String(defaultValue));
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  };

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

  document.querySelectorAll("[data-action='ops-approve']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        const item = withQueueItemById(button.dataset.id, (queueItem) => {
          queueItem.requiresApproval = false;
          queueItem.state = "approved";
          queueItem.nextAction = "Approved by operator and ready for execution.";
        });
        if (item) {
          appendOpsEvent(`Operator approved: ${item.title}`, "success", "Operator");
        }
      });
    });
  });

  document.querySelectorAll("[data-action='ops-reject']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        const item = withQueueItemById(button.dataset.id, (queueItem) => {
          queueItem.state = "rejected";
          queueItem.requiresApproval = false;
          queueItem.nextAction = "Rejected by operator. Marked for audit only.";
        });
        if (item) {
          appendOpsEvent(`Operator rejected: ${item.title}`, "warn", "Operator");
        }
      });
    });
  });

  document.querySelectorAll("[data-action='ops-snooze']").forEach((button) => {
    button.addEventListener("click", () => {
      const minutes = requestNumber("How many minutes should this item be snoozed?", 30);
      if (minutes === null || minutes <= 0) return;
      const nextRunAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();
      updateAndRender(() => {
        const item = withQueueItemById(button.dataset.id, (queueItem) => {
          queueItem.state = "snoozed";
          queueItem.snoozedUntil = nextRunAt;
          queueItem.nextAction = `Snoozed ${minutes}m. Auto-check again after this window.`;
        });
        if (item) {
          appendOpsEvent(`Snoozed item: ${item.title} (${minutes}m)`, "info", "Operator");
        }
      });
    });
  });

  document.querySelectorAll("[data-action='ops-escalate']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        const item = withQueueItemById(button.dataset.id, (queueItem) => {
          queueItem.requiresApproval = true;
          queueItem.risk = "high";
          queueItem.state = "awaiting_approval";
          queueItem.confidence = clamp(Math.round(queueItem.confidence * 0.88), 1, 100);
          queueItem.nextAction = "Escalated. Human confirmation required before execution.";
        });
        if (item) {
          appendOpsEvent(`Escalated item: ${item.title}`, "warn", "Operator");
        }
      });
    });
  });

  document.querySelectorAll("[data-action='ops-requeue']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        const item = withQueueItemById(button.dataset.id, (queueItem) => {
          queueItem.state = "queued";
          queueItem.snoozedUntil = "";
          queueItem.nextAction = "Re-queued by operator for one-pass review.";
        });
        if (item) {
          appendOpsEvent(`Re-queued: ${item.title}`, "info", "Operator");
        }
      });
    });
  });

  document.querySelectorAll("[data-action='ops-rescore']").forEach((button) => {
    button.addEventListener("click", () => {
      const item = state?.ops?.approvalQueue?.find((entry) => entry.id === button.dataset.id);
      const nextScore = requestNumber(`Set confidence score for ${item?.title || "selected item"} (0-100).`, item?.confidence ?? 88);
      if (nextScore === null) return;
      updateAndRender(() => {
        const changed = withQueueItemById(button.dataset.id, (queueItem) => {
          queueItem.confidence = clamp(Math.round(nextScore), 0, 100);
          queueItem.nextAction = `Confidence re-scored to ${queueItem.confidence}%.`;
        });
        if (changed) {
          appendOpsEvent(`Rescored ${changed.title} to ${changed.confidence}%`, "info", "Operator");
        }
      });
    });
  });

  document.querySelectorAll("[data-action='ops-run-checks']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        runHealthChecksExplicit();
        appendOpsEvent("Manual health checks executed.", "success", "Operator");
      });
    });
  });

  document.querySelectorAll("[data-action='ops-simulate-sweep']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        const result = runAutonomousSweep();
        if (result.executedCount > 0) {
          appendOpsEvent(`Autonomous sweep executed ${result.executedCount} item(s).`, "success", "Command Room");
        } else if (result.expiredSnoozes > 0) {
          appendOpsEvent(`Autonomous sweep released ${result.expiredSnoozes} snoozed item(s).`, "info", "Command Room");
        } else if (result.requeuedCount > 0) {
          appendOpsEvent(`Autonomous sweep refreshed ${result.requeuedCount} approved item(s).`, "info", "Command Room");
        } else {
          appendOpsEvent("Autonomous sweep completed. No safe items to execute.", "info", "Command Room");
        }
      });
    });
  });

  document.querySelectorAll("[data-action='ops-toggle-safe-lane']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        const result = toggleSafeLane();
        if (result?.skipped) {
          appendOpsEvent("Safe lane wait mode active due approval blockers.", "warn", "Command Room");
          return;
        }
        if (result.executedCount > 0) {
          appendOpsEvent(`Safe lane executed ${result.executedCount} eligible item(s).`, "success", "Command Room");
          return;
        }
        appendOpsEvent("Safe lane active. No new eligible items found this cycle.", "info", "Command Room");
      });
    });
  });

  document.querySelectorAll("[data-action='ops-reset-stream']").forEach((button) => {
    button.addEventListener("click", () => {
      updateAndRender(() => {
        ensureOpsState().eventLog = [makeOpsEvent("Ops event stream reset by operator.", "info", "Operator")];
      });
    });
  });

  document.querySelectorAll("[data-action='ops-add-note']").forEach((button) => {
    button.addEventListener("click", () => {
      const note = window.prompt("Add an operator note to the command stream.", "");
      if (note === null) return;
      const text = String(note).trim();
      if (!text) return;
      updateAndRender(() => {
        appendOpsEvent(text, "info", "Operator");
      });
    });
  });

  startOpsClock();
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
