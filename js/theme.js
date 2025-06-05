// js/theme.js
import { htmlElement, themeToggleButtonIndex, themeToggleButtonAllPoems } from './domElements.js';

const sunIconClass = 'fa-sun';
const moonIconClass = 'fa-moon';

// Determine which theme button is present on the current page
const currentThemeToggleButton = themeToggleButtonIndex || themeToggleButtonAllPoems;
const themeButtonIcon = currentThemeToggleButton ? currentThemeToggleButton.querySelector('i') : null;
const themeButtonText = currentThemeToggleButton ? currentThemeToggleButton.querySelector('.theme-button-text') : null;


function updateButton(isDark) {
    if (themeButtonIcon) {
        themeButtonIcon.classList.remove(isDark ? moonIconClass : sunIconClass);
        themeButtonIcon.classList.add(isDark ? sunIconClass : moonIconClass);
    }
}

export function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    updateButton(isDark);
}

export function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
}

export function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
    applyTheme(savedTheme);

    if (currentThemeToggleButton) {
        currentThemeToggleButton.addEventListener('click', toggleTheme);
    } else {
        console.warn("Theme toggle button not found on this page.");
    }
}