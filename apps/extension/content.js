const SENSITIVE_CATEGORIES = new Set([
  'work_authorization', 'sponsorship', 'salary', 'demographic', 'disability', 'legal', 'criminal_history',
]);
const SAFE_CATEGORIES = new Set([
  'first_name', 'last_name', 'full_name', 'email', 'phone', 'linkedin_url', 'github_url', 'portfolio_url',
  'city', 'current_title', 'current_company',
]);

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'DETECT_FIELDS') sendResponse({ success: true, fields: detectFormFields(), platform: detectPlatform() });
  else if (request.action === 'CAPTURE_JOB') sendResponse(captureCurrentJob());
  else if (request.action === 'FILL_FIELDS') sendResponse(fillFormFields(request.fieldData || []));
  return true;
});

function detectPlatform() {
  const host = location.hostname.toLowerCase();
  if (host.includes('linkedin.')) return 'linkedin';
  if (host.includes('indeed.')) return 'indeed';
  if (host.includes('wellfound.')) return 'wellfound';
  if (host.includes('naukri.')) return 'naukri';
  if (host.includes('instahyre.')) return 'instahyre';
  return 'company_ats';
}

function detectFormFields() {
  return Array.from(document.querySelectorAll('input, textarea, select')).flatMap((element, index) => {
    const type = (element.type || element.tagName || 'text').toLowerCase();
    if (['hidden', 'submit', 'button', 'reset', 'password', 'file'].includes(type) || element.disabled || element.readOnly) return [];
    const label = findLabel(element);
    const text = [label, element.placeholder, element.name, element.id, element.getAttribute('aria-label')]
      .filter(Boolean).join(' ').toLowerCase();
    const category = classifyField(text);
    return [{
      locator: buildLocator(element, index), label: label || element.placeholder || element.name || `Field ${index + 1}`,
      category, inputType: type, requiresConfirmation: SENSITIVE_CATEGORIES.has(category) || !SAFE_CATEGORIES.has(category),
    }];
  });
}

function classifyField(text) {
  if (/first.?name/.test(text)) return 'first_name';
  if (/last.?name|surname/.test(text)) return 'last_name';
  if (/full.?name|your name|candidate name/.test(text)) return 'full_name';
  if (/e.?mail/.test(text)) return 'email';
  if (/phone|mobile|telephone/.test(text)) return 'phone';
  if (/linkedin/.test(text)) return 'linkedin_url';
  if (/github/.test(text)) return 'github_url';
  if (/portfolio|personal website|website url/.test(text)) return 'portfolio_url';
  if (/current.*(title|role)|job title/.test(text)) return 'current_title';
  if (/current.*company|employer/.test(text)) return 'current_company';
  if (/city|current location/.test(text)) return 'city';
  if (/sponsor|visa/.test(text)) return 'sponsorship';
  if (/authori[sz]|legally.*work/.test(text)) return 'work_authorization';
  if (/salary|compensation|ctc|pay/.test(text)) return 'salary';
  if (/disabil/.test(text)) return 'disability';
  if (/criminal|conviction/.test(text)) return 'criminal_history';
  if (/gender|race|ethnic|veteran|demographic/.test(text)) return 'demographic';
  if (/terms|privacy|declaration|certify|legal/.test(text)) return 'legal';
  if (/cover.?letter/.test(text)) return 'cover_letter';
  return 'general_question';
}

function buildLocator(element, index) {
  if (element.id) return { kind: 'id', value: element.id };
  if (element.name) return { kind: 'name', value: element.name, index: Array.from(document.getElementsByName(element.name)).indexOf(element) };
  return { kind: 'formIndex', value: index };
}

function resolveLocator(locator) {
  if (locator.kind === 'id') return document.getElementById(locator.value);
  if (locator.kind === 'name') return document.getElementsByName(locator.value)[locator.index || 0];
  return Array.from(document.querySelectorAll('input, textarea, select'))[locator.value];
}

function findLabel(element) {
  if (element.id) {
    const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(element.id) : element.id.replace(/"/g, '\\"');
    const explicit = document.querySelector(`label[for="${escaped}"]`);
    if (explicit) return explicit.innerText.trim();
  }
  const parent = element.closest('label');
  if (parent) return parent.innerText.trim();
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) return labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.innerText || '').join(' ').trim();
  return '';
}

function setNativeValue(element, value) {
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
    : element instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
  if (setter) setter.call(element, value);
  else element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
}

function fillFormFields(fieldData) {
  if (detectPlatform() === 'linkedin') {
    return { success: false, blocked: true, filledCount: 0, message: 'LinkedIn prohibits extension-driven form automation. Use LinkedIn saved answers and submit manually.' };
  }
  let filledCount = 0;
  let reviewCount = 0;
  for (const item of fieldData) {
    if (!item.value || item.requiresConfirmation) { if (item.requiresConfirmation) reviewCount += 1; continue; }
    const element = resolveLocator(item.locator);
    if (!element || element.type === 'password' || element.type === 'file' || /captcha/i.test(element.id || '')) continue;
    setNativeValue(element, String(item.value));
    filledCount += 1;
  }
  const message = filledCount > 0
    ? `Filled ${filledCount} safe field${filledCount === 1 ? '' : 's'}. Review every field and submit manually.`
    : `No safe application fields were filled. ${reviewCount} field${reviewCount === 1 ? '' : 's'} require review.`
  return { success: true, filledCount, reviewCount, message };
}

function captureCurrentJob() {
  const platform = detectPlatform();
  const restricted = platform === 'linkedin';
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script.textContent || '{}');
      const items = Array.isArray(parsed) ? parsed : parsed['@graph'] || [parsed];
      const job = items.find((item) => item && item['@type'] === 'JobPosting');
      if (!job) continue;
      const company = typeof job.hiringOrganization === 'string' ? job.hiringOrganization : job.hiringOrganization?.name;
      const locationData = Array.isArray(job.jobLocation) ? job.jobLocation[0] : job.jobLocation;
      return { success: true, restricted, job: {
        platform, title: job.title || '', company: company || '',
        location: locationData?.address?.addressLocality || job.jobLocationType || '',
        description: stripHtml(job.description || ''), sourceUrl: location.href, applyUrl: location.href,
        captureMethod: 'structured_data', postedDate: validIsoDate(job.datePosted),
      }};
    } catch { /* Ignore invalid publisher JSON-LD. */ }
  }
  return { success: true, restricted, platform, sourceUrl: location.href };
}

function stripHtml(value) {
  const node = document.createElement('div');
  node.innerHTML = value;
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}
function validIsoDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : undefined;
}
