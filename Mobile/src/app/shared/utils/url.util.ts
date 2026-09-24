// EXAMPLE — replace with your app logic
/** Build a query string from a params object (leading `?` included when non-empty). */
export function buildQuery(
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  if (!params) {
    return '';
  }
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

/** Join a base URL and path without duplicate slashes. */
export function joinUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  if (!normalizedPath) {
    return normalizedBase;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${normalizedBase}/${normalizedPath}`;
}
