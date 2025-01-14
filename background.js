// 날짜 유틸리티 함수 추가
function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function checkDayChange() {
  const todayDateString = getTodayDateString();

  chrome.storage.local.get("dailyCompletion", ({ dailyCompletion }) => {
    if (dailyCompletion?.date !== todayDateString) {
      chrome.storage.local.remove("dailyCompletion", () => {
        console.log("Daily completion reset for the new day.");
      });
    }
  });
}

// Check every minute for day change
setInterval(checkDayChange, 60000);

// Initial day change check
checkDayChange();
