function deleteAllPosts() {
    // Configuration
    const CLICK_DELAY = 3000;
    const RETRY_DELAY = 4000;
    const MENU_DELAY = 2000;
    const MAX_RETRIES = 3;

    let retryCount = 0;

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

    // Find the next post menu button
    const findNextPostMenuButton = () => {
        const menuButtons = document.querySelectorAll('[data-testid="caret"]');
        for (let button of menuButtons) {
            const postContainer = button.closest('article');
            if (postContainer && postContainer.offsetParent !== null) {
                return { button, postContainer };
            }
        }
        return { button: null, postContainer: null };
    };

    // Find repost button in post
    const findRepostButton = (postContainer) => {
        // Try all possible selectors for the repost button
        const buttonSelectors = [
            // Direct repost button selector
            '[data-testid="retweet"]',
            // Group containing interaction buttons
            '[role="group"] [role="button"]',
            // Look for any button containing repost text
            'div[role="button"]:has(div[dir="ltr"])'
        ];

        for (const selector of buttonSelectors) {
            const buttons = postContainer.querySelectorAll(selector);
            // Usually repost is the second button in the interaction group
            if (buttons.length >= 2) {
                return buttons[1]; // Return the second button (typically repost)
            } else if (buttons.length === 1) {
                return buttons[0];
            }
        }

        return null;
    };

    // Click the menu button (three dots)
    const clickMenu = () => {
        const { button } = findNextPostMenuButton();
        return safeClick(button);
    };

    // Check if post is a repost and handle accordingly
    const clickDeleteOrUndoRepost = () => {
        const { button, postContainer } = findNextPostMenuButton();
        if (!postContainer) return false;

        // Check if it's a repost by looking for the text
        const isRepost = postContainer.textContent.includes('You reposted');

        if (!isRepost) {
            const deleteButton = Array.from(document.querySelectorAll('*'))
                .find(el => el.textContent.trim() === 'Delete' && 
                      (el.getAttribute('role') === 'menuitem' || el.closest('[role="menuitem"]')));

            if (deleteButton) {
                console.log("Delete option found. Attempting to delete post...");
                return safeClick(deleteButton);
            }
        } else {
            console.log("Repost detected. Attempting to undo repost...");
            const repostButton = findRepostButton(postContainer);
            if (repostButton) {
                console.log("Found repost button, attempting to click...");
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
            .find(el => {
                const text = el.textContent.toLowerCase().trim();
                return text.includes('undo repost') || text.includes('unretweet');
            });
        
        if (undoRepostButton) {
            console.log("Undo repost option found. Attempting to undo repost...");
            return safeClick(undoRepostButton);
        }
        console.log("Undo repost option not found in the menu.");
        return false;
    };

    // Click the confirm delete button in modal - using the working version
    const confirmDelete = () => {
        const confirmButton = Array.from(document.querySelectorAll('*'))
            .find(el => {
                const hasExactDeleteText = el.textContent.trim() === 'Delete';
                const isInModal = el.closest('[role="dialog"]');
                const isOrInButton = el.getAttribute('role') === 'button' || el.closest('[role="button"]');
                
                return hasExactDeleteText && isInModal && isOrInButton;
            });
        
        if (confirmButton) {
            console.log("Confirm delete button found in modal.");
            return safeClick(confirmButton?.closest('[role="button"]') || confirmButton);
        } else {
            console.log("Confirm delete button not found in modal. Checking for alternative methods...");
            const fallbackButton = document.querySelector('[data-testid="confirmationSheetConfirm"]');
            return safeClick(fallbackButton);
        }
    };

    // Main deletion process
    const runDelete = () => {
        try {
            console.log("Attempting to click menu...");
            if (clickMenu()) {
                retryCount = 0;
                console.log("Menu clicked successfully");
                
                setTimeout(() => {
                    if (clickDeleteOrUndoRepost()) {
                        setTimeout(() => {
                            if (confirmDelete()) {
                                console.log("Successfully deleted post");
                                setTimeout(runDelete, RETRY_DELAY);
                            }
                        }, CLICK_DELAY);
                    }
                }, CLICK_DELAY);
            } else {
                handleError("No more posts found or couldn't find menu button");
            }
        } catch (error) {
            handleError(`Error: ${error.message}`);
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
        }
    };

    // Start the deletion process
    console.log("Starting post deletion process...");
    runDelete();
}

// Run the script
deleteAllPosts();
