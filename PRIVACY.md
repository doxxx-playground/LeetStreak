# Privacy Policy for LeetStreak Chrome Extension

Last updated: January 14, 2025

## Introduction

This Privacy Policy outlines how the LeetStreak Chrome extension ("Extension", "we", "us", or "our") collects, uses, and protects user data. We are committed to ensuring the privacy and security of our users while providing functionality to track LeetCode daily challenge completion.

## Information We Collect

The Extension collects and processes the following limited data:

1. **LeetCode Challenge Status**
   - Daily challenge completion status
   - Current streak count
   - Problem information (ID and title of completed challenges)

2. **User Settings**
   - Discord webhook URL (for notifications)
   - User-provided nickname (for Discord notifications)

3. **Website Access**
   - Access to leetcode.com to monitor challenge completion
   - Navigation data strictly limited to tracking challenge status

## How We Use Information

All collected information is used solely for:
- Tracking daily challenge completion status
- Maintaining accurate streak counts
- Sending achievement notifications to Discord (when explicitly requested)

## Data Storage

- All user data is stored locally in your browser using Chrome's storage API
- No data is transmitted to external servers except:
  - LeetCode API queries to verify challenge completion
  - Discord webhook notifications (only when manually triggered by user)

## Data Sharing

We do not:
- Sell any user data
- Share data with third parties
- Use data for advertising purposes
- Store data on external servers
- Track users across websites
- Use data for any purpose other than the stated functionality

## Permissions Used

The Extension requires the following permissions:

1. `storage`
   - Purpose: To store user preferences and challenge completion status locally

2. `tabs` and `webNavigation`
   - Purpose: To detect LeetCode challenge completion across different pages

3. `cookies`
   - Purpose: To maintain LeetCode session state for verification

4. `host_permissions` (leetcode.com)
   - Purpose: To access LeetCode's API for challenge verification

## User Rights

You have the right to:
- Disable or uninstall the extension at any time
- Clear all stored data through Chrome's extension settings
- Modify or remove your Discord webhook settings

## Changes to This Policy

We may update this Privacy Policy to reflect changes in our practices. Users will be notified of any material changes through the Chrome Web Store or extension interface.

## Contact

If you have questions about this Privacy Policy or the Extension's privacy practices, please:
- Open an issue on our GitHub repository
- Contact us via me@doxxx.dev

## Compliance

This Extension complies with:
- Chrome Web Store Developer Program Policies
- General data protection and privacy principles
