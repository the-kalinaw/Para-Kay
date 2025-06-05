// js/menu.js
import { 
    bodyElement,
    // Get specific menu elements based on which page might be loading
    hamburgerMenuButtonIndex, 
    offcanvasMenuIndex, 
    closeOffcanvasMenuButtonIndex,
    hamburgerMenuButtonAllPoems, 
    offcanvasMenuAllPoems, 
    closeOffcanvasMenuButtonAllPoems 
} from './domElements.js';

// Determine which set of menu elements are active on the current page
const currentHamburgerButton = hamburgerMenuButtonIndex || hamburgerMenuButtonAllPoems;
const currentOffcanvasMenu = offcanvasMenuIndex || offcanvasMenuAllPoems;
const currentCloseMenuButton = closeOffcanvasMenuButtonIndex || closeOffcanvasMenuButtonAllPoems;

const MENU_OPEN_BODY_CLASS = 'offcanvas-menu-is-open'; // Class to toggle on body

function openMenu() {
    if (currentOffcanvasMenu && !currentOffcanvasMenu.classList.contains('open')) {
        currentOffcanvasMenu.classList.add('open');
        bodyElement.classList.add(MENU_OPEN_BODY_CLASS);
        bodyElement.style.overflow = 'hidden'; // Prevent background page scroll
        // Consider focusing the close button or the first menu item for accessibility
        if (currentCloseMenuButton) {
            currentCloseMenuButton.focus();
        }
        // console.log('Menu opened');
    }
}

function closeMenu() {
    if (currentOffcanvasMenu && currentOffcanvasMenu.classList.contains('open')) {
        currentOffcanvasMenu.classList.remove('open');
        bodyElement.classList.remove(MENU_OPEN_BODY_CLASS);
        bodyElement.style.overflow = ''; // Restore scrolling
        // Return focus to the hamburger button for accessibility
        if (currentHamburgerButton) {
            currentHamburgerButton.focus();
        }
        // console.log('Menu closed');
    }
}

export function initializeMenu() {
    if (currentHamburgerButton && currentOffcanvasMenu && currentCloseMenuButton) {
        currentHamburgerButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from propagating to document listener immediately
            // Toggle menu: if open, close it; if closed, open it.
            if (currentOffcanvasMenu.classList.contains('open')) {
                // This case should ideally not happen if hamburger is hidden/disabled when menu is open
                // But as a fallback, allow hamburger to also close if it somehow remains clickable.
                // closeMenu(); 
            } else {
                openMenu();
            }
        });

        currentCloseMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            closeMenu();
        });

        // Close menu when clicking outside of it
        document.addEventListener('click', (event) => {
            if (currentOffcanvasMenu.classList.contains('open')) {
                // Check if the click is outside the menu content AND not on the hamburger button
                if (!currentOffcanvasMenu.contains(event.target) && 
                    event.target !== currentHamburgerButton && 
                    !currentHamburgerButton.contains(event.target) /* Check if click is within hamburger children */
                    ) {
                    closeMenu();
                }
            }
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && currentOffcanvasMenu.classList.contains('open')) {
                closeMenu();
            }
        });
        
        console.log("Menu system initialized.");

    } else {
        // This can be normal if a page doesn't use the full menu system.
        // If you expect it on every page, this indicates an issue with element IDs or selection.
        console.warn("Menu elements (hamburger, offcanvas, or close button) not all found. Menu may not function.");
    }
}