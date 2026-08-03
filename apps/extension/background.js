// SK JobPilot - Background Service Worker
console.log('SK JobPilot Service Worker initialized.');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'FETCH_CANDIDATE_PROFILE') {
    fetch('http://localhost:5000/api/v1/profile')
      .then((res) => res.json())
      .then((data) => sendResponse({ success: true, data: data.data }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
});
