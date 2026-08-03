document.addEventListener('DOMContentLoaded', () => {
  const detectBtn = document.getElementById('detectBtn');
  const fillBtn = document.getElementById('fillBtn');
  const statusDiv = document.getElementById('status');
  const fieldList = document.getElementById('fieldList');

  let detectedFields = [];
  let candidateProfile = null;
  let pendingCapture = null;
  const captureBtn = document.getElementById('captureBtn');
  const captureForm = document.getElementById('captureForm');
  const saveJobBtn = document.getElementById('saveJobBtn');

  captureBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    statusDiv.innerText = 'Reading the current job page...';
    chrome.tabs.sendMessage(tab.id, { action: 'CAPTURE_JOB' }, (response) => {
      if (chrome.runtime.lastError || !response?.success) {
        statusDiv.innerText = 'Reload the page, then try again.';
        return;
      }
      pendingCapture = response.job || { platform: response.platform, sourceUrl: response.sourceUrl, applyUrl: response.sourceUrl, captureMethod: 'manual' };
      document.getElementById('jobTitle').value = pendingCapture.title || '';
      document.getElementById('jobCompany').value = pendingCapture.company || '';
      document.getElementById('jobLocation').value = pendingCapture.location || '';
      captureForm.style.display = 'block';
      statusDiv.innerText = response.restricted
        ? 'This portal restricts automated extraction. Confirm the visible job details manually.'
        : 'Confirm the extracted details before saving.';
    });
  });

  saveJobBtn.addEventListener('click', async () => {
    const title = document.getElementById('jobTitle').value.trim();
    const company = document.getElementById('jobCompany').value.trim();
    if (!pendingCapture || !title || !company) {
      statusDiv.innerText = 'Job title and company are required.';
      return;
    }
    statusDiv.innerText = 'Saving to SK JobPilot...';
    try {
      const response = await fetch('http://localhost:5000/api/v1/discovery/browser-capture', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobs: [{ ...pendingCapture, title, company, location: document.getElementById('jobLocation').value.trim() }] }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || 'Capture failed');
      statusDiv.innerText = payload.data.inserted ? 'New job saved. Open Discover Jobs to review it.' : 'Job already existed; freshness was updated.';
      captureForm.style.display = 'none';
    } catch (error) {
      statusDiv.innerText = `Could not save: ${error.message}`;
    }
  });

  detectBtn.addEventListener('click', async () => {
    statusDiv.innerText = 'Detecting fields on current page...';

    // Fetch candidate profile from local API via background script
    chrome.runtime.sendMessage({ action: 'FETCH_CANDIDATE_PROFILE' }, (response) => {
      if (response && response.success) {
        candidateProfile = response.data;
      }
    });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    chrome.tabs.sendMessage(tab.id, { action: 'DETECT_FIELDS' }, (response) => {
      if (response && response.fields) {
        detectedFields = response.fields;
        renderFieldList(detectedFields);
        statusDiv.innerText = `Detected ${detectedFields.length} input fields.`;
        fillBtn.style.display = 'block';
      } else {
        statusDiv.innerText = 'No input fields detected on page.';
      }
    });
  });

  fillBtn.addEventListener('click', async () => {
    if (!detectedFields.length) return;

    const fillPayload = detectedFields.map((f) => {
      let val = '';
      if (candidateProfile) {
        const info = candidateProfile.personalInfo || {};
        if (f.category === 'first_name') val = info.fullName?.split(' ')[0] || '';
        else if (f.category === 'last_name') val = info.fullName?.split(' ').slice(1).join(' ') || '';
        else if (f.category === 'full_name') val = info.fullName || '';
        else if (f.category === 'email') val = info.email || '';
        else if (f.category === 'phone') val = info.phone || '';
        else if (f.category === 'linkedin_url') val = info.linkedinUrl || '';
        else if (f.category === 'github_url') val = info.githubUrl || '';
        else if (f.category === 'portfolio_url') val = info.portfolioUrl || '';
      }
      return { index: f.index, value: val };
    });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    chrome.tabs.sendMessage(tab.id, { action: 'FILL_FIELDS', fieldData: fillPayload }, (res) => {
      if (res && res.filledCount) {
        statusDiv.innerText = `Successfully filled ${res.filledCount} fields! Please review before submitting.`;
      }
    });
  });

  function renderFieldList(fields) {
    fieldList.innerHTML = '';
    fieldList.style.display = 'block';

    fields.forEach((f) => {
      const item = document.createElement('div');
      item.className = 'field-item';
      item.innerHTML = `
        <span>${f.label}</span>
        <span className="badge ${f.requiresConfirmation ? 'warn-badge' : ''}">${f.category}</span>
      `;
      fieldList.appendChild(item);
    });
  }
});
