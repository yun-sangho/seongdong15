const DTSTART_REGEX = /^DTSTART(?:;VALUE=DATE)?:([0-9]{8})$/i;

function normalizeDateString(raw: string): string {
  const year = raw.slice(0, 4);
  const month = raw.slice(4, 6);
  const day = raw.slice(6, 8);
  return `${year}-${month}-${day}`;
}

export function parseIcsToDates(icsContent: string): string[] {
  const dates = new Set<string>();

  for (const rawLine of icsContent.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const match = line.match(DTSTART_REGEX);
    if (match) {
      dates.add(normalizeDateString(match[1]));
    }
  }

  return Array.from(dates).sort();
}
