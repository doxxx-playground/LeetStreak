document.addEventListener("DOMContentLoaded", async () => {
  const statusContainer = document.getElementById("status");
  const verifyButton = document.getElementById("verify");
  const settingsLink = document.getElementById("settingsLink");
  const loader = document.getElementById("loader");

  const setLoading = (isLoading) => {
    loader.style.display = isLoading ? "block" : "none";
    verifyButton.disabled = isLoading;
  };

  const updateStatus = (completion, verified = false) => {
    if (!completion) {
      statusContainer.className = "status-card status-pending";
      statusContainer.innerHTML = `
        <div class="status-title">❌ Not Completed</div>
        <div class="status-message">You haven't completed today's challenge yet.</div>
        <a href="https://leetcode.click/" class="problem-link" target="_blank">
          Go to LeetCode →
        </a>
      `;
      verifyButton.disabled = true;
      return;
    }

    statusContainer.className = "status-card status-complete";
    statusContainer.innerHTML = `
      <div class="status-title">✅ Challenge Completed!</div>
      <div class="status-details">
        <div>Problem #${completion.questionId}</div>
        <div class="problem-title">${completion.questionTitle}</div>
        <div class="streak">🔥 Current Streak: ${completion.streak} days</div>
      </div>
      ${verified ? '<div class="verified-badge">✓ Verified on Discord</div>' : ""}
    `;
    verifyButton.disabled = verified;
  };

  const sendToDiscord = async () => {
    try {
      setLoading(true);
      const { webhookUrl, nickname } = await chrome.storage.sync.get([
        "webhookUrl",
        "nickname",
      ]);

      if (!webhookUrl || !nickname) {
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL("options.html"));
        }
        showToast("Please configure settings first", "error");
        return;
      }

      const { dailyCompletion } =
        await chrome.storage.local.get("dailyCompletion");
      if (!dailyCompletion)
        throw new Error("Complete today's challenge first!");

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "LeetCode Verifier",
          embeds: [
            {
              title: "LeetCode Daily Challenge Completed! 🎉",
              color: 5814783,
              fields: [
                { name: "Nickname", value: nickname, inline: true },
                { name: "Date", value: dailyCompletion.date, inline: true },
                {
                  name: "Current Streak",
                  value: `${dailyCompletion.streak} days`,
                  inline: true,
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      if (!response.ok) throw new Error("Failed to send to Discord");

      await chrome.storage.local.set({
        dailyCompletion: { ...dailyCompletion, verified: true },
      });

      updateStatus(dailyCompletion, true);
      showToast("Successfully sent to Discord! 🎉");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  };

  verifyButton.addEventListener("click", sendToDiscord);
  settingsLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  });

  try {
    setLoading(true);
    const { dailyCompletion } =
      await chrome.storage.local.get("dailyCompletion");
    const today = new Date().toISOString().split("T")[0];

    if (dailyCompletion?.date === today) {
      updateStatus(dailyCompletion, dailyCompletion.verified);
    } else {
      updateStatus(null);
    }
  } catch (error) {
    showToast("Failed to load status", "error");
  } finally {
    setLoading(false);
  }
});
