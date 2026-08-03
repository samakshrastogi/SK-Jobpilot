document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const fieldList = document.getElementById('fieldList');
  const fillBtn = document.getElementById('fillBtn');
  const captureForm = document.getElementById('captureForm');
  let detectedFields = [];
  let assistantContext = null;
  let pendingCapture = null;

  const activeTab = async () => (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
  const sendToTab = async (message) => {
    const tab = await activeTab();
    if (!tab?.id) throw new Error('No active browser tab');
    return chrome.tabs.sendMessage(tab.id, message);
  };
  const fetchContext = () => chrome.runtime.sendMessage({ action: 'FETCH_ASSISTANT_CONTEXT' });

  document.getElementById('captureBtn').addEventListener('click', async () => {
    try {
      status.innerText = 'Reading the current job page...';
      const response = await sendToTab({ action: 'CAPTURE_JOB' });
      if (!response?.success) throw new Error('Could not read this page');
      pendingCapture = response.job || { platform: response.platform, sourceUrl: response.sourceUrl, applyUrl: response.sourceUrl, captureMethod: 'manual' };
      document.getElementById('jobTitle').value = pendingCapture.title || '';
      document.getElementById('jobCompany').value = pendingCapture.company || '';
      document.getElementById('jobLocation').value = pendingCapture.location || '';
      captureForm.style.display = 'block';
      status.innerText = response.restricted ? 'Confirm the visible LinkedIn job details manually.' : 'Confirm the extracted job details.';
    } catch (error) { status.innerText = 'Reload the job page, then try again: ' + error.message; }
  });

  document.getElementById('saveJobBtn').addEventListener('click', async () => {
    const title = document.getElementById('jobTitle').value.trim();
    const company = document.getElementById('jobCompany').value.trim();
    if (!pendingCapture || !title || !company) { status.innerText = 'Job title and company are required.'; return; }
    try {
      status.innerText = 'Saving to JobPilot...';
      const response = await fetch('http://localhost:5000/api/v1/discovery/browser-capture', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobs: [{ ...pendingCapture, title, company, location: document.getElementById('jobLocation').value.trim() }] }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || 'Capture failed');
      status.innerText = payload.data.inserted ? 'Job saved and queued for analysis.' : 'Job already tracked; freshness updated.';
      captureForm.style.display = 'none';
    } catch (error) { status.innerText = 'Could not save: ' + error.message; }
  });

  document.getElementById('detectBtn').addEventListener('click', async () => {
    try {
      status.innerText = 'Loading your profile and detecting fields...';
      const [contextResponse, formResponse] = await Promise.all([fetchContext(), sendToTab({ action: 'DETECT_FIELDS' })]);
      if (!contextResponse?.success) throw new Error(contextResponse?.error || 'JobPilot API is unavailable');
      assistantContext = contextResponse;
      detectedFields = formResponse?.fields || [];
      renderFields(detectedFields);
      fillBtn.style.display = detectedFields.length ? 'block' : 'none';
      fillBtn.disabled = formResponse?.platform === 'linkedin';
      status.innerText = formResponse?.platform === 'linkedin'
        ? `Detected ${detectedFields.length} fields. LinkedIn autofill is disabled; use its saved application data.`
        : `Detected ${detectedFields.length} fields; sensitive and unknown answers will be skipped.`;
    } catch (error) { status.innerText = 'Could not prepare this page: ' + error.message; }
  });

  fillBtn.addEventListener('click', async () => {
    if (!assistantContext || !detectedFields.length) return;
    const profile = assistantContext.profile || {};
    const personal = profile.personalInfo || {};
    const professional = profile.professionalInfo || {};
    const experience = profile.experience || [];
    const values = {
      first_name: personal.fullName?.split(/\s+/)[0] || '',
      last_name: personal.fullName?.split(/\s+/).slice(1).join(' ') || '',
      full_name: personal.fullName || '', email: personal.email || '', phone: personal.phone || '',
      linkedin_url: personal.linkedinUrl || '', github_url: personal.githubUrl || '', portfolio_url: personal.portfolioUrl || '',
      city: personal.location || '', current_title: professional.currentTitle || experience[0]?.position || '',
      current_company: experience[0]?.company || '',
    };
    const saved = new Map((assistantContext.savedAnswers || []).map((answer) => [answer.canonicalKey, answer]));
    const payload = detectedFields.map((field) => {
      const savedAnswer = saved.get(field.category);
      return {
        ...field, value: values[field.category] || savedAnswer?.answerText || '',
        requiresConfirmation: field.requiresConfirmation || Boolean(savedAnswer?.requiresConfirmation),
      };
    });
    try {
      const result = await sendToTab({ action: 'FILL_FIELDS', fieldData: payload });
      status.innerText = result?.message || `Filled ${result?.filledCount || 0} safe fields. Review before submitting.`;
    } catch (error) { status.innerText = 'Autofill failed: ' + error.message; }
  });

  function renderFields(fields) {
    fieldList.innerHTML = '';
    fieldList.style.display = fields.length ? 'block' : 'none';
    for (const field of fields) {
      const item = document.createElement('div');
      item.className = 'field-item';
      const label = document.createElement('span');
      label.textContent = field.label;
      const badge = document.createElement('span');
      badge.className = 'badge ' + (field.requiresConfirmation ? 'warn-badge' : '');
      badge.textContent = field.requiresConfirmation ? 'review' : 'safe';
      item.append(label, badge);
      fieldList.appendChild(item);
    }
  }
});
