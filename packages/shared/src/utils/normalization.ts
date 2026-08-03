export function normalizeWhitespace(str: string): string {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

export function normalizeCompanyName(company: string): string {
  if (!company) return '';
  let normalized = company.toLowerCase().trim();
  // Remove common corporate suffixes
  normalized = normalized.replace(
    /\b(inc|incorporated|llc|ltd|limited|corp|corporation|co|company|gmbh|pvt|private)\b\.?/gi,
    ''
  );
  // Remove non-alphanumeric except spaces
  normalized = normalized.replace(/[^a-z0-9\s]/g, '');
  return normalizeWhitespace(normalized);
}

export function normalizeJobTitle(title: string): string {
  if (!title) return '';
  let normalized = title.toLowerCase().trim();
  // Remove common prefix noise like "hiring:", "urgently hiring", "job:"
  normalized = normalized.replace(/^(hiring|urgently hiring|job|opening):\s*/i, '');
  // Remove non-alphanumeric except spaces and +/#
  normalized = normalized.replace(/[^a-z0-9\s+#]/g, '');
  return normalizeWhitespace(normalized);
}

export function canonicalizeUrl(urlStr: string): string {
  if (!urlStr) return '';
  try {
    const parsed = new URL(urlStr);
    // Lowercase hostname, strip tracking query parameters like utm_*, ref, etc.
    const cleanParams = new URLSearchParams();
    parsed.searchParams.forEach((val, key) => {
      if (!key.startsWith('utm_') && key !== 'ref' && key !== 'fbclid' && key !== 'gclid') {
        cleanParams.append(key, val);
      }
    });
    parsed.search = cleanParams.toString();
    // Remove trailing slash from pathname if present
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    return parsed.toString();
  } catch {
    return urlStr.trim().toLowerCase();
  }
}

export function normalizeSkill(skill: string): string {
  if (!skill) return '';
  const trimmed = skill.trim();
  const lower = trimmed.toLowerCase();
  // Normalize common variations
  if (lower === 'js' || lower === 'javascript') return 'JavaScript';
  if (lower === 'ts' || lower === 'typescript') return 'TypeScript';
  if (lower === 'react' || lower === 'reactjs' || lower === 'react.js') return 'React';
  if (lower === 'node' || lower === 'nodejs' || lower === 'node.js') return 'Node.js';
  if (lower === 'py' || lower === 'python') return 'Python';
  if (lower === 'mongo' || lower === 'mongodb') return 'MongoDB';
  if (lower === 'postgres' || lower === 'postgresql') return 'PostgreSQL';
  if (lower === 'docker') return 'Docker';
  if (lower === 'k8s' || lower === 'kubernetes') return 'Kubernetes';
  if (lower === 'aws' || lower === 'amazon web services') return 'AWS';

  // Capitalize words
  return trimmed.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizePhone(phone: string): string {
  if (!phone) return '';
  // Remove non-digit characters except +
  return phone.replace(/[^\d+]/g, '');
}

export function generateJobFingerprint(
  companyName: string,
  jobTitle: string,
  location?: string
): string {
  const normCompany = normalizeCompanyName(companyName);
  const normTitle = normalizeJobTitle(jobTitle);
  const normLocation = location ? normalizeWhitespace(location.toLowerCase()) : '';
  return `${normCompany}:${normTitle}:${normLocation}`;
}
