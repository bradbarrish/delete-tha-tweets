function deleteAllPosts() {
    // Configuration
    const CLICK_DELAY = 3000; // Delay between clicks to allow UI to respond
    const RETRY_DELAY = 4000; // Delay before retrying in case of failure
    const MAX_RETRIES = 3;

    let retryCount = 0;

    // Helper function to safely click visible elements
    const safeClick = (element) => {
        if (element && element.offsetParent !== null) { // Check visibility
            try {
                element.click();
                console.log("Clicked element with text:", element.textContent);
                return true;
            } catch (e) {
                console.log("Click failed:", e);
                return false;
            }
        }
        console.log("Element not found or not visible.");
        return false;
    };

    // Click the menu button (three dots)
    const clickMenu = () => {
        const menuButton = document.querySelector('[data-testid="caret"]');
        return safeClick(menuButton);
    };

    // Click the delete option in the menu
    const clickDelete = () => {
        const deleteButton = Array.from(document.querySelectorAll('*'))
            .find(el => el.textContent.trim() === 'Delete' && 
                  (el.getAttribute('role') === 'menuitem' || el.closest('[role="menuitem"]')));
        
        return safeClick(deleteButton || deleteButton?.closest('[role="menuitem"]'));
    };

    // Click the confirm delete button in the modal
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
            
            // Alternative method if modal delete button is not recognized
            const fallbackButton = document.querySelector('[data-testid="confirmationSheetConfirm"]'); // Known Twitter modal button
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
                    console.log("Attempting to click delete option...");
                    if (clickDelete()) {
                        console.log("Delete option clicked successfully");
                        
                        setTimeout(() => {
                            console.log("Attempting to confirm deletion...");
                            if (confirmDelete()) {
                                console.log("Successfully deleted post");
                                setTimeout(runDelete, RETRY_DELAY);
                            } else {
                                handleError("Couldn't find confirm button in modal");
                            }
                        }, CLICK_DELAY);
                    } else {
                        handleError("Couldn't find delete option");
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
