// js/main-all-poems.js
import { initializeTheme } from './theme.js';
import { initializeMenu } from './menu.js';
import { initializeModal } from './modal.js';
import { initializeAllPoemsDisplay } from './gallery-all.js'; // IMPORT from new file
import { allPoemsGalleryContainerPage, loadingIndicator } from './domElements.js';
import { initializeHeaderScroll } from './header.js';
import { initializeSearchToggle } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main-all-poems.js loaded");
    initializeTheme();
    initializeMenu(); 
    initializeModal(); 
    initializeHeaderScroll(); 
    initializeSearchToggle ();
    
    if (allPoemsGalleryContainerPage) {
        initializeAllPoemsDisplay(allPoemsGalleryContainerPage, loadingIndicator); // Pass elements
    } else {
        console.error("#all-poems-gallery-container not found on all-poems.html!");
    }

    const currentYearSpanAllPoems = document.getElementById('current-year-all-poems');
    if (currentYearSpanAllPoems) {
        currentYearSpanAllPoems.textContent = new Date().getFullYear();
    }
});