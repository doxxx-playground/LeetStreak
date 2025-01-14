// Saves options to chrome.storage
const saveOptions = (e) => {
  e.preventDefault();

  const webhook = document.getElementById("webhook");
  const nickname = document.getElementById("nickname");
  const status = document.getElementById("status");

  // Webhook URL validation
  const webhookUrlPattern =
    /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
  if (!webhookUrlPattern.test(webhook.value)) {
    showStatus("Please enter a valid Discord webhook URL", "error");
    return;
  }

  // Save to storage
  chrome.storage.sync.set(
    {
      webhookUrl: webhook.value,
      nickname: nickname.value,
    },
    () => {
      showStatus("Settings saved successfully!", "success");
    },
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    {
      webhookUrl: "",
      nickname: "",
    },
    (items) => {
      document.getElementById("webhook").value = items.webhookUrl;
      document.getElementById("nickname").value = items.nickname;
    },
  );
};

const showStatus = (message, type = "success") => {
  const status = document.getElementById("status");
  status.textContent = message;
  status.style.display = "block";
  status.className = `status ${type}`;

  setTimeout(() => {
    status.style.display = "none";
  }, 3000);
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("settingsForm").addEventListener("submit", saveOptions);
