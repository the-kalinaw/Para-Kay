// js/header.js
import { mainHeader, bodyElement, categoryNav /* No need for specific title containers here */ } from './domElements.js';

const SHRINK_THRESHOLD = 70; 
const HEADER_SHRUNK_CLASS = 'shrunk';
const HEADER_LANDING_CLASS = 'landing-fullscreen'; // Class for the fullscreen state
const BODY_HEADER_SHRUNK_CLASS = 'header-is-shrunk';
const BODY_NO_SCROLL_CLASS = 'body-no-scroll'; 
const HEADER_TRANSITION_DURATION = 500; // Match longest CSS transition for #main-header

let isTransitioning = false; 

function handleHeaderScroll() {
    if (!mainHeader) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY > SHRINK_THRESHOLD) {
        if (!mainHeader.classList.contains(HEADER_SHRUNK_CLASS)) {
            if (isTransitioning) return;
            isTransitioning = true;
            bodyElement.classList.add(BODY_NO_SCROLL_CLASS);

            mainHeader.classList.remove(HEADER_LANDING_CLASS); // Remove landing class
            mainHeader.classList.add(HEADER_SHRUNK_CLASS);    // Add shrunk class
            bodyElement.classList.add(BODY_HEADER_SHRUNK_CLASS);
            
            // categoryNav visibility is now handled by CSS based on parent .shrunk or .landing-fullscreen

            setTimeout(() => {
                bodyElement.classList.remove(BODY_NO_SCROLL_CLASS);
                isTransitioning = false;
            }, HEADER_TRANSITION_DURATION);
        }
    } else {
        if (mainHeader.classList.contains(HEADER_SHRUNK_CLASS)) {
            if (isTransitioning) return;
            isTransitioning = true;
            bodyElement.classList.add(BODY_NO_SCROLL_CLASS);

            mainHeader.classList.remove(HEADER_SHRUNK_CLASS);   // Remove shrunk class
            mainHeader.classList.add(HEADER_LANDING_CLASS);  // Add back landing class
            bodyElement.classList.remove(BODY_HEADER_SHRUNK_CLASS);

            // categoryNav visibility is now handled by CSS

            setTimeout(() => {
                bodyElement.classList.remove(BODY_NO_SCROLL_CLASS);
                isTransitioning = false;
            }, HEADER_TRANSITION_DURATION);
        }
    }
}

export function initializeHeaderScroll() {
    if (mainHeader) { 
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll(); // Initial check
        console.log("Header scroll behavior v2 initialized.");
    }
}