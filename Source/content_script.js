(() => {
    "use strict";

    const isTwitch = location.hostname.includes("twitch.tv");

    const TEXT_HIDDEN = "Time Hidden";
    const TEXT_HIDDEN_FULL = "Time Hidden by Anticipation for YouTube and Twitch";

    /*
     * -------------------------
     * Utility Functions
     * -------------------------
     */

    function forEachNode(selector, callback) {
        document.querySelectorAll(selector).forEach(callback);
    }

    function replaceText(selector, text) {
        forEachNode(selector, element => {
            if (element.textContent !== text) {
                element.textContent = text;
            }
        });
    }

    function removeElements(selector) {
        forEachNode(selector, element => element.remove());
    }

    function replaceElementWithText(selector, text) {
        forEachNode(selector, element => {
            const parent = element.parentNode;

            if (!parent) {
                return;
            }

            if (parent.dataset.anticipationReplaced === "true") {
                element.remove();
                return;
            }

            const replacement = document.createElement("span");
            replacement.textContent = text;

            parent.dataset.anticipationReplaced = "true";

            element.replaceWith(replacement);
        });
    }

    function hideByVisibility(selector) {
        forEachNode(selector, element => {
            element.style.visibility = "hidden";
        });
    }

    /*
     * -------------------------
     * YouTube
     * -------------------------
     */

    function hideYouTubeTimes() {
        // Hide thumbnail durations
        replaceText(".video-time", TEXT_HIDDEN);

        replaceText(
            ".style-scope.ytd-thumbnail-overlay-time-status-renderer",
            TEXT_HIDDEN
        );

        replaceText(
            ".ytp-videowall-still-info-duration",
            TEXT_HIDDEN
        );

        replaceText(
            ".ytp-tooltip-duration",
            TEXT_HIDDEN
        );

        replaceText(
            ".ytp-ce-video-duration",
            TEXT_HIDDEN
        );

        // Player current/duration time
        replaceElementWithText(
            ".ytp-time-duration",
            TEXT_HIDDEN
        );

        removeElements(".ytp-time-current");
        removeElements(".ytp-time-separator");

        // Thumbnail badges
        removeElements(".ytBadgeShapeText");

        // Progress bar
        hideByVisibility(".ytp-progress-bar-container");

        // Comments timestamps / metadata timestamps
        replaceElementWithText(
            ".timestamp",
            TEXT_HIDDEN
        );
    }

    /*
     * -------------------------
     * Twitch
     * -------------------------
     */

    function hideTwitchTimes() {
        replaceText(
            ".player-seek__time.player-seek__time--total",
            TEXT_HIDDEN_FULL
        );

        removeElements(
            ".player-slider.player-slider--roundhandle.js-player-slider"
        );

        replaceText(
            ".card__meta.card__meta--right",
            TEXT_HIDDEN
        );

        forEachNode(".info", element => {
            if (element.textContent.includes(":")) {
                element.textContent = TEXT_HIDDEN;
            }
        });
    }

    /*
     * -------------------------
     * Main
     * -------------------------
     */

    function hideTimes() {
        if (isTwitch) {
            hideTwitchTimes();
        } else {
            hideYouTubeTimes();
        }
    }

    function startObserver() {
        const observer = new MutationObserver(() => {
            hideTimes();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init(enabled) {
        if (!enabled) {
            return;
        }

        hideTimes();
        startObserver();
    }

    /*
     * -------------------------
     * Extension State
     * -------------------------
     */
    
    chrome.runtime.sendMessage(
        { method: "enabled" },
        response => {
            const enabled = Boolean(response?.data);

            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", () => init(enabled), { once: true });
            } else {
                init(enabled);
            }
        }
    );
})();