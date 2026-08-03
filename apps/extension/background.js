const API_BASE_URL = 'http://localhost:5000/api/v1';

async function fetchApi(path) {
  const response = await fetch(API_BASE_URL + path, { headers: { Accept: 'application/json' } });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.message || 'JobPilot API request failed');
  return payload.data;
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action !== 'FETCH_ASSISTANT_CONTEXT') return false;

  Promise.all([fetchApi('/profile'), fetchApi('/screening/answers')])
    .then(([profile, savedAnswers]) => sendResponse({ success: true, profile, savedAnswers }))
    .catch((error) => sendResponse({ success: false, error: error.message }));
  return true;
});
