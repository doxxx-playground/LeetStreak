# LeetStreak

<p align="center">
  <img src="Logo.png" alt="LeetStreak Logo"/>
</p>

A Chrome extension that helps you track and share your LeetCode daily challenge streak on Discord.

## Features

- 🎯 Automatically tracks your daily challenge completion
- 🔥 Monitors your current streak length
- 📊 Real-time status updates
- 🤖 Easy Discord integration
- 🔔 Instant notifications when you complete the challenge
- 🌙 Automatic daily reset at midnight

## Installation

1. Download from the Chrome Web Store (Coming Soon)
2. Clone this repository for development:
   ```bash
   git clone https://github.com/[your-username]/leetstreak.git
   ```

## Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the extension directory
4. Click the extension icon in Chrome toolbar
5. Open settings and add your Discord webhook URL

## Usage

1. Complete your LeetCode daily challenge
2. Click the LeetStreak icon in your Chrome toolbar
3. Click "Send to Discord" to share your achievement
4. Keep your streak going! 💪

## Configuration

### Discord Webhook Setup
1. In your Discord server, go to Server Settings > Integrations
2. Create a new webhook
3. Copy the webhook URL
4. Open LeetStreak settings and paste your webhook URL

### Customization
- Set your preferred nickname for Discord notifications
- Configure the extension through the settings page

## Development

### Prerequisites
- Google Chrome
- Basic knowledge of Chrome Extension development

### Local Development
1. Clone the repository
2. Make your changes
3. Load the unpacked extension in Chrome
4. Test your changes

### Project Structure
```
leetstreak/
├── icons/              # Extension icons
├── background.js       # Background service worker
├── content.js         # Content script for LeetCode pages
├── manifest.json      # Extension manifest
├── popup.html        # Extension popup UI
├── popup.js         # Popup logic
├── options.html    # Settings page
└── options.js     # Settings logic
```

## Privacy

This extension:
- Only accesses LeetCode.com
- Stores data locally in your browser
- Sends notifications only to your specified Discord webhook
- Does not collect any personal information
- Does not track your browsing history

See our [Privacy Policy](PRIVACY.md) for more details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

* [LeetCode](https://leetcode.com) for providing daily coding challenges
* [Discord](https://discord.com) for webhook integration capabilities
