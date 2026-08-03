// SK JobPilot - Form Field Detector & Selective Autofill Content Script
console.log('SK JobPilot Extension Content Script Loaded.');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'DETECT_FIELDS') {
    const fields = detectFormFields();
    sendResponse({ success: true, fields });
  } else if (request.action === 'FILL_FIELDS') {
    const filledCount = fillFormFields(request.fieldData);
    sendResponse({ success: true, filledCount });
  }
  return true;
});

function detectFormFields() {
  const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
  const detected = [];

  inputs.forEach((el, index) => {
    const type = (el.type || 'text').toLowerCase();
    if (type === 'hidden' || type === 'submit' || type === 'password') return;

    const labelText = findLabelForInput(el);
    const placeholder = el.placeholder || '';
    const nameAttr = el.name || '';
    const idAttr = el.id || '';

    const combinedText = `${labelText} ${placeholder} ${nameAttr} ${idAttr}`.toLowerCase();
    const category = classifyField(combinedText);

    detected.push({
      index,
      elementId: idAttr,
      name: nameAttr,
      label: labelText || placeholder || nameAttr || `Field ${index + 1}`,
      category,
      requiresConfirmation: ['work_authorization', 'sponsorship', 'salary', 'demographic', 'legal'].includes(category),
    });
  });

  return detected;
}

function classifyField(text) {
  if (text.includes('first name') || text.includes('firstname')) return 'first_name';
  if (text.includes('last name') || text.includes('lastname')) return 'last_name';
  if (text.includes('full name') || text.includes('name')) return 'full_name';
  if (text.includes('email')) return 'email';
  if (text.includes('phone') || text.includes('mobile')) return 'phone';
  if (text.includes('linkedin')) return 'linkedin_url';
  if (text.includes('github')) return 'github_url';
  if (text.includes('portfolio') || text.includes('website')) return 'portfolio_url';
  if (text.includes('sponsor') || text.includes('visa')) return 'sponsorship';
  if (text.includes('authorize') || text.includes('legally')) return 'work_authorization';
  if (text.includes('salary') || text.includes('compensation')) return 'salary';
  return 'general_question';
}

function findLabelForInput(el) {
  if (el.id) {
    const labelEl = document.querySelector(`label[for="${el.id}"]`);
    if (labelEl) return labelEl.innerText.trim();
  }
  const parentLabel = el.closest('label');
  if (parentLabel) return parentLabel.innerText.trim();
  return '';
}

function fillFormFields(fieldData) {
  const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
  let filled = 0;

  fieldData.forEach((item) => {
    if (item.index < inputs.length && item.value) {
      const el = inputs[item.index];
      // SAFETY CHECK: NEVER fill password or captcha
      if (el.type === 'password' || el.id?.includes('captcha')) return;

      el.value = item.value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      filled++;
    }
  });

  return filled;
}
