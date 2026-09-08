export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
