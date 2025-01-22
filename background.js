function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function checkDayChange() {
  const todayDateString = getTodayDateString();
  chrome.storage.local.get("dailyCompletion", ({ dailyCompletion }) => {
    if (dailyCompletion?.date !== todayDateString) {
      chrome.storage.local.remove("dailyCompletion");
    }
  });
}

checkDayChange();

chrome.alarms.create("dayChangeCheck", {
  periodInMinutes: 60, // Check every hour
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dayChangeCheck") {
    checkDayChange();
  }
});
