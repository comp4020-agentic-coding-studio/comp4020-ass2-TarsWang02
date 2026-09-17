const memoryFallback = new Map<string, string>();

function storageAvailable(): boolean {
  try {
    const probeKey = "__jump_storage_probe__";
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

/** Falls back to an in-memory map when localStorage is unavailable (private browsing, disabled storage). */
export function readPreference(key: string): string | null {
  if (storageAvailable()) return window.localStorage.getItem(key);
  return memoryFallback.get(key) ?? null;
}

export function writePreference(key: string, value: string): void {
  if (storageAvailable()) {
    window.localStorage.setItem(key, value);
    return;
  }
  memoryFallback.set(key, value);
}
