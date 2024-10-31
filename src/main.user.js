// ==UserScript==
// @name         Github ColorsDotJson
// @namespace    https://github.com/PatoFlamejanteTV
// @version      1.0
// @description  Changes display name, additional name, and pronouns color based on separate values in a JSON file from the GitHub repository
// @license      MIT
// @match        *://github.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const username = window.location.pathname.split('/').filter(Boolean)[0];
    const jsonFileUrl = `https://raw.githubusercontent.com/${username}/${username}/main/color.json`;

    // Select elements for display name, additional name, and pronouns
    const nameElement = document.querySelector('.p-name.vcard-fullname.d-block.overflow-hidden[itemprop="name"]');
    const additionalNameElement = document.querySelector('.p-nickname.vcard-username.d-block[itemprop="additionalName"]');
    const pronounsElement = document.querySelector('.p-nickname.vcard-username.d-block[itemprop="additionalName"] [itemprop="pronouns"]');

    function fetchColorFromFile(url) {
        return fetch(url)
            .then(response => response.ok ? response.json() : null)
            .then(data => data ? data : null)
            .catch(() => null);
    }

    function applyColor(element, color) {
        if (element && color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
            element.style.color = color;
        }
    }

    function attemptColorChange(attempts) {
        fetchColorFromFile(jsonFileUrl).then(data => {
            if (data) {
                // Apply colors to each element if specified in JSON
                applyColor(nameElement, data.nameColor);
                applyColor(additionalNameElement, data.additionalNameColor);
                applyColor(pronounsElement, data.pronounsColor);
            } else if (attempts > 0) {
                console.log(`color.json file not found or invalid. Retrying... (${attempts} attempts left)`);
                setTimeout(() => attemptColorChange(attempts - 1), 2000);
            } else {
                console.log("color.json file not found or invalid after multiple attempts.");
            }
        });
    }

    if (nameElement || additionalNameElement || pronounsElement) {
        attemptColorChange(3); // Attempts to find the JSON file 3 times
    }

})();
