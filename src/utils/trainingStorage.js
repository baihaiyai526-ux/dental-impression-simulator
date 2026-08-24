const STORAGE_VERSION = 1;
const TRAINING_STATE_KEY = "dental-impression-training-state";
const REAL_SCENE_SESSION_KEY = "dental-impression-real-scene-session";

function readVersionedState(key) {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.version === STORAGE_VERSION ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeVersionedState(key, data) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        version: STORAGE_VERSION,
        updatedAt: new Date().toISOString(),
        data
      })
    );
  } catch {
    // Storage may be unavailable in private browsing or when the quota is full.
  }
}

export function loadTrainingState() {
  return readVersionedState(TRAINING_STATE_KEY);
}

export function saveTrainingState(data) {
  writeVersionedState(TRAINING_STATE_KEY, data);
}

export function loadRealSceneSession() {
  return readVersionedState(REAL_SCENE_SESSION_KEY);
}

export function saveRealSceneSession(data) {
  writeVersionedState(REAL_SCENE_SESSION_KEY, data);
}

export function clearRealSceneSession() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(REAL_SCENE_SESSION_KEY);
  } catch {
    // Keep restart functional even when storage is unavailable.
  }
}
