function deleteAllPosts() {
    // Configuration
    const CLICK_DELAY = 3000;
    const RETRY_DELAY = 4000;
    const MENU_DELAY = 2000;
    const SCROLL_DELAY = 2000;
    const RATE_LIMIT_DELAY = 5000;
    const MAX_RETRIES = 3;
    const USERNAME = '@bradbarrish';
    
    let retryCount = 0;
    let lastPostCount = 0;
    let noNewPostsCount = 0;
    let lastActionTime = Date.now() - RATE_LIMIT_DELAY;
    let consecutiveRateLimits = 0;
    let currentPostContainer = null;

    // Helper function to safely click visible elements
    const safeClick = (element) => {
        if (element && element.offsetParent !== null) {
            try {
                element.click();
                console.log("Clicked element with text:", element.textContent || "no text");
                return true;
            } catch (e) {
                console.log("Click failed:", e);
                return false;
            }
        }
        console.log("Element not found or not visible.");
        return false;
    };

    // Helper function to check if a post is actually from the user
    const isUserPost = (post) => {
        // First, find the post author's element
        const authorElement = post.querySelector('div[data-testid="User-Name"] a[href*="/status/"]');
        if (!authorElement) {
            console.log("Could not find author element");
            return false;
        }

        // Get the author's handle from the link
        const authorHref = authorElement.getAttribute('href') || '';
        const authorHandle = authorHref.split('/')[1];
        
        console.log(`Found post by: @${authorHandle}`);
        return authorHandle === USERNAME.substring(1);
    };

    // Find the next post menu button for user's posts
    const findNextPostMenuButton = () => {
        console.log("Looking for posts by " + USERNAME);
        const posts = document.querySelectorAll('article[data-testid="tweet"]');
        
        for (const post of posts) {
            if (!post.offsetParent) continue;
            
            if (isUserPost(post)) {
                const menuButton = post.querySelector('[data-testid="caret"]');
                if (menuButton) {
                    console.log("Found a post by " + USERNAME);
                    currentPostContainer = post;
                    return { button: menuButton, postContainer: post };
                }
            }
        }
        
        return { button: null, postContainer: null };
    };

    // Click the menu button
    const clickMenu = () => {
        const { button } = findNextPostMenuButton();
        if (button) {
            return safeClick(button);
        }
        return false;
    };

    // Click delete or handle repost
    const clickDeleteOrUndoRepost = () => {
        if (!currentPostContainer) return false;

        const isRepost = currentPostContainer.textContent.includes('You reposted');

        if (!isRepost) {
            const deleteButton = Array.from(document.querySelectorAll('[role="menuitem"]'))
                .find(el => el.textContent.trim() === 'Delete');

            if (deleteButton) {
                console.log("Delete option found. Attempting to delete post...");
                return safeClick(deleteButton);
            }
        } else {
            console.log("Repost detected. Attempting to undo repost...");
            const repostButton = currentPostContainer.querySelector('[data-testid="retweet"][style*="color: rgb(0, 186, 124)"]');
            if (repostButton) {
                if (safeClick(repostButton)) {
                    setTimeout(() => {
                        if (findAndClickUndoRepost()) {
                            console.log("Repost undone successfully");
                            setTimeout(runDelete, RETRY_DELAY);
                        } else {
                            handleError("Couldn't find undo repost option");
                        }
                    }, MENU_DELAY);
                    return true;
                }
            }
            handleError("Couldn't find repost button");
        }
        return false;
    };

    // Find and click undo repost option
    const findAndClickUndoRepost = () => {
        const undoRepostButton = Array.from(document.querySelectorAll('[role="menuitem"]'))
            .find(el => el.textContent.trim().includes("Undo repost"));
        
        if (undoRepostButton) {
            console.log("Undo repost option found. Attempting to undo repost...");
            return safeClick(undoRepostButton);
        }
        console.log("Undo repost option not found in the menu.");
        return false;
    };

    // Handle delete confirmation - Updated version
    const confirmDelete = () => {
        // Wait briefly for modal to be fully visible
        const confirmButton = Array.from(document.querySelectorAll('[role="button"]'))
            .find(el => {
                // Get the exact text without any whitespace
                const buttonText = (el.textContent || '').trim();
                // Check if it's the red Delete button in the modal
                const isDeleteButton = buttonText === 'Delete';
                const inModal = el.closest('[role="dialog"]');
                // Look for the red background color that indicates it's the confirm button
                const style = window.getComputedStyle(el);
                const hasRedBackground = style.backgroundColor.includes('rgb(244, 33, 46)');
                
                return isDeleteButton && inModal && hasRedBackground;
            });

        if (confirmButton) {
            console.log("Found confirmation button in modal");
            return safeClick(confirmButton);
        }

        // Fallback to try other methods of finding the button
        const alternateButtons = [
            document.querySelector('[data-testid="confirmationSheetConfirm"]'),
            document.querySelector('div[role="dialog"] div[role="button"]:not([aria-label="Close"])')
        ].filter(Boolean);

        for (const button of alternateButtons) {
            if (button && button.textContent.includes('Delete')) {
                console.log("Found confirmation button using alternate method");
                return safeClick(button);
            }
        }

        console.log("No confirm button found");
        return false;
    };

    // Main deletion process
    const runDelete = () => {
        try {
            console.log("Looking for posts to delete...");
            if (clickMenu()) {
                retryCount = 0;
                console.log("Menu clicked successfully");
                
                setTimeout(() => {
                    if (clickDeleteOrUndoRepost()) {
                        setTimeout(() => {
                            if (confirmDelete()) {
                                console.log("Successfully deleted post");
                                currentPostContainer = null;
                                setTimeout(runDelete, RETRY_DELAY);
                            }
                        }, CLICK_DELAY);
                    }
                }, CLICK_DELAY);
            } else {
                handleError("No more posts found or couldn't find menu button");
            }
        } catch (error) {
            handleError(error.message);
        }
    };

    // Error handling
    const handleError = (message) => {
        console.error(message);
        retryCount++;
        
        if (retryCount < MAX_RETRIES) {
            console.log(`Retrying... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
            setTimeout(runDelete, RETRY_DELAY);
        } else {
            console.log("Max retries reached. Please check if there are more posts to delete or refresh the page.");
            currentPostContainer = null;
        }
    };

    // Start the process
    console.log("Starting post deletion process for " + USERNAME);
    runDelete();
}

// Run the script
deleteAllPosts();
