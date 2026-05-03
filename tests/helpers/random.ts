export function randomEmail(prefix = 'user'): string {
  const stamp = Date.now();
  const rand = Math.floor(Math.random() * 1_000_000);
  return `${prefix}.${stamp}.${rand}@example.test`;
}

export function randomName(prefix = 'Test User'): string {
  return `${prefix} ${Date.now()}`;
}
