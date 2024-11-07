# Delete Tha Tweets

## ⚠️ Important Warning
Before using this script, make sure to export your posts if you want to keep them. This script will permanently delete your posts and cannot be undone.

## Overview
A script that automates deletion of posts and replies on X (formerly Twitter). It handles regular posts, reposts, and replies with built-in rate limiting and automatic scrolling.

## Features
- Deletes regular posts
- Automatically undoes reposts
- Deletes replies from a specific user (you)
- Automatically scrolls to load more content
- Handles X's rate limiting gracefully
- Provides detailed console logging

## Quick Start Guide

### Prerequisites
1. **Open X (Twitter)**
   - Go to `https://twitter.com` or `https://x.com`
   - Log into your account
   - Navigate to your profile

2. **Open Developer Tools**
   - **Windows/Linux:** Press `F12` or `Ctrl + Shift + I`
   - **Mac:** Press `Cmd + Option + I`
   - Or right-click anywhere and select "Inspect"

3. **Open the Console**
   - Click the "Console" tab in Developer Tools
   - Clear any red error messages (click 🚫 or press `Ctrl + L`)

### Running the Script
1. Copy the entire script
2. Paste it into the console
3. Press Enter
4. Watch the console for progress messages

### Monitoring Progress
The console will show messages like:
```
Starting post deletion process...
Menu clicked successfully
Delete option found
Successfully deleted post
```

### Stopping the Script
You can stop the script by:
- Refreshing the page
- Closing the browser tab
- Typing `location.reload()` in the console

## Advanced Configuration
You can adjust these timing values if needed:
```javascript
const CLICK_DELAY = 3000;        // Delay between clicks (3 seconds)
const RETRY_DELAY = 4000;        // Delay before retrying failed attempts (4 seconds)
const MENU_DELAY = 2000;         // Delay after clicking repost menu (2 seconds)
const SCROLL_DELAY = 2000;       // Delay after scrolling (2 seconds)
const RATE_LIMIT_DELAY = 5000;   // Delay when hitting rate limits (5 seconds)
const MAX_RETRIES = 3;           // Maximum number of retry attempts
```

## Troubleshooting

### Common Issues and Solutions

#### Rate Limiting
- Normal behavior - the script will handle this automatically
- You'll see "Waiting for rate limit cooldown..."
- Let the script continue running

#### Failed Deletions
- Script automatically retries up to 3 times
- If persistent, refresh page and restart script
- Verify you're on your profile page

#### Slow Performance
- Check internet connection
- Increase delay values in configuration
- Refresh if X becomes unresponsive

#### Script Stops Working
- Check console for error messages
- Ensure you're logged into X
- Refresh page and restart script

### Known Limitations
1. Browser window must stay active
2. Page refresh required if X becomes unresponsive
3. Rate limiting may slow the process
4. Script must be rerun after page refreshes

## Technical Details

### Safety Features
- Only processes visible posts
- Verifies post ownership
- Handles reposts separately
- Manages rate limiting
- Provides detailed logging

### Maintenance Notes
X's interface changes may require updates to:
- Button selectors (data-testid attributes)
- Menu item text
- Interface element structure

## Getting Help
If you encounter issues:
1. Check console for error messages
2. Verify username configuration
3. Confirm you're logged into X
4. Try refreshing and restarting

> **Remember:** Keep the browser tab active and visible while the script runs. Minimizing or switching tabs might pause the script.
