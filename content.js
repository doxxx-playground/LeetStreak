// GraphQL 응답을 분석하는 함수
async function analyzeGraphQLResponse(query) {
  try {
    // LeetCode의 GraphQL 엔드포인트
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error("GraphQL request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in GraphQL request:", error);
    throw error;
  }
}

// 날짜 유틸리티 함수
function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

let isChecking = false;

async function checkDailyCompletion() {
  if (isChecking) return;
  isChecking = true;

  try {
    console.log("=== Starting Daily Challenge Analysis ===");

    const today = getTodayDateString();

    const completionData = await analyzeGraphQLResponse(`
      query getDailyCompletion {
        streakCounter {
          streakCount
          currentDayCompleted
        }
        activeDailyCodingChallengeQuestion {
          userStatus
          question {
            status
            questionFrontendId
            title
          }
        }
      }
    `);

    const dailyQuestion =
      completionData?.data?.activeDailyCodingChallengeQuestion;
    const streakInfo = completionData?.data?.streakCounter;

    const isCompleted =
      streakInfo?.currentDayCompleted ||
      dailyQuestion?.userStatus === "Finish" ||
      dailyQuestion?.userStatus === "SOLVED" ||
      dailyQuestion?.question?.status === "ac";

    console.log("Challenge status:", {
      date: today,
      currentStreak: streakInfo?.streakCount || 0,
      currentDayCompleted: isCompleted,
      questionTitle: dailyQuestion?.question?.title,
      questionId: dailyQuestion?.question?.questionFrontendId,
      questionStatus: dailyQuestion?.userStatus,
    });

    if (isCompleted) {
      await chrome.storage.local.set({
        dailyCompletion: {
          date: today,
          verified: false,
          questionId: dailyQuestion?.question?.questionFrontendId,
          questionTitle: dailyQuestion?.question?.title,
          streak: streakInfo?.streakCount || 0,
        },
      });
    }
  } catch (error) {
    console.error("Error in completion check:", error);
  } finally {
    isChecking = false;
    console.log("=== Challenge Analysis Finished ===");
  }
}

// 페이지 로드시 체크
checkDailyCompletion();

// 주기적으로 체크 (2분마다)
setInterval(checkDailyCompletion, 120000);

// 문제 제출 후 체크를 위한 URL 변경 감지
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(checkDailyCompletion, 2000); // URL 변경 2초 후 체크
  }
}).observe(document, { subtree: true, childList: true });

// 페이지 포커스시 체크
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    checkDailyCompletion();
  }
});
