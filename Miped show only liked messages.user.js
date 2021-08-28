// ==UserScript==
// @name         Miped show only liked messages
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Показывает только залайканые сообщения
// @author       Andronio
// @homepage     https://github.com/Andronio2/Miped-show-only-liked
// @supportURL   https://github.com/Andronio2/Miped-show-only-liked/issues
// @updateURL    https://github.com/Andronio2/Miped-show-only-liked/raw/main/Miped%20show%20only%20liked%20messages.user.js
// @downloadURL  https://github.com/Andronio2/Miped-show-only-liked/raw/main/Miped%20show%20only%20liked%20messages.user.js
// @match        https://miped.ru/f/threads/*
// @match        https://mipped.com/f/threads/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function repeat() {
    'use strict';

/*
 * Здесь начинать править настройки
*/

let showAfterLikes = 2;
let lastPageFilter = 0;

/*
 * Далее не трогать
*/

    let nextPage = document.querySelector(".pageNav-jump--next");
    let hasLikes = false;
    if (lastPageFilter || nextPage) {

        let messages = document.querySelectorAll("article.message");
        let filtered = false
        messages.forEach(message => {
            let likes = message.querySelector('.reactionsBar-link');
            if (!likes) {
                message.style.display = 'none';
                filtered = true;
            } else {
                let likesCount = likes.innerText.split(/,|\sи\s/).length;
                if (likesCount == 4) {
                    let addLikes = likes.innerText.match(/\d{1,4}(?=\sдругих)/);
                    if (addLikes) likesCount += +addLikes[0] - 1;
                }
                if (likesCount >= showAfterLikes) hasLikes = true;
                else message.style.display = 'none';
                filtered = true;
            }
        });
        if (filtered) {
            let showBtn = document.createElement('div');
            showBtn.innerHTML = '<button id="liked-show-all" class="button button--cta">Показать скрытые</button>';
            showBtn.style.paddingBottom = '10px';
            document.querySelector('.block-outer').after(showBtn);
            document.getElementById('liked-show-all').addEventListener('click', () => {
                messages.forEach(message => {
                    message.style.display = null;
                });
            });
        }
    }
    if (!hasLikes) {
        if (nextPage) nextPage.click();
    }
})();
