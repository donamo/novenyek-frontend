export function formatDate(value?: string | null) {
  if (!value) return "Nincs megadva";
  return new Intl.DateTimeFormat("hu-HU").format(new Date(value));
}

export function formatMonth(value?: string | null) {
  if (!value) return "Nincs státusz";
  const [year, month] = value.split("-");
  return `${year}. ${month}.`;
}

export function emptyToUndefined(value: string | null | undefined) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
