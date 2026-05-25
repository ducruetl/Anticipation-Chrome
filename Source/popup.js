(() => {
    "use strict";

	let settings;

    document.addEventListener(
        "DOMContentLoaded",
        () => {
            settings = new Store("settings", {
                enabled: false
            });

            refreshUI();

			const buttonElement = document.getElementById("button-enable");

			if (buttonElement) {
				buttonElement.addEventListener("click", onEnableButtonClick);
			}
        },
        { once: true }
    );

    function updateExtensionIcon(enabled) {
        const iconPaths = enabled
            ? {
                19: "icon48.png",
                38: "icon128.png"
            }
            : {
                19: "inactive48.png",
                38: "inactive128.png"
            };

        chrome.browserAction.setIcon({
            path: iconPaths
        });

        chrome.browserAction.setTitle({
            title: enabled
                ? "Anticipation - Active"
                : "Anticipation - Inactive"
        });
    }

    function updateMessage(enabled) {
        const messageElement = document.getElementById("message");

        if (!messageElement) {
            return;
        }

		const message = enabled
            ? "Anticipation is enabled. YouTube and Twitch time will be hidden after refreshing the tab or opening another video. You can still use keyboard arrow keys to seek."
            : "Anticipation is disabled. YouTube and Twitch time will be shown again after refreshing the tab.";

        messageElement.textContent = message;
    }

	function updateEnableButton(enabled) {
		const buttonElement = document.getElementById("button-enable");

		if (!buttonElement) {
			return;
		}

		const message = enabled ? "Disable" : "Enable";
		const color = enabled ? "#F44336" : "#03A9F4";

		buttonElement.textContent = message;
		buttonElement.style.backgroundColor = color;
	}

	function onEnableButtonClick() {
		const enabled = settings.get("enabled");

		settings.set("enabled", !enabled);
		
		refreshUI();
	}

	function refreshUI() {
        const enabled = settings.get("enabled");

        updateExtensionIcon(enabled);
        updateMessage(enabled);
        updateEnableButton(enabled);
    }
})();