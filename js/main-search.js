// js/main-search.js
import { initializeTheme } from './theme.js';
import { initializeMenu } from './menu.js';
import { initializeModal } from './modal.js';
import { initializeHeaderScroll } from './header.js';
import { storiesData } from './data.js';
import { openModalWithStory } from './modal.js';
import { initializeSearchToggle } from './search.js';
import { mainHeader, bodyElement } from './domElements.js'; // Ensure mainHeader and bodyElement are imported
import { // Ensure these are correctly imported from domElements.js
    searchResultsGalleryContainer,
    searchResultsMainTitle,
    noResultsMessage,
    searchPageInputOnPage,
    searchPageSubmitButtonOnPage
} from './domElements.js';

// Re-usable function to create gallery items (or import from a shared uiComponents.js)
function createStoryElement(story) {
    const item = document.createElement('div');
    item.classList.add('gallery-item');
    item.dataset.storyId = story.id;
    let mediaElement;
    if (story.media_type === "video") {
        mediaElement = document.createElement('video');
        mediaElement.src = story.media_path;
        mediaElement.classList.add('gallery-item-media');
        mediaElement.preload = 'metadata';
        mediaElement.muted = true;
    } else {
        mediaElement = document.createElement('img');
        mediaElement.src = story.media_path;
        mediaElement.alt = `Preview for ${story.poem_title}`;
        mediaElement.classList.add('gallery-item-media');
        mediaElement.loading = 'lazy';
    }
    item.appendChild(mediaElement);
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('gallery-item-info');
    const poemTitlePreview = document.createElement('h4');
    poemTitlePreview.classList.add('gallery-item-poem-preview');
    poemTitlePreview.textContent = story.poem_title || (story.poem_text ? story.poem_text.split('\n')[0] : "Untitled");
    infoDiv.appendChild(poemTitlePreview);
    const dateDisplay = document.createElement('p');
    dateDisplay.classList.add('gallery-item-date');
    dateDisplay.textContent = story.date_posted;
    infoDiv.appendChild(dateDisplay);
    item.appendChild(infoDiv);
    item.addEventListener('click', () => openModalWithStory(story));
    return item;
}

function displaySearchResultsOnPage(searchTerm) {
    if (!searchResultsGalleryContainer || !searchResultsMainTitle || !noResultsMessage) {
        console.error("Search results display elements not found on search.html!");
        return;
    }
    if (searchPageInputOnPage && searchPageInputOnPage.value !== searchTerm) {
        searchPageInputOnPage.value = searchTerm; // Sync on-page input if search came from header
    }

    searchResultsGalleryContainer.innerHTML = ''; // Clear previous results
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const results = storiesData.filter(story => 
        (story.poem_title && story.poem_title.toLowerCase().includes(normalizedSearchTerm)) ||
        (story.poem_text && story.poem_text.toLowerCase().includes(normalizedSearchTerm)) ||
        (story.song_title && story.song_title.toLowerCase().includes(normalizedSearchTerm)) ||
        (story.song_artist && story.song_artist.toLowerCase().includes(normalizedSearchTerm))
    );

    searchResultsMainTitle.textContent = `Search Results for: "${searchTerm}"`;
    noResultsMessage.classList.toggle('hidden', results.length > 0);

    if (results.length > 0) {
        results.forEach(story => {
            searchResultsGalleryContainer.appendChild(createStoryElement(story));
        });
    }
    console.log(`Displayed ${results.length} results for "${searchTerm}"`);
}

function handleSearchFromPageInput() {
    if (searchPageInputOnPage) {
        const searchTerm = searchPageInputOnPage.value.trim();
        if (searchTerm) {
            displaySearchResultsOnPage(searchTerm);
            const url = new URL(window.location);
            url.searchParams.set('q', searchTerm);
            window.history.pushState({ path: url.href, searchTerm: searchTerm }, '', url.href);
        } else { // If search bar is cleared
            searchResultsMainTitle.textContent = "Search Results";
            searchResultsGalleryContainer.innerHTML = "<p style='text-align:center;'>Please enter a search term.</p>";
            noResultsMessage.classList.add('hidden');
            const url = new URL(window.location);
            url.searchParams.delete('q');
            window.history.pushState({ path: url.href }, '', url.href);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main-search.js loaded for search.html");

    initializeTheme(); 
    initializeMenu();  
    initializeModal(); 
    // Since search.html uses the main header, initialize its behaviors too
    if (mainHeader) { // Initialize header scroll only if mainHeader exists
        initializeHeaderScroll();
    }    
    // The main header's search functionality is initialized via main-index.js's include of search.js
    // but we need to make sure its search.js is also linked in search.html or this main-search.js
    // calls a generic search initialization for the header if it exists.
    // For simplicity, ensure `search.js` is also imported and initialized if `mainHeader` components are present
    // OR make initializeSearchToggle in search.js safe to call even if elements aren't there.
    // Let's assume search.js (for header search) is initialized via main-index.js logic and search.html loads it.
    // Alternatively, call it here too if needed:
    initializeSearchToggle(); // If search.js is designed to be page-agnostic for header search
    

    const urlParams = new URLSearchParams(window.location.search);
    let query = urlParams.get('q');

    if (searchPageInputOnPage) {
        searchPageInputOnPage.value = query || ''; 
    }

    if (query) {
        if(searchResultsMainTitle) {
            searchResultsMainTitle.textContent = `Searching for: "${query}"...`;
            // Scroll to the results title after a very short delay to allow layout
            setTimeout(() => {
                // Force header to shrink if not already (by simulating a scroll)
                // This ensures the margin-top is applied correctly before scrolling to content
                if (mainHeader && !mainHeader.classList.contains('shrunk')) {
                    window.scrollTo(0, 100); // Scroll down a bit to trigger shrink
                    // A more robust way might be to directly call a shrink function if available
                    // or wait for the scroll event to naturally trigger it.
                    // For now, this scroll often works.
                }
                // After a further small delay for header shrink to complete:
                setTimeout(() => {
                    searchResultsMainTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100); // Adjust delay if needed for header shrink animation
            }, 50); 
        }
        displaySearchResultsOnPage(query);
    } else {
        // ... (no query handling) ...
    }

    if (searchPageSubmitButtonOnPage) {
        searchPageSubmitButtonOnPage.addEventListener('click', handleSearchFromPageInput);
    }
    if (searchPageInputOnPage) {
        searchPageInputOnPage.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleSearchFromPageInput();
            }
        });
    }

    // Listen for the custom event dispatched by the header search on this page
    document.addEventListener('headerSearchUpdated', (event) => {
        const newSearchTerm = event.detail.searchTerm;
        console.log("headerSearchUpdated event caught in main-search.js, term:", newSearchTerm);
        if (searchPageInputOnPage) {
            searchPageInputOnPage.value = newSearchTerm; // Update on-page search bar
        }
        displaySearchResultsOnPage(newSearchTerm);
    });

    // Handle browser back/forward buttons for search query changes
    window.addEventListener('popstate', (event) => {
        const popUrlParams = new URLSearchParams(window.location.search);
        const popQuery = popUrlParams.get('q');
        if (searchPageInputOnPage) {
            searchPageInputOnPage.value = popQuery || '';
        }
        if (popQuery) {
            displaySearchResultsOnPage(popQuery);
        } else {
            if (searchResultsMainTitle) searchResultsMainTitle.textContent = "Search Poems";
            if (searchResultsGalleryContainer) searchResultsGalleryContainer.innerHTML = "<p style='text-align:center;'>Use the search bar to find poems.</p>";
            if (noResultsMessage) noResultsMessage.classList.add('hidden');
        }
    });
});