# Delete Tha Tweets

## Overview

This script helps automate the process of deleting posts and replies on X (formerly Twitter). It handles regular posts, reposts, and replies while managing rate limits and page scrolling. Assuming you want to keep your posts, make sure you export your posts before running this script.

## Features

- Deletes regular posts
- Automatically undoes reposts
- Deletes replies from a specific user (you)
- Handles X's rate limiting gracefully
- Provides detailed console logging for monitoring progress

# Quick Start Guide - X Post Deletion Script

## Step-by-Step Instructions

1. **Open X (Twitter)**
   - Go to `https://twitter.com` or `https://x.com`
   - Log into your account
   - Navigate to your profile

2. **Open Developer Tools**
   - **Windows/Linux:** Press `F12` or `Ctrl + Shift + I`
   - **Mac:** Press `Cmd + Option + I`
   - Or right-click anywhere on the page and select "Inspect"

3. **Open the Console**
   - Click the "Console" tab in Developer Tools
   - Look for any red error messages and clear the console (click the 🚫 icon or press `Ctrl + L`)

4. **Edit the Script**
   - Find the line: `const USERNAME = '@bradbarrish';`
   - Replace `@bradbarrish` with your X username (keep the `@` symbol)

5. **Run the Script**
   - Copy the entire script
   - Paste it into the console
   - Press Enter
   - The script will start running and you'll see progress messages in the console

## Monitoring Progress

- Watch the console for messages like:
  ```
  Starting post deletion process...
  Menu clicked successfully
  Delete option found
  Successfully deleted post
  ```
- Let the browser window remain active
- Don't close the Developer Tools window

## Stopping the Script

- To stop the script at any time:
  - Refresh the page, or
  - Close the browser tab, or
  - Type `location.reload()` in the console

## Common Issues

- If you see "Rate limit" messages, the script is working normally - just let it continue
- If the script stops, simply refresh the page and run it again
- Make sure you're on your profile page before starting

> **Note:** Keep the browser tab active and visible while the script runs. Minimizing or switching tabs might pause the script.

## Configuration

### Username Setting

To use the script, you need to set your X username in the configuration section. Find this line near the top of the script:

```javascript
const USERNAME = '@yourusername';  // Change this to your X username
```

Change `@yourusername` to your X username, making sure to keep the `@` symbol.

### Other Configurable Settings

The script includes several timing configurations that can be adjusted if needed:

```javascript
const CLICK_DELAY = 3000;        // Delay between clicks (3 seconds)
const RETRY_DELAY = 4000;        // Delay before retrying failed attempts (4 seconds)
const MENU_DELAY = 2000;         // Delay after clicking repost menu (2 seconds)
const SCROLL_DELAY = 2000;       // Delay after scrolling (2 seconds)
const RATE_LIMIT_DELAY = 5000;   // Delay when hitting rate limits (5 seconds)
const MAX_RETRIES = 3;           // Maximum number of retry attempts
```

You can adjust these values if you're experiencing issues:
- Increase delays if actions are failing
- Decrease delays if the script is running too slowly
- Increase MAX_RETRIES if you want more retry attempts

## Usage Instructions

1. Navigate to your X profile
2. Open the browser's Developer Tools (F12 or Right-click > Inspect)
3. Go to the Console tab
4. Paste the entire script into the console
5. Press Enter to run

The script will:
1. Start processing visible posts
2. Automatically scroll to load more content
3. Handle both regular posts and reposts appropriately
4. Process replies when in the replies section

## Console Output

The script provides detailed console logging to help you monitor its progress:

- `Starting post deletion process...` - Script has started
- `Scrolling to load more posts...` - Loading new content
- `Menu clicked successfully` - Found and clicked a post's menu
- `Delete option found` or `Repost detected` - Type of post identified
- `Successfully deleted post` - Post was successfully removed
- Various error messages if issues occur

## Error Handling

The script includes several safety features:

- Retries failed operations up to 3 times
- Waits during rate limiting
- Verifies elements are visible before clicking
- Provides detailed error messages in the console

## Known Limitations

1. Browser must remain active while the script runs
2. May need to refresh the page if X's interface becomes unresponsive
3. Rate limiting by X may slow down the deletion process
4. Script needs to be rerun if the page is refreshed

## Troubleshooting

### Rate Limiting
- The script will automatically handle rate limits
- You'll see "Waiting for rate limit cooldown..." in the console
- No action needed; it will continue automatically

### Failed Deletions
- The script will retry automatically up to 3 times
- If still failing, try refreshing the page and running again

### Slow Performance
- Check your internet connection
- Try increasing the delay values in the configuration
- Refresh the page if X becomes unresponsive

### Script Stops
- Check console for error messages
- Refresh the page and run the script again
- Make sure you're logged into X

## Safety Features

The script includes several safety measures:

- Only processes posts in visible areas
- Verifies post ownership before deletion
- Handles repost undoing separately from deletion
- Includes rate limit management
- Provides clear console logging for monitoring

## Updates and Maintenance

Since X's interface may change over time, you might need to update selectors or handling logic. Key areas that might need updates:

- Button selectors (data-testid attributes)
- Menu item text
- Interface element structure

## Support

If you encounter issues:

1. Check the console for error messages
2. Verify your username is correctly set
3. Ensure you're logged into X
4. Try refreshing the page and rerunning the script

> **Important:** Always keep a backup of any important posts before running mass deletion scripts.
