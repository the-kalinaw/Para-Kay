// js/main-index.js
import { initializeTheme } from './theme.js';
import { initializeMenu } from './menu.js';
import { initializeHeaderScroll } from './header.js';
import { initializeSearchToggle } from './search.js';
import { displayRecentStories, displayFavoriteStories, initializeMonthlyArchive } from './gallery.js'; // Added initializeMonthlyArchive
import { initializeModal } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main-index.js loaded");
    initializeTheme();
    initializeMenu(); 
    initializeHeaderScroll(); 
    initializeSearchToggle(); 
    initializeModal();        

    displayRecentStories();    
    displayFavoriteStories(false);  
    initializeMonthlyArchive(); // Initialize the monthly archive section

    const viewAllFavoritesButton = document.getElementById('view-all-favorites-button');
    if (viewAllFavoritesButton) {
        viewAllFavoritesButton.addEventListener('click', () => {
            displayFavoriteStories(true); // Call with showAll = true
            // Optionally change button text or hide it completely after clicking
            // viewAllFavoritesButton.textContent = "Showing All Favorites";
            // viewAllFavoritesButton.disabled = true; 
        });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});