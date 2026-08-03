document.addEventListener('DOMContentLoaded', () => {
  const detectBtn = document.getElementById('detectBtn');
  const fillBtn = document.getElementById('fillBtn');
  const statusDiv = document.getElementById('status');
  const fieldList = document.getElementById('fieldList');

  let detectedFields = [];
  let candidateProfile = null;

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
