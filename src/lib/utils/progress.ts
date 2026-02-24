export function parseCompletedGates(
  completedGates: string | string[] | null | undefined
): string[] {
  if (!completedGates) return [];
  if (Array.isArray(completedGates)) return completedGates;
  try {
    const parsed = JSON.parse(completedGates);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function formatGatesProgress(
  completedGates: string | string[] | null | undefined,
  total: number
): string {
  const count = parseCompletedGates(completedGates).length;
  return `${count}/${total} Gates`;
}

export function calculateGatesPercentage(
  completedGates: string | string[] | null | undefined,
  total: number
): number {
  const count = parseCompletedGates(completedGates).length;
  if (total === 0) return 0;
  return (count / total) * 100;
}
