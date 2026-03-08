const FIRMAMENT_SYNC_URL = "http://127.0.0.1:3000/api/life-tracker/planner-sync";

const syncMeta = {
  syncing: false,
  lastSyncedAt: "",
  lastError: "",
};

let autoSyncTimer = null;
let lastQueuedSignature = "";
let lastSyncedSignature = "";

function escapeSyncHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function syncStatusMarkup() {
  const label = syncMeta.lastError
    ? "Firmament sync issue"
    : syncMeta.lastSyncedAt
      ? "Firmament synced"
      : "Firmament connection ready";
  const detail = syncMeta.lastError
    ? syncMeta.lastError
    : syncMeta.lastSyncedAt
      ? `Last synced ${new Date(syncMeta.lastSyncedAt).toLocaleString()}.`
      : "Planner saves will sync automatically, or you can push this day manually.";

  return `
    <div class="save-status firmament-sync-status ${syncMeta.lastError ? "error" : ""}">
      <strong>${label}</strong>
      <span>${escapeSyncHtml(detail)}</span>
    </div>
  `;
}

function updateSyncPanel() {
  const actionsPanel = document.querySelector(".toolbar-actions-panel");
  if (!actionsPanel) {
    return;
  }

  let syncButton = actionsPanel.querySelector("[data-action='sync-firmament']");
  if (!syncButton) {
    syncButton = document.createElement("button");
    syncButton.className = "primary firmament-sync-button";
    syncButton.dataset.action = "sync-firmament";
    actionsPanel.prepend(syncButton);
  }

  syncButton.disabled = syncMeta.syncing;
  syncButton.textContent = syncMeta.syncing ? "Syncing..." : "Sync to Firmament";
  syncButton.onclick = syncToFirmament;

  const currentStatus = document.querySelector(".firmament-sync-status");
  if (currentStatus) {
    currentStatus.remove();
  }

  const saveStatus = document.querySelector(".save-status");
  if (saveStatus) {
    saveStatus.insertAdjacentHTML("afterend", syncStatusMarkup());
  }
}

function queueFirmamentSync() {
  const nextSignature = JSON.stringify(state);
  if (nextSignature === lastQueuedSignature || nextSignature === lastSyncedSignature) {
    return;
  }

  lastQueuedSignature = nextSignature;

  if (autoSyncTimer) {
    window.clearTimeout(autoSyncTimer);
  }

  autoSyncTimer = window.setTimeout(() => {
    syncToFirmament({ auto: true });
  }, 900);
}

async function syncToFirmament(options = {}) {
  const nextSignature = JSON.stringify(state);
  if (syncMeta.syncing) {
    return;
  }

  if (!options.force && nextSignature === lastSyncedSignature) {
    updateSyncPanel();
    return;
  }

  if (autoSyncTimer) {
    window.clearTimeout(autoSyncTimer);
    autoSyncTimer = null;
  }

  syncMeta.syncing = true;
  syncMeta.lastError = "";
  updateSyncPanel();

  try {
    const response = await fetch(FIRMAMENT_SYNC_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: nextSignature,
    });

    if (!response.ok) {
      throw new Error("Firmament did not accept the sync. Make sure the control panel is running on localhost:3000.");
    }

    syncMeta.lastSyncedAt = new Date().toISOString();
    lastQueuedSignature = nextSignature;
    lastSyncedSignature = nextSignature;
  } catch (error) {
    syncMeta.lastError = error instanceof Error ? error.message : "Firmament sync failed.";
  } finally {
    syncMeta.syncing = false;
    autoSyncTimer = null;
    updateSyncPanel();
  }
}

const originalSaveState = saveState;
saveState = function saveStateWithFirmamentSync() {
  originalSaveState();
  queueFirmamentSync();
};

const originalRender = render;
render = function renderWithFirmamentSync() {
  originalRender();
  updateSyncPanel();
};

updateSyncPanel();
