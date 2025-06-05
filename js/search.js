// js/search.js
import { 
    searchIconButton,      // Use alias if needed
    searchBarContainer, 
    searchInput, 
    searchSubmitButton 
} from './domElements.js';

const SEARCH_BAR_ACTIVE_CLASS = 'active';

function performSearchAction() {
    if (!searchInput) return;
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        const currentPath = window.location.pathname;
        const searchPageName = 'search.html'; // The name of your search results page

        if (currentPath.endsWith(`/${searchPageName}`) || currentPath === searchPageName) {
            // ALREADY ON SEARCH.HTML: Update URL and dispatch event for main-search.js to pick up
            const url = new URL(window.location);
            url.searchParams.set('q', searchTerm);
            // Push state to update URL without full reload, then dispatch custom event
            window.history.pushState({ path: url.href, searchTerm: searchTerm }, '', url.href);
            // Dispatch a custom event that main-search.js can listen for
            document.dispatchEvent(new CustomEvent('headerSearchUpdated', { detail: { searchTerm } }));
            console.log("Header search initiated on search.html, term:", searchTerm);
        } else {
            // Redirect from other pages (e.g., index.html)
            window.location.href = `${searchPageName}?q=${encodeURIComponent(searchTerm)}`;
        }
    }
    closeSearchBar(); 
}

// openSearchBar, closeSearchBar, toggleSearchBar (keep as is)
function openSearchBar() {
    if (searchBarContainer && searchInput) {
        searchBarContainer.classList.add(SEARCH_BAR_ACTIVE_CLASS);
        searchInput.focus();
    }
}
function closeSearchBar() {
    if (searchBarContainer && searchInput) {
        searchBarContainer.classList.remove(SEARCH_BAR_ACTIVE_CLASS);
    }
}
function toggleSearchBar(event) {
    event.stopPropagation();
    if (searchBarContainer) {
        searchBarContainer.classList.contains(SEARCH_BAR_ACTIVE_CLASS) ? closeSearchBar() : openSearchBar();
    }
}


export function initializeSearchToggle() {
    // Ensure these elements exist (they are part of the main header)
    if (searchIconButton && searchBarContainer && searchSubmitButton && searchInput) {
        searchIconButton.addEventListener('click', toggleSearchBar);
        searchSubmitButton.addEventListener('click', performSearchAction);
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearchAction();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && searchBarContainer.classList.contains(SEARCH_BAR_ACTIVE_CLASS)) {
                closeSearchBar();
            }
        });
        document.addEventListener('click', (event) => {
            if (searchBarContainer.classList.contains(SEARCH_BAR_ACTIVE_CLASS)) {
                if (!searchBarContainer.contains(event.target) && 
                    !searchIconButton.contains(event.target) &&
                    event.target !== searchIconButton) {
                    closeSearchBar();
                }
            }
        });
        console.log("Search bar (redirect) system initialized for index.html.");
    }
}