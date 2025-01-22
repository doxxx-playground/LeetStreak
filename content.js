async function analyzeGraphQLResponse(query, operationName, variables = {}) {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-csrftoken":
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrftoken="))
            ?.split("=")[1] || "",
      },
      body: JSON.stringify({
        query,
        operationName,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

let isChecking = false;

async function checkDailyCompletion() {
  if (isChecking) return;
  isChecking = true;

  try {
    const today = getTodayDateString();
    const completionData = await analyzeGraphQLResponse(
      `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          date
          userStatus
          link
          question {
            acRate
            difficulty
            freqBar
            questionFrontendId
            isFavor
            isPaidOnly
            status
            title
            titleSlug
            hasVideoSolution
            hasSolution
          }
        }
        streakCounter {
          streakCount
          daysSkipped
          currentDayCompleted
        }
      }
      `,
      "questionOfToday",
    );

    const dailyQuestion =
      completionData?.data?.activeDailyCodingChallengeQuestion;
    const streakInfo = completionData?.data?.streakCounter;

    const isCompleted =
      streakInfo?.currentDayCompleted ||
      dailyQuestion?.userStatus === "Finish" ||
      dailyQuestion?.userStatus === "SOLVED" ||
      dailyQuestion?.question?.status === "ac";

    if (isCompleted && dailyQuestion?.question?.titleSlug) {
      const submissionData = await analyzeGraphQLResponse(
        `
        query questionSubmissionList($titleSlug: String!, $limit: Int, $offset: Int) {
          questionSubmissionList(
            questionSlug: $titleSlug
            offset: $offset
            limit: $limit
          ) {
            lastKey
            hasNext
            submissions {
              id
              statusDisplay
              lang
              langName
              runtime
              timestamp
              memory
            }
          }
        }
        `,
        "questionSubmissionList",
        {
          titleSlug: dailyQuestion.question.titleSlug,
          limit: 1,
          offset: 0,
        },
      );

      const latestSubmission =
        submissionData?.data?.questionSubmissionList?.submissions?.[0];

      await chrome.storage.local.set({
        dailyCompletion: {
          date: today,
          verified: false,
          questionId: dailyQuestion?.question?.questionFrontendId,
          questionTitle: dailyQuestion?.question?.title,
          questionSlug: dailyQuestion?.question?.titleSlug,
          submissionId: latestSubmission?.id,
          submissionLang: latestSubmission?.langName,
          runtime: latestSubmission?.runtime,
          memory: latestSubmission?.memory,
          streak: streakInfo?.streakCount || 0,
        },
      });
    }
  } finally {
    isChecking = false;
  }
}

// 페이지 로드시 체크
checkDailyCompletion();

// 주기적으로 체크 (2분마다)
chrome.runtime.sendMessage({ type: "createAlarm" });

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(checkDailyCompletion, 3000);
  }
}).observe(document, { subtree: true, childList: true });

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    setTimeout(checkDailyCompletion, 1000);
  }
});

// Listen for check requests from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "checkCompletion") {
    checkDailyCompletion();
  }
});
